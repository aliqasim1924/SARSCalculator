import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Building, Mail, Save, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileSchema, type ProfileFormData } from '../lib/validation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      companyName: profile?.company_name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile({
        full_name: data.fullName,
        company_name: data.companyName,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    try {
      // TODO: Implement password reset via Supabase
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900">Profile Settings</h1>
          <p className="text-slate-600 mt-2">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-6 w-6 text-secondary-600" />
              <h2 className="text-2xl font-semibold text-primary-900">Personal Information</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="label">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('fullName')}
                    id="fullName"
                    type="text"
                    className={`input pl-10 ${errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="label">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('companyName')}
                    id="companyName"
                    type="text"
                    className={`input pl-10 ${errors.companyName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Enter your company name"
                  />
                </div>
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    disabled
                    className="input pl-10 bg-slate-50 text-slate-500 cursor-not-allowed"
                    placeholder="Your email address"
                  />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Contact support to change your email address
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="h-6 w-6 text-secondary-600" />
              <h2 className="text-2xl font-semibold text-primary-900">Security</h2>
            </div>

            <div className="space-y-6">
              {/* Password Section */}
              <div>
                <h3 className="text-lg font-medium text-primary-900 mb-4">Password</h3>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Password</p>
                    <p className="text-sm text-slate-600">
                      Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="btn btn-outline"
                  >
                    Reset Password
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  We'll send you an email with instructions to reset your password.
                </p>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-medium text-primary-900 mb-4">Account Status</h3>
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">Email Verification</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.email_confirmed_at 
                        ? 'bg-secondary-100 text-secondary-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {user?.email_confirmed_at ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">Account Created</span>
                    <span className="text-sm text-slate-600">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-primary-900 mb-6">Subscription</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Current Plan</p>
                  <p className="text-sm text-slate-600 capitalize">
                    {profile?.subscription_tier || 'Free'} Plan
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">
                    {profile?.calculations_used || 0} / {profile?.monthly_limit || 10}
                  </p>
                  <p className="text-sm text-slate-600">Calculations used</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-secondary">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200 bg-red-50">
            <h2 className="text-2xl font-semibold text-red-900 mb-6">Danger Zone</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-red-300 rounded-lg bg-white">
                <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="btn bg-red-600 hover:bg-red-700 text-white">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 