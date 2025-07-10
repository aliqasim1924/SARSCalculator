import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, profileLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner only for initial authentication check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but profile is still loading, show a subtle loading indicator
  if (profileLoading) {
    return (
      <div className="min-h-screen">
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-primary-600 animate-pulse"></div>
        </div>
        {children}
      </div>
    );
  }

  // User is authenticated and profile is loaded (or loading failed gracefully)
  return <>{children}</>;
} 