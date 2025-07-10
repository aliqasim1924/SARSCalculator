import type { SalaryInputs, SalaryCalculation, TaxBracketResult, SARSTaxTable } from '../types';
import { 
  getActiveTaxTable, 
  UIF_RATE, 
  UIF_MAX_MONTHLY_SALARY, 
  UIF_MAX_MONTHLY_CONTRIBUTION,
  PENSION_FUND_LIMITS 
} from '../data/sars-tax-tables';

/**
 * Calculate PAYE tax based on SARS tax brackets
 * NOTE: Monthly taxable income is converted to annual for tax calculation,
 * then divided by 12 for monthly PAYE amount
 */
export function calculatePAYETax(
  monthlyTaxableIncome: number, 
  ageCategory: 'under_65' | '65_to_75' | 'over_75'
): { tax: number; breakdown: TaxBracketResult[] } {
  const taxTable = getActiveTaxTable(ageCategory);
  const breakdown: TaxBracketResult[] = [];
  
  // Convert monthly income to annual for tax calculation
  const annualTaxableIncome = monthlyTaxableIncome * 12;
  
  let totalTax = 0;
  let remainingIncome = annualTaxableIncome;

  // Apply tax brackets to annual income
  for (const bracket of taxTable.tax_brackets) {
    if (annualTaxableIncome <= bracket.min) break;

    const bracketMin = bracket.min;
    const bracketMax = bracket.max === Infinity ? annualTaxableIncome : bracket.max;
    
    // Calculate the portion of income that falls in this bracket
    const incomeInBracket = Math.min(annualTaxableIncome, bracketMax) - Math.max(0, bracketMin);
    
    if (incomeInBracket > 0) {
      const taxInBracket = incomeInBracket * bracket.rate;
      totalTax += taxInBracket;

      breakdown.push({
        bracket,
        taxableAmount: incomeInBracket,
        taxAmount: taxInBracket
      });
    }
  }

  // Apply annual rebates
  const totalRebates = Object.values(taxTable.rebates).reduce((sum, rebate) => sum + (rebate || 0), 0);
  const annualTaxAfterRebates = Math.max(0, totalTax - totalRebates);
  
  // Convert back to monthly PAYE
  const monthlyTax = annualTaxAfterRebates / 12;

  return {
    tax: monthlyTax,
    breakdown
  };
}

/**
 * Calculate UIF contribution
 */
export function calculateUIF(grossSalary: number): number {
  const cappedSalary = Math.min(grossSalary, UIF_MAX_MONTHLY_SALARY);
  const uifContribution = cappedSalary * UIF_RATE;
  return Math.min(uifContribution, UIF_MAX_MONTHLY_CONTRIBUTION);
}

/**
 * Validate pension fund deduction
 */
export function validatePensionFund(pensionFund: number, grossSalary: number): number {
  const maxByPercentage = grossSalary * PENSION_FUND_LIMITS.max_deduction_percentage;
  const maxByAmount = PENSION_FUND_LIMITS.max_annual_amount / 12; // Monthly limit
  
  return Math.min(pensionFund, Math.min(maxByPercentage, maxByAmount));
}

/**
 * Main salary calculation function
 */
export function calculateSalary(inputs: SalaryInputs): SalaryCalculation {
  const {
    grossSalary,
    medicalAid,
    pensionFund,
    otherDeductions,
    overtimePay,
    allowances,
    ageCategory
  } = inputs;

  // Calculate total additions
  const totalAdditions = overtimePay + allowances;
  const totalGrossIncome = grossSalary + totalAdditions;

  // Validate and calculate deductions
  const validatedPensionFund = validatePensionFund(pensionFund, totalGrossIncome);
  const totalPreTaxDeductions = validatedPensionFund + medicalAid;
  const totalDeductions = totalPreTaxDeductions + otherDeductions;

  // Calculate taxable income
  const taxableIncome = Math.max(0, totalGrossIncome - totalPreTaxDeductions);

  // Calculate PAYE tax
  const { tax: payeTax, breakdown: taxBreakdown } = calculatePAYETax(taxableIncome, ageCategory);

  // Calculate UIF
  const uifContribution = calculateUIF(totalGrossIncome);

  // Calculate net salary
  const netSalary = totalGrossIncome - payeTax - uifContribution - totalDeductions;

  return {
    grossSalary: totalGrossIncome,
    taxableIncome,
    payeTax,
    uifContribution,
    netSalary: Math.max(0, netSalary),
    deductions: {
      medicalAid,
      pensionFund: validatedPensionFund,
      other: otherDeductions,
      total: totalDeductions
    },
    additions: {
      overtime: overtimePay,
      allowances,
      total: totalAdditions
    },
    taxBreakdown
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Calculate tax percentage
 */
export function calculateTaxPercentage(payeTax: number, grossSalary: number): number {
  if (grossSalary === 0) return 0;
  return (payeTax / grossSalary) * 100;
}

/**
 * Calculate net percentage
 */
export function calculateNetPercentage(netSalary: number, grossSalary: number): number {
  if (grossSalary === 0) return 0;
  return (netSalary / grossSalary) * 100;
}

/**
 * Validate salary inputs
 */
export function validateSalaryInputs(inputs: SalaryInputs): string[] {
  const errors: string[] = [];

  if (inputs.grossSalary <= 0) {
    errors.push('Gross salary must be greater than 0');
  }

  if (inputs.grossSalary > 10000000) {
    errors.push('Gross salary seems unreasonably high');
  }

  if (inputs.medicalAid < 0) {
    errors.push('Medical aid contribution cannot be negative');
  }

  if (inputs.pensionFund < 0) {
    errors.push('Pension fund contribution cannot be negative');
  }

  if (inputs.otherDeductions < 0) {
    errors.push('Other deductions cannot be negative');
  }

  if (inputs.overtimePay < 0) {
    errors.push('Overtime pay cannot be negative');
  }

  if (inputs.allowances < 0) {
    errors.push('Allowances cannot be negative');
  }

  // Check if total deductions exceed gross salary
  const totalDeductions = inputs.medicalAid + inputs.pensionFund + inputs.otherDeductions;
  const totalGross = inputs.grossSalary + inputs.overtimePay + inputs.allowances;
  
  if (totalDeductions > totalGross) {
    errors.push('Total deductions cannot exceed gross income');
  }

  return errors;
} 