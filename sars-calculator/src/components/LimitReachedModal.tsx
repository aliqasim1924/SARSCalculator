import React from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, TrendingUp, Crown, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
  const { profile } = useAuth();

  if (!isOpen) return null;

  const nextPlan = profile?.subscription_tier === 'free' ? 'business' : 'enterprise';
  const nextPlanName = nextPlan === 'business' ? 'Business' : 'Enterprise';
  const nextPlanPrice = nextPlan === 'business' ? 'R89' : 'R199';
  const nextPlanLimit = nextPlan === 'business' ? '100' : 'Unlimited';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-3 inline-flex mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              You've Hit Your Limit!
            </h2>
            <p className="text-white text-opacity-90">
              You've used all {profile?.monthly_limit} calculations this month
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Status */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-700 font-medium">Current Plan: {profile?.subscription_tier || 'Free'}</span>
              <span className="text-red-600 font-bold">{profile?.calculations_used}/{profile?.monthly_limit}</span>
            </div>
            <div className="mt-2 bg-red-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full w-full"></div>
            </div>
          </div>

          {/* Upgrade Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-secondary-600 mr-2" />
              Unlock More with {nextPlanName}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-secondary-100 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-slate-700">
                  <span className="font-bold text-secondary-600">{nextPlanLimit}</span> calculations per month
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-secondary-100 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-slate-700">Export to PDF & Excel</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-secondary-100 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-slate-700">Priority support</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-secondary-100 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-slate-700">Historical data & analytics</span>
              </div>
            </div>
          </div>

          {/* Urgency & Social Proof */}
          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="h-5 w-5 text-secondary-600" />
              <span className="font-bold text-primary-900">Limited Time Offer</span>
            </div>
            <p className="text-slate-700 text-sm">
              Join over <span className="font-bold text-secondary-600">1,000+ businesses</span> saving 15+ hours monthly with our advanced features.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              to="/subscription"
              className="w-full bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to {nextPlanName} - {nextPlanPrice}/month
            </Link>
            
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Signal */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              💳 Secure payment • 🔄 Cancel anytime • 💰 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 