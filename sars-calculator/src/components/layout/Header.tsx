import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-primary-900" />
            <span className="text-xl font-bold text-primary-900">
              SARS Calculator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/calculator"
                  className="text-slate-700 hover:text-primary-900 font-medium"
                >
                  Calculator
                </Link>
                <Link
                  to="/dashboard"
                  className="text-slate-700 hover:text-primary-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/bulk-calculator"
                  className="text-slate-700 hover:text-primary-900 font-medium"
                >
                  Bulk Calculator
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-slate-700 hover:text-primary-900"
                  >
                    <User className="h-5 w-5" />
                    <span>{profile?.full_name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-slate-700 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-primary-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-700 hover:text-primary-900"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/calculator"
                    className="text-slate-700 hover:text-primary-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Calculator
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-slate-700 hover:text-primary-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/bulk-calculator"
                    className="text-slate-700 hover:text-primary-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Bulk Calculator
                  </Link>
                  <Link
                    to="/profile"
                    className="text-slate-700 hover:text-primary-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-primary-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 