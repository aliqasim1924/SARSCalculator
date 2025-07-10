import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-secondary-500" />
              <span className="text-xl font-bold">SARS Calculator</span>
            </Link>
            <p className="text-slate-300 mb-4 max-w-md">
              The most accurate and compliant SARS salary calculator for South African businesses. 
              Calculate PAYE, UIF, and deductions with confidence.
            </p>
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="h-4 w-4" />
              <span>South Africa</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/calculator" className="text-slate-300 hover:text-white">
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-white">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="h-4 w-4" />
                <span>support@sarscalculator.co.za</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="h-4 w-4" />
                <span>+27 (0)11 123 4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} SARS Calculator. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-slate-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 