import { z } from 'zod';

// Salary Calculator Form Schema
export const salaryFormSchema = z.object({
  employeeName: z
    .string()
    .min(1, 'Employee name is required')
    .max(100, 'Employee name is too long'),
  
  grossSalary: z
    .string()
    .min(1, 'Gross salary is required')
    .refine((val) => {
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num > 0;
    }, 'Please enter a valid salary amount')
    .refine((val) => {
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return num <= 10000000;
    }, 'Salary amount seems unreasonably high'),
  
  ageCategory: z.enum(['under_65', '65_to_75', 'over_75'], {
    errorMap: () => ({ message: 'Please select an age category' }),
  }),
  
  medicalAid: z
    .string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num >= 0;
    }, 'Please enter a valid medical aid amount'),
  
  pensionFund: z
    .string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num >= 0;
    }, 'Please enter a valid pension fund amount'),
  
  otherDeductions: z
    .string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num >= 0;
    }, 'Please enter a valid deduction amount'),
  
  overtimePay: z
    .string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num >= 0;
    }, 'Please enter a valid overtime amount'),
  
  allowances: z
    .string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num >= 0;
    }, 'Please enter a valid allowance amount'),
}).refine((data) => {
  // Cross-field validation: total deductions shouldn't exceed gross income
  const grossSalary = parseFloat(data.grossSalary.replace(/[^0-9.]/g, '')) || 0;
  const medicalAid = parseFloat(data.medicalAid.replace(/[^0-9.]/g, '')) || 0;
  const pensionFund = parseFloat(data.pensionFund.replace(/[^0-9.]/g, '')) || 0;
  const otherDeductions = parseFloat(data.otherDeductions.replace(/[^0-9.]/g, '')) || 0;
  const overtimePay = parseFloat(data.overtimePay.replace(/[^0-9.]/g, '')) || 0;
  const allowances = parseFloat(data.allowances.replace(/[^0-9.]/g, '')) || 0;
  
  const totalIncome = grossSalary + overtimePay + allowances;
  const totalDeductions = medicalAid + pensionFund + otherDeductions;
  
  return totalDeductions <= totalIncome;
}, {
  message: 'Total deductions cannot exceed total income',
  path: ['otherDeductions'], // Show error on last deduction field
});

// User Profile Schema
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long'),
  
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name is too long'),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
});

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long'),
  
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name is too long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Utility functions for form data conversion
export function parseFormCurrency(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}

export function formatFormCurrency(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString('en-ZA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

// Type exports
export type SalaryFormData = z.infer<typeof salaryFormSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>; 