import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Upload, Download, AlertTriangle, CheckCircle, Crown, Calculator, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateBulkTemplate, processBulkFile, calculateBulkSalaries, exportBulkResults, saveBulkCalculationsToDatabase, type BulkCalculationResult } from '../lib/bulk-calculator';
import { formatCurrency } from '../lib/salary-calculator';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function BulkCalculatorPage() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const [results, setResults] = useState<BulkCalculationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusinessOrEnterprise = profile?.subscription_tier === 'business' || profile?.subscription_tier === 'enterprise';
  
  const handleDownloadTemplate = () => {
    try {
      generateBulkTemplate();
      toast.success('Template downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!isBusinessOrEnterprise) {
      toast.error('Bulk calculations are available for Business and Enterprise plans only');
      return;
    }

    setIsProcessing(true);
    console.log('File upload started:', { name: file.name, type: file.type, size: file.size });
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          let content = e.target?.result as string;
          console.log('Raw file content (first 200 chars):', content.substring(0, 200));
          
          // Remove BOM if present
          if (content.charCodeAt(0) === 0xFEFF) {
            content = content.substring(1);
            console.log('Removed UTF-8 BOM');
          }
          
          // Clean up any weird characters from Excel export
          content = content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
          
          console.log('Cleaned content (first 200 chars):', content.substring(0, 200));
          
          const employees = processBulkFile(content);
          
          if (employees.length === 0) {
            toast.error('No valid employee data found in file');
            return;
          }

          const calculationResults = calculateBulkSalaries(employees);
          setResults(calculationResults);
          
          // Save to database
          if (user?.id) {
            try {
              await saveBulkCalculationsToDatabase(calculationResults, user.id);
              
              // Invalidate dashboard data to refresh it
              queryClient.invalidateQueries({ queryKey: ['dashboard-data', user.id] });
              
              toast.success(`Successfully processed and saved ${calculationResults.length} employees to database!`);
            } catch (dbError) {
              console.error('Database save error:', dbError);
              toast.success(`Processed ${calculationResults.length} employees (saved locally)`);
              toast.error('Could not save to database - but calculations are available below');
            }
          } else {
            toast.success(`Successfully processed ${calculationResults.length} employees`);
            toast.error('Not logged in - calculations not saved to database');
          }
        } catch (error) {
          console.error('Processing error:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to process file');
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        console.error('FileReader error');
        toast.error('Failed to read file');
        setIsProcessing(false);
      };
      
      // Explicitly specify UTF-8 encoding
      reader.readAsText(file, 'UTF-8');
    } catch (error) {
      console.error('File upload error:', error);
      setIsProcessing(false);
      toast.error('Failed to read file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleExportResults = () => {
    if (results.length === 0) {
      toast.error('No results to export');
      return;
    }
    
    try {
      exportBulkResults(results);
      toast.success('Results exported successfully!');
    } catch (error) {
      toast.error('Failed to export results');
    }
  };

  const totals = results.length > 0 ? {
    employees: results.length,
    grossSalary: results.reduce((sum, r) => sum + r.gross_salary, 0),
    netSalary: results.reduce((sum, r) => sum + r.calculation_result.netSalary, 0),
    totalTax: results.reduce((sum, r) => sum + r.calculation_result.payeTax, 0),
    totalDeductions: results.reduce((sum, r) => sum + r.calculation_result.deductions.total, 0)
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            Bulk Salary Calculator
          </h1>
          <p className="text-slate-600">
            Process multiple employee salaries at once using our Excel template
          </p>
        </div>

        {/* Subscription Gate */}
        {!isBusinessOrEnterprise && (
          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Crown className="h-8 w-8 text-secondary-600 mr-3" />
              <h2 className="text-xl font-bold text-primary-900">Upgrade Required</h2>
            </div>
            <p className="text-slate-700 mb-4">
              Bulk calculations are available for Business and Enterprise plans. 
              Process hundreds of employees in seconds!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/subscription"
                className="btn btn-secondary flex items-center justify-center"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade Now
              </Link>
              <button
                onClick={handleDownloadTemplate}
                className="btn btn-outline flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Preview Template
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Template Download */}
            <div className="card">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">
                Step 1: Download Template
              </h2>
              <p className="text-slate-600 mb-4">
                Download our CSV template, fill in your employee data, and upload it back.
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="btn btn-secondary w-full flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download CSV Template
              </button>
            </div>

            {/* File Upload */}
            <div className="card">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">
                Step 2: Upload Completed File
              </h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-secondary-400 bg-secondary-50'
                    : isBusinessOrEnterprise
                    ? 'border-slate-300 hover:border-secondary-400'
                    : 'border-slate-200 bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isProcessing ? (
                  <div className="animate-pulse">
                    <Calculator className="h-12 w-12 text-secondary-600 mx-auto mb-3" />
                    <p className="text-primary-900 font-medium">Processing file...</p>
                    <p className="text-slate-600 text-sm">This may take a moment</p>
                  </div>
                ) : (
                  <>
                    <Upload className={`h-12 w-12 mx-auto mb-3 ${
                      isBusinessOrEnterprise ? 'text-secondary-600' : 'text-slate-400'
                    }`} />
                    <p className={`text-lg font-medium mb-2 ${
                      isBusinessOrEnterprise ? 'text-primary-900' : 'text-slate-500'
                    }`}>
                      {isBusinessOrEnterprise ? 'Drop your CSV file here' : 'Upload not available'}
                    </p>
                    <p className={`text-sm mb-4 ${
                      isBusinessOrEnterprise ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {isBusinessOrEnterprise ? 'or click to browse' : 'Upgrade to Business or Enterprise plan'}
                    </p>
                    {isBusinessOrEnterprise && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline"
                        disabled={isProcessing}
                      >
                        Choose File
                      </button>
                    )}
                  </>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileInputChange}
                disabled={!isBusinessOrEnterprise}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">
              Instructions
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-secondary-100 rounded-full p-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-900">Download Template</h3>
                  <p className="text-sm text-slate-600">Get the CSV template with sample data and instructions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-secondary-100 rounded-full p-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-900">Fill Employee Data</h3>
                  <p className="text-sm text-slate-600">Add employee names, gross salaries, age categories, and deductions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-secondary-100 rounded-full p-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-900">Upload & Process</h3>
                  <p className="text-sm text-slate-600">Upload the completed file and get instant calculations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-secondary-100 rounded-full p-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-900">Export Results</h3>
                  <p className="text-sm text-slate-600">Download professional payslip reports for all employees</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Important Notes</h4>
                  <ul className="text-sm text-amber-800 mt-1 space-y-1">
                    <li>• Age Category must be exactly: under_65, 65_to_75, or over_75</li>
                    <li>• Use numbers only for salary amounts (no commas or currency symbols)</li>
                    <li>• Do not modify the header row</li>
                    <li>• Save as CSV (.csv) format only</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-900">
                Calculation Results
              </h2>
              <button
                onClick={handleExportResults}
                className="btn btn-secondary flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Results
              </button>
            </div>

            {/* Summary Cards */}
            {totals && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="card text-center">
                  <Users className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary-900">{totals.employees}</p>
                  <p className="text-sm text-slate-600">Employees</p>
                </div>
                <div className="card text-center">
                  <p className="text-lg font-bold text-primary-900">{formatCurrency(totals.grossSalary)}</p>
                  <p className="text-sm text-slate-600">Total Gross</p>
                </div>
                <div className="card text-center">
                  <p className="text-lg font-bold text-red-600">{formatCurrency(totals.totalTax)}</p>
                  <p className="text-sm text-slate-600">Total Tax</p>
                </div>
                <div className="card text-center">
                  <p className="text-lg font-bold text-orange-600">{formatCurrency(totals.totalDeductions)}</p>
                  <p className="text-sm text-slate-600">Total Deductions</p>
                </div>
                <div className="card text-center">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(totals.netSalary)}</p>
                  <p className="text-sm text-slate-600">Total Net</p>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Age Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Gross Salary
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        PAYE Tax
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        UIF
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Net Salary
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {results.map((result, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary-900">
                            {result.employee_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                            {result.age_category.replace('_', '-')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-primary-900">
                          {formatCurrency(result.gross_salary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                          {formatCurrency(result.calculation_result.payeTax)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-orange-600">
                          {formatCurrency(result.calculation_result.uifContribution)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                          {formatCurrency(result.calculation_result.netSalary)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 