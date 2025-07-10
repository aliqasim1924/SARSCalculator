import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Shield, Clock, TrendingUp, CheckCircle, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-900 mb-6">
            SARS Salary Calculator
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Calculate accurate PAYE tax, UIF contributions, and net salaries 
            with South Africa's most trusted salary calculator
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Get Started Free
            </Link>
            <Link
              to="/calculator"
              className="btn btn-outline text-lg px-8 py-3"
            >
              Try Calculator
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 mb-16">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary-600" />
              <span>SARS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary-600" />
              <span>2025 Tax Tables</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary-600" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Why Choose Our Calculator?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built specifically for South African businesses with accuracy and compliance in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <Calculator className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Accurate Calculations
              </h3>
              <p className="text-slate-600">
                SARS-compliant calculations with the latest tax brackets, rebates, and UIF rates
              </p>
            </div>

            <div className="card text-center">
              <Clock className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Save Time
              </h3>
              <p className="text-slate-600">
                Instant calculations mean no more manual computations or spreadsheet errors
              </p>
            </div>

            <div className="card text-center">
              <TrendingUp className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Business Growth
              </h3>
              <p className="text-slate-600">
                Make informed salary decisions and optimize your payroll costs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Start free, upgrade when you need more
            </p>
          </div>

          {/* Social Proof */}
          <div className="bg-slate-50 rounded-xl p-6 shadow-sm border border-slate-200 mb-12">
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-600">
              <div className="flex items-center space-x-2">
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
                <CheckCircle className="h-5 w-5 text-secondary-600" />
                <span className="font-medium">99.9% Accuracy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full mb-4 bg-slate-100 text-slate-600">
                  <Calculator className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Free</h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-900">R0</span>
                  <span className="text-lg text-slate-600">/month</span>
                </div>

                <p className="text-slate-600">10 calculations/month</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-slate-100">
                    <CheckCircle className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-slate-700">10 calculations per month</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-slate-100">
                    <CheckCircle className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-slate-700">Basic salary breakdown</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-slate-100">
                    <CheckCircle className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-slate-700">Tax calculation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-slate-100">
                    <CheckCircle className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-slate-700">Email support</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 bg-primary-900 hover:bg-primary-800 text-white block text-center mt-auto"
              >
                Get Started
              </Link>
            </div>

            {/* Business Plan */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-secondary-200 hover:border-secondary-300 transition-all duration-300 transform scale-105 flex flex-col h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-secondary-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ MOST POPULAR
                </span>
              </div>
              
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full mb-4 bg-secondary-100 text-secondary-600">
                  <TrendingUp className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Business</h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-900">R89</span>
                  <span className="text-lg text-slate-600">/month</span>
                </div>

                <p className="text-slate-600">100 calculations/month</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-secondary-100">
                    <CheckCircle className="w-3 h-3 text-secondary-600" />
                  </div>
                  <span className="text-slate-700">100 calculations per month</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-secondary-100">
                    <CheckCircle className="w-3 h-3 text-secondary-600" />
                  </div>
                  <span className="text-slate-700">Detailed salary breakdown</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-secondary-100">
                    <CheckCircle className="w-3 h-3 text-secondary-600" />
                  </div>
                  <span className="text-slate-700">Export to PDF/Excel</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-secondary-100">
                    <CheckCircle className="w-3 h-3 text-secondary-600" />
                  </div>
                  <span className="text-slate-700">Bulk calculations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-secondary-100">
                    <CheckCircle className="w-3 h-3 text-secondary-600" />
                  </div>
                  <span className="text-slate-700">Priority support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-secondary-100">
                    <CheckCircle className="w-3 h-3 text-secondary-600" />
                  </div>
                  <span className="text-slate-700">Historical data</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 bg-secondary-600 hover:bg-secondary-700 text-white block text-center transform hover:scale-105 mt-auto"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 flex flex-col h-full">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full mb-4 bg-purple-100 text-purple-600">
                  <Zap className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Enterprise</h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-900">R199</span>
                  <span className="text-lg text-slate-600">/month</span>
                </div>

                <p className="text-slate-600">Unlimited calculations</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-purple-100">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">Unlimited calculations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-purple-100">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">Advanced analytics</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-purple-100">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">API access</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-purple-100">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">Team management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-purple-100">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">White-label options</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-purple-100">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">Dedicated support</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white block text-center mt-auto"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-16 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">
                Why Thousands Choose Our Calculator
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
                  <div className="text-xl font-bold text-primary-900">15 hrs</div>
                  <div className="text-slate-600">Time Saved Monthly</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
                  <div className="text-xl font-bold text-primary-900">99.9%</div>
                  <div className="text-slate-600">Calculation Accuracy</div>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
                  <div className="text-xl font-bold text-primary-900">R15,000</div>
                  <div className="text-slate-600">Average Monthly Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-slate-300">
            Join thousands of South African businesses using our calculator
          </p>
          <Link
            to="/register"
            className="btn bg-secondary-600 hover:bg-secondary-700 text-white text-lg px-8 py-3"
          >
            Start Calculating Today
          </Link>
        </div>
      </section>
    </div>
  );
} 