import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Calendar, Users, ArrowRight, CreditCard, CheckCircle, AlertTriangle, FileSpreadsheet, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/salary-calculator';
import { useDashboardData } from '../hooks/useDashboardData';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboardData();

  const subscriptionInfo = {
    tier: profile?.subscription_tier || 'free',
    calculationsUsed: profile?.calculations_used || 0,
    monthlyLimit: profile?.monthly_limit || 10,
    status: profile?.subscription_status || 'active',
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'business':
        return 'text-secondary-600 bg-secondary-50 border-secondary-200';
      case 'enterprise':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getUsageColor = () => {
    const percentage = (subscriptionInfo.calculationsUsed / subscriptionInfo.monthlyLimit) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage >= 70) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-secondary-600 bg-secondary-50 border-secondary-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Calculator className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600">Error loading dashboard data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData || {
    calculationsThisMonth: 0,
    totalCalculations: 0,
    avgSalaryCalculated: 0,
    lastCalculationDate: null,
    recentCalculations: []
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-slate-600 mt-2">
            Here's your salary calculation overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calculator className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">This Month</p>
                <p className="text-2xl font-bold text-primary-900">
                  {stats.calculationsThisMonth}
                </p>
                <p className="text-xs text-slate-500">calculations</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-2xl font-bold text-primary-900">
                  {stats.totalCalculations}
                </p>
                <p className="text-xs text-slate-500">all time</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg. Salary</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatCurrency(stats.avgSalaryCalculated)}
                </p>
                <p className="text-xs text-slate-500">this month</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Last Calc</p>
                <p className="text-2xl font-bold text-primary-900">
                  {stats.lastCalculationDate ? new Date(stats.lastCalculationDate).toLocaleDateString('en-ZA', { 
                    day: 'numeric',
                    month: 'short'
                  }) : 'None'}
                </p>
                <p className="text-xs text-slate-500">recent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/calculator"
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
              >
                <Calculator className="h-8 w-8 text-secondary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-900">New Calculation</h3>
                  <p className="text-sm text-slate-600">Calculate a new salary</p>
                </div>
              </Link>

              <Link
                to="/bulk-calculator"
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
              >
                <FileSpreadsheet className="h-8 w-8 text-secondary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-900">Bulk Calculations</h3>
                  <p className="text-sm text-slate-600">Upload and process multiple employees</p>
                </div>
              </Link>

              <Link
                to="/profile"
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
              >
                <Users className="h-8 w-8 text-secondary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-900">Manage Profile</h3>
                  <p className="text-sm text-slate-600">Update your information</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Recent Activity</h2>
            {stats.recentCalculations.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCalculations.map((calc) => (
                  <div key={calc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-primary-900">{calc.employee_name}</p>
                        {calc.is_bulk_calculation && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            Bulk
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {new Date(calc.created_at).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-900">{formatCurrency(calc.net_salary)}</p>
                      <p className="text-sm text-slate-600">Net Salary</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/calculator"
                  className="block text-center text-secondary-600 hover:text-secondary-700 text-sm font-medium mt-4"
                >
                  View all calculations →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No recent calculations</p>
                <Link
                  to="/calculator"
                  className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                >
                  Create your first calculation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 