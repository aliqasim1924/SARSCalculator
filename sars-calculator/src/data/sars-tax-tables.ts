import type { SARSTaxTable, TaxBracket } from '../types';

// SARS Tax Tables for 2025 Tax Year
export const SARS_TAX_BRACKETS_2025: TaxBracket[] = [
  { min: 0, max: 237100, rate: 0.18 },
  { min: 237101, max: 370500, rate: 0.26 },
  { min: 370501, max: 512800, rate: 0.31 },
  { min: 512801, max: 673000, rate: 0.36 },
  { min: 673001, max: 857900, rate: 0.39 },
  { min: 857901, max: 1817000, rate: 0.41 },
  { min: 1817001, max: Infinity, rate: 0.45 }
];

export const SARS_TAX_TABLES_2025: SARSTaxTable[] = [
  {
    id: 'sars-2025-under-65',
    tax_year: '2025',
    age_bracket: 'under_65',
    threshold_amount: 95750,
    tax_brackets: SARS_TAX_BRACKETS_2025,
    rebates: {
      primary: 17235
    },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'sars-2025-65-to-75',
    tax_year: '2025',
    age_bracket: '65_to_75',
    threshold_amount: 148217,
    tax_brackets: SARS_TAX_BRACKETS_2025,
    rebates: {
      primary: 17235,
      secondary: 9444
    },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'sars-2025-over-75',
    tax_year: '2025',
    age_bracket: 'over_75',
    threshold_amount: 165631,
    tax_brackets: SARS_TAX_BRACKETS_2025,
    rebates: {
      primary: 17235,
      secondary: 9444,
      tertiary: 3145
    },
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// UIF Constants
export const UIF_RATE = 0.01; // 1%
export const UIF_MAX_MONTHLY_SALARY = 17712; // R17,712 per month
export const UIF_MAX_MONTHLY_CONTRIBUTION = 177.12; // R177.12 per month

// Medical Aid Tax Credits for 2025
export const MEDICAL_AID_CREDITS_2025 = {
  main_member: 374,
  first_dependant: 374,
  additional_dependants: 249 // each
};

// Pension Fund Limits
export const PENSION_FUND_LIMITS = {
  max_deduction_percentage: 0.075, // 7.5% of gross salary
  max_annual_amount: 350000 // R350,000 per year
};

// Get active tax table for age category
export const getActiveTaxTable = (ageCategory: 'under_65' | '65_to_75' | 'over_75'): SARSTaxTable => {
  const table = SARS_TAX_TABLES_2025.find(
    table => table.age_bracket === ageCategory && table.is_active
  );
  
  if (!table) {
    throw new Error(`No active tax table found for age category: ${ageCategory}`);
  }
  
  return table;
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    calculation_limit: 10,
    features: [
      '10 calculations per month',
      'Basic salary breakdown',
      'Tax calculation',
      'Email support'
    ],
    is_active: true
  },
  {
    id: 'business',
    name: 'Business',
    price_monthly: 89,
    price_annual: 890,
    calculation_limit: 100,
    features: [
      '100 calculations per month',
      'Detailed salary breakdown',
      'Tax calculation & optimization',
      'Export to PDF/Excel',
      'Bulk calculations',
      'Priority support',
      'Historical data'
    ],
    is_active: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: 199,
    price_annual: 1990,
    calculation_limit: -1, // Unlimited
    features: [
      'Unlimited calculations',
      'Advanced analytics',
      'Custom tax scenarios',
      'API access',
      'Team management',
      'White-label options',
      'Dedicated support',
      'Custom integrations'
    ],
    is_active: true
  }
]; 