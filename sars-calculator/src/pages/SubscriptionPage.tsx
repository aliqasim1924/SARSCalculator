import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, TrendingUp, Shield, Clock, Users, Calculator, Download, BarChart3, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../data/sars-tax-tables';

export default function SubscriptionPage() {
  const { profile } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  const currentPlan = profile?.subscription_tier || 'free';
  
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'business':
        return <TrendingUp className="h-8 w-8" />;
      case 'enterprise':
        return <Crown className="h-8 w-8" />;
      default:
        return <Calculator className="h-8 w-8" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'business':
        return 'border-secondary-200 hover:border-secondary-300';
      case 'enterprise':
        return 'border-purple-200 hover:border-purple-300 relative';
      default:
        return 'border-slate-200 hover:border-slate-300';
    }
  };

  const getPrice = (plan: any) => {
    if (plan.id === 'free') return 'Free';
    const price = billingCycle === 'annual' ? plan.price_annual : plan.price_monthly;
    const period = billingCycle === 'annual' ? '/year' : '/month';
    return `R${price}${period}`;
  };

  const getSavings = (plan: any) => {
    if (plan.id === 'free') return null;
    const monthlyTotal = plan.price_monthly * 12;
    const savings = monthlyTotal - plan.price_annual;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-secondary-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900">
              Unlock Your Full Potential
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the perfect plan to supercharge your salary calculations. 
            Trusted by thousands of South African businesses.
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-12">
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-600">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-secondary-600" />
              <span className="font-medium">1,000+ Happy Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-secondary-600" />
              <span className="font-medium">SARS Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-secondary-600" />
              <span className="font-medium">Save 5+ Hours/Week</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-secondary-600" />
              <span className="font-medium">99.9% Accuracy</span>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                billingCycle === 'annual'
                  ? 'bg-primary-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const savings = getSavings(plan);
            const isBusiness = plan.id === 'business';
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 flex flex-col h-full ${getPlanColor(plan.id)} ${
                  isCurrentPlan ? 'ring-2 ring-secondary-500 ring-offset-2' : ''
                } ${isBusiness ? 'transform scale-105' : ''}`}
              >
                {isBusiness && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-secondary-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      CURRENT PLAN
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    plan.id === 'enterprise' ? 'bg-purple-100 text-purple-600' :
                    plan.id === 'business' ? 'bg-secondary-100 text-secondary-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">{plan.name}</h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-900">{getPrice(plan)}</span>
                    {billingCycle === 'annual' && savings && (
                      <div className="mt-2">
                        <span className="text-sm text-secondary-600 font-medium">
                          Save R{savings.amount} ({savings.percentage}% off)
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-600">
                    {plan.calculation_limit === -1 
                      ? 'Unlimited calculations' 
                      : `${plan.calculation_limit} calculations/month`
                    }
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        plan.id === 'enterprise' ? 'bg-purple-100' :
                        plan.id === 'business' ? 'bg-secondary-100' :
                        'bg-slate-100'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.id === 'enterprise' ? 'text-purple-600' :
                          plan.id === 'business' ? 'text-secondary-600' :
                          'text-slate-600'
                        }`} />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrentPlan}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 mt-auto ${
                    isCurrentPlan
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : plan.id === 'enterprise'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105'
                      : plan.id === 'business'
                      ? 'bg-secondary-600 hover:bg-secondary-700 text-white'
                      : 'bg-primary-900 hover:bg-primary-800 text-white'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* ROI Section */}
        <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              See Your Return on Investment
            </h2>
            <p className="text-lg text-slate-600">
              Our customers save an average of <span className="font-bold text-secondary-600">15 hours per month</span> on salary calculations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Clock className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900">15 hrs</div>
                <div className="text-slate-600">Time Saved Monthly</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <TrendingUp className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900">99.9%</div>
                <div className="text-slate-600">Calculation Accuracy</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Zap className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900">R15,000</div>
                <div className="text-slate-600">Average Monthly Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-slate-600">Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">Is my data secure?</h3>
              <p className="text-slate-600">Absolutely. We use enterprise-grade encryption and are fully POPIA compliant. Your salary data is never shared with third parties.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">Do you offer refunds?</h3>
              <p className="text-slate-600">Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.</p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Need help choosing the right plan? <Link to="/contact" className="text-secondary-600 hover:underline">Contact our team</Link>
          </p>
          <p className="text-sm text-slate-500">
            All plans include 24/7 support and a 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
} 