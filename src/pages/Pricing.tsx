import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaReply.co Logo" 
              className="h-10 w-10"
            />
            <Link to="/" className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
              InstaReply.co
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/how-it-works" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              How It Works
            </Link>
            <Link to="/pricing" className="font-mono text-gray-900 dark:text-white font-bold">
              Pricing
            </Link>
            <Link to="/about" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono">
            Simple Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-mono">
            Start free. Upgrade when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-4">
                Free Trial
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold font-mono text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-300 font-mono"> / one try</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-600 dark:text-gray-300 font-mono">
                  <span className="mr-3">✓</span>
                  One free AI reply
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300 font-mono">
                  <span className="mr-3">✓</span>
                  Test the quality
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300 font-mono">
                  <span className="mr-3">✓</span>
                  No credit card required
                </li>
              </ul>
              <Link to="/">
                <Button className="w-full py-3 text-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-900 font-mono">
                  Try Free Now
                </Button>
              </Link>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-1 text-sm font-bold font-mono">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold font-mono text-white dark:text-gray-900 mb-4">
                Pro
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold font-mono text-white dark:text-gray-900">$9.99</span>
                <span className="text-gray-300 dark:text-gray-600 font-mono"> / month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-300 dark:text-gray-600 font-mono">
                  <span className="mr-3">✓</span>
                  Unlimited AI replies
                </li>
                <li className="flex items-center text-gray-300 dark:text-gray-600 font-mono">
                  <span className="mr-3">✓</span>
                  Advanced reply styles
                </li>
                <li className="flex items-center text-gray-300 dark:text-gray-600 font-mono">
                  <span className="mr-3">✓</span>
                  Priority support
                </li>
                <li className="flex items-center text-gray-300 dark:text-gray-600 font-mono">
                  <span className="mr-3">✓</span>
                  Cancel anytime
                </li>
              </ul>
              <Button className="w-full py-3 text-lg font-bold bg-white hover:bg-gray-100 text-gray-900 font-mono">
                Upgrade Now
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 font-mono mb-4">
            Questions about pricing?
          </p>
          <Link to="/about" className="text-gray-900 dark:text-white font-mono hover:underline">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;