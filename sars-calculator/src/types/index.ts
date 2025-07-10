// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  subscription_tier: 'free' | 'business' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  calculations_used: number;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  subscription_tier: string;
  subscription_status: string;
  calculations_used: number;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}

// Salary Calculation Types
export interface SalaryInputs {
  grossSalary: number;
  medicalAid: number;
  pensionFund: number;
  otherDeductions: number;
  overtimePay: number;
  allowances: number;
  ageCategory: 'under_65' | '65_to_75' | 'over_75';
}

export interface SalaryCalculation {
  id?: string;
  user_id?: string;
  employee_name?: string;
  grossSalary: number;
  taxableIncome: number;
  payeTax: number;
  uifContribution: number;
  netSalary: number;
  deductions: {
    medicalAid: number;
    pensionFund: number;
    other: number;
    total: number;
  };
  additions: {
    overtime: number;
    allowances: number;
    total: number;
  };
  taxBreakdown: TaxBracketResult[];
  calculation_data?: any;
  created_at?: string;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface TaxBracketResult {
  bracket: TaxBracket;
  taxableAmount: number;
  taxAmount: number;
}

export interface SARSTaxTable {
  id: string;
  tax_year: string;
  age_bracket: 'under_65' | '65_to_75' | 'over_75';
  threshold_amount: number;
  tax_brackets: TaxBracket[];
  rebates: {
    primary: number;
    secondary?: number;
    tertiary?: number;
  };
  is_active: boolean;
  created_at: string;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  calculation_limit: number;
  features: string[];
  is_active: boolean;
}

// Form Types
export interface SalaryFormData {
  employeeName: string;
  grossSalary: string;
  ageCategory: 'under_65' | '65_to_75' | 'over_75';
  medicalAid: string;
  pensionFund: string;
  otherDeductions: string;
  overtimePay: string;
  allowances: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface CalculationHistory {
  calculations: SalaryCalculation[];
  total: number;
  page: number;
  limit: number;
}

// Component Props Types
export interface CalculatorProps {
  onCalculate: (calculation: SalaryCalculation) => void;
  loading?: boolean;
}

export interface ResultsProps {
  calculation: SalaryCalculation;
  onSave?: () => void;
  onExport?: () => void;
}

// Constants
export const AGE_CATEGORIES = {
  under_65: 'Under 65',
  '65_to_75': '65 to 75',
  over_75: 'Over 75'
} as const;

export const SUBSCRIPTION_TIERS = {
  free: 'Free',
  business: 'Business',
  enterprise: 'Enterprise'
} as const; 