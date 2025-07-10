import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Download, TrendingUp, TrendingDown, DollarSign, AlertCircle, Crown, FileText, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { salaryFormSchema, type SalaryFormData, parseFormCurrency } from '../lib/validation';
import { calculateSalary, formatCurrency, calculateTaxPercentage, calculateNetPercentage } from '../lib/salary-calculator';
import { exportToExcel, exportToPDF } from '../lib/export-utils';
import { AGE_CATEGORIES } from '../types';
import type { SalaryCalculation } from '../types';
import { supabase } from '../lib/supabase';
import LimitReachedModal from '../components/LimitReachedModal';
import toast from 'react-hot-toast';

export default function CalculatorPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [calculation, setCalculation] = useState<SalaryCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtLimit, setIsAtLimit] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      employeeName: '',
      grossSalary: '',
      ageCategory: 'under_65',
      medicalAid: '',
      pensionFund: '',
      otherDeductions: '',
      overtimePay: '',
      allowances: '',
    },
  });

  // Check subscription limits
  useEffect(() => {
    if (profile) {
      const isUnlimited = profile.monthly_limit === -1; // Enterprise
      const reachedLimit = profile.calculations_used >= profile.monthly_limit;
      setIsAtLimit(!isUnlimited && reachedLimit);
    }
  }, [profile]);

  const checkUsageLimit = () => {
    if (!profile) return true; // Allow if no profile (guest user)
    
    if (profile.monthly_limit === -1) return true; // Enterprise unlimited
    
    return profile.calculations_used < profile.monthly_limit;
  };

  const incrementUsageCount = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          calculations_used: profile.calculations_used + 1 
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating usage count:', error);
      } else {
        // Refresh profile in background without blocking
        refreshProfile().catch(err => console.error('Profile refresh failed:', err));
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const saveCalculation = async (calculationData: SalaryCalculation) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('calculations')
        .insert({
          user_id: user.id,
          employee_name: calculationData.employee_name || '',
          gross_salary: calculationData.grossSalary,
          net_salary: calculationData.netSalary,
          paye_tax: calculationData.payeTax,
          uif_contribution: calculationData.uifContribution,
          age_category: 'under_65', // Default for now
          deductions: {
            medical_aid: calculationData.deductions.medicalAid,
            pension_fund: calculationData.deductions.pensionFund,
            other: calculationData.deductions.other,
            total: calculationData.deductions.total
          },
          additions: {
            overtime: calculationData.additions.overtime,
            allowances: calculationData.additions.allowances,
            total: calculationData.additions.total
          }
        });

      if (error) {
        console.error('Save error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Save calculation error:', error);
      return false;
    }
  };

  const onSubmit = async (data: SalaryFormData) => {
    if (!checkUsageLimit()) {
      setShowLimitModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Perform the official calculation (counts towards usage)
      const inputs = {
        grossSalary: parseFormCurrency(data.grossSalary),
        medicalAid: parseFormCurrency(data.medicalAid || '0'),
        pensionFund: parseFormCurrency(data.pensionFund || '0'),
        otherDeductions: parseFormCurrency(data.otherDeductions || '0'),
        overtimePay: parseFormCurrency(data.overtimePay || '0'),
        allowances: parseFormCurrency(data.allowances || '0'),
        ageCategory: data.ageCategory,
      };

      const result = calculateSalary(inputs);
      const calculationWithName = {
        ...result,
        employee_name: data.employeeName,
      };

      // Update calculation state first
      setCalculation(calculationWithName);

      // For logged-in users, update usage and save
      if (user) {
        // Run both operations in parallel but don't wait for refreshProfile
        const [saved] = await Promise.all([
          saveCalculation(calculationWithName),
          incrementUsageCount().catch(err => console.error('Usage update failed:', err))
        ]);
        
        if (saved) {
          toast.success('Calculation completed and saved!');
        } else {
          toast.success('Calculation completed! (Save failed)');
        }
      } else {
        toast.success('Calculation completed!');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('An error occurred during calculation');
    } finally {
      // Ensure loading is always turned off
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  const handleReset = () => {
    reset();
    setCalculation(null);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!calculation) return;
    
    // Check if user has export privileges
    const hasExportFeature = profile?.subscription_tier !== 'free';
    
    if (!hasExportFeature) {
      toast.error('Export feature is available for Business and Enterprise plans only!');
      setShowLimitModal(true);
      return;
    }
    
    try {
      if (format === 'pdf') {
        exportToPDF(calculation);
        toast.success('PDF export generated successfully!');
      } else {
        exportToExcel(calculation);
        toast.success('Excel export downloaded successfully!');
      }
    } catch (error) {
      toast.error('Export failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            SARS Salary Calculator
          </h1>
          <p className="text-xl text-slate-600">
            Calculate accurate PAYE tax, UIF contributions, and net salaries
          </p>
          
          {/* Usage Indicator for logged-in users */}
          {profile && (
            <div className="mt-4">
              {isAtLimit ? (
                <div className="inline-flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  <span>Monthly limit reached ({profile.calculations_used}/{profile.monthly_limit})</span>
                  <Link 
                    to="/subscription" 
                    className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    Upgrade Now
                  </Link>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
                  <span>
                    {profile.monthly_limit === -1 
                      ? `${profile.calculations_used} calculations used (Unlimited)`
                      : `${profile.calculations_used}/${profile.monthly_limit} calculations used this month`
                    }
                  </span>
                </div>
              )}
              
              {/* Upgrade Banner for Free Users */}
              {profile.subscription_tier === 'free' && !isAtLimit && (
                <div className="mt-4 bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-secondary-600 rounded-full p-2">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-900">Unlock Premium Features</h4>
                        <p className="text-sm text-slate-600">Get unlimited calculations, export options, and priority support</p>
                      </div>
                    </div>
                    <Link 
                      to="/subscription"
                      className="btn btn-secondary text-sm"
                    >
                      View Plans
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="h-6 w-6 text-secondary-600" />
              <h2 className="text-2xl font-semibold text-primary-900">Salary Details</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="employeeName" className="label">
                  Employee Name
                </label>
                <input
                  {...register('employeeName')}
                  id="employeeName"
                  type="text"
                  className={`input ${errors.employeeName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter employee name"
                />
                {errors.employeeName && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="grossSalary" className="label">
                  Gross Salary (Monthly) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">R</span>
                  </div>
                  <input
                    {...register('grossSalary')}
                    id="grossSalary"
                    type="text"
                    className={`input pl-8 ${errors.grossSalary ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="25,000.00"
                  />
                </div>
                {errors.grossSalary && (
                  <p className="mt-1 text-sm text-red-600">{errors.grossSalary.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="ageCategory" className="label">
                  Age Category *
                </label>
                <select
                  {...register('ageCategory')}
                  id="ageCategory"
                  className={`input ${errors.ageCategory ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                >
                  {Object.entries(AGE_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.ageCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.ageCategory.message}</p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium text-primary-900 mb-4">Deductions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="medicalAid" className="label">
                      Medical Aid
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">R</span>
                      </div>
                      <input
                        {...register('medicalAid')}
                        id="medicalAid"
                        type="text"
                        className={`input pl-8 ${errors.medicalAid ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.medicalAid && (
                      <p className="mt-1 text-sm text-red-600">{errors.medicalAid.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pensionFund" className="label">
                      Pension Fund
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">R</span>
                      </div>
                      <input
                        {...register('pensionFund')}
                        id="pensionFund"
                        type="text"
                        className={`input pl-8 ${errors.pensionFund ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.pensionFund && (
                      <p className="mt-1 text-sm text-red-600">{errors.pensionFund.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="otherDeductions" className="label">
                      Other Deductions
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">R</span>
                      </div>
                      <input
                        {...register('otherDeductions')}
                        id="otherDeductions"
                        type="text"
                        className={`input pl-8 ${errors.otherDeductions ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.otherDeductions && (
                      <p className="mt-1 text-sm text-red-600">{errors.otherDeductions.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium text-primary-900 mb-4">Additional Income</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="overtimePay" className="label">
                      Overtime Pay
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">R</span>
                      </div>
                      <input
                        {...register('overtimePay')}
                        id="overtimePay"
                        type="text"
                        className={`input pl-8 ${errors.overtimePay ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.overtimePay && (
                      <p className="mt-1 text-sm text-red-600">{errors.overtimePay.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="allowances" className="label">
                      Allowances
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">R</span>
                      </div>
                      <input
                        {...register('allowances')}
                        id="allowances"
                        type="text"
                        className={`input pl-8 ${errors.allowances ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.allowances && (
                      <p className="mt-1 text-sm text-red-600">{errors.allowances.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading || isAtLimit}
                  className={`btn btn-primary flex items-center justify-center ${
                    isAtLimit ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      {isAtLimit ? 'Limit Reached' : 'Calculate'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results Panel - Only show after calculation */}
          {calculation && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-secondary-600" />
                  <h2 className="text-2xl font-semibold text-primary-900">Salary Breakdown</h2>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="btn btn-outline text-sm flex items-center"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="btn btn-outline text-sm flex items-center"
                  >
                    <FileSpreadsheet className="h-5 w-5 mr-2" />
                    Export to Excel
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-5 w-5 text-primary-600" />
                      <span className="text-sm font-medium text-primary-700">Gross Salary</span>
                    </div>
                    <p className="text-2xl font-bold text-primary-900">
                      {formatCurrency(calculation.grossSalary)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700">PAYE Tax</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">
                      {formatCurrency(calculation.payeTax)}
                    </p>
                    <p className="text-xs text-red-600">
                      {calculateTaxPercentage(calculation.payeTax, calculation.grossSalary).toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 p-4 rounded-lg border border-secondary-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-secondary-600" />
                      <span className="text-sm font-medium text-secondary-700">Net Salary</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary-900">
                      {formatCurrency(calculation.netSalary)}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {calculateNetPercentage(calculation.netSalary, calculation.grossSalary).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="text-lg font-medium text-slate-900">Detailed Breakdown</h3>
                  </div>
                  
                  <div className="divide-y divide-slate-200">
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-slate-600">Gross Salary</span>
                      <span className="font-medium">{formatCurrency(calculation.grossSalary)}</span>
                    </div>
                    
                    {calculation.additions.total > 0 && (
                      <>
                        {calculation.additions.overtime > 0 && (
                          <div className="flex justify-between items-center px-4 py-3 text-green-600">
                            <span className="pl-4">+ Overtime Pay</span>
                            <span className="font-medium">{formatCurrency(calculation.additions.overtime)}</span>
                          </div>
                        )}
                        {calculation.additions.allowances > 0 && (
                          <div className="flex justify-between items-center px-4 py-3 text-green-600">
                            <span className="pl-4">+ Allowances</span>
                            <span className="font-medium">{formatCurrency(calculation.additions.allowances)}</span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-slate-600">Taxable Income</span>
                      <span className="font-medium">{formatCurrency(calculation.taxableIncome)}</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 text-red-600">
                      <span>- PAYE Tax</span>
                      <span className="font-medium">{formatCurrency(calculation.payeTax)}</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 text-red-600">
                      <span>- UIF Contribution</span>
                      <span className="font-medium">{formatCurrency(calculation.uifContribution)}</span>
                    </div>

                    {calculation.deductions.medicalAid > 0 && (
                      <div className="flex justify-between items-center px-4 py-3 text-red-600">
                        <span>- Medical Aid</span>
                        <span className="font-medium">{formatCurrency(calculation.deductions.medicalAid)}</span>
                      </div>
                    )}

                    {calculation.deductions.pensionFund > 0 && (
                      <div className="flex justify-between items-center px-4 py-3 text-red-600">
                        <span>- Pension Fund</span>
                        <span className="font-medium">{formatCurrency(calculation.deductions.pensionFund)}</span>
                      </div>
                    )}

                    {calculation.deductions.other > 0 && (
                      <div className="flex justify-between items-center px-4 py-3 text-red-600">
                        <span>- Other Deductions</span>
                        <span className="font-medium">{formatCurrency(calculation.deductions.other)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center px-4 py-3 bg-secondary-50 font-semibold text-lg">
                      <span className="text-secondary-900">Net Salary</span>
                      <span className="text-secondary-900">{formatCurrency(calculation.netSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for when no calculation is shown */}
          {!calculation && (
            <div className="card text-center py-12">
              <Calculator className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Calculate</h3>
              <p className="text-slate-600">
                Enter salary details and click "Calculate" to see your results here.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Limit Reached Modal */}
      <LimitReachedModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />
    </div>
  );
} 