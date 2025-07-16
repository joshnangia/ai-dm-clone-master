import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unlock = () => {
  const handleSubscribe = () => {
    // TODO: Integrate with Stripe or Fanbasis
    console.log('Redirecting to payment processor...');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="p-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaCloser.ai Logo" 
              className="h-12 w-12"
            />
            <Link to="/" className="text-xl font-bold text-black">
              InstaCloser.ai
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/try" className="text-gray-600 hover:text-black transition-colors">
              Try It
            </Link>
            <Link to="/unlock" className="text-black font-medium">
              Pricing
            </Link>
            <Link to="/faq" className="text-gray-600 hover:text-black transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-black mb-8">
            Unlock Your AI Closer
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            One-time setup. Unlimited DM replies. $9.99/mo.
          </p>

          {/* Benefits */}
          <div className="bg-gray-50 p-12 mb-12">
            <h2 className="text-2xl font-bold text-black mb-8">
              What You Get:
            </h2>
            <div className="space-y-6 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">
                  Unlimited access to InstaCloser AI
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">
                  Fast replies, mobile-optimized
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">
                  Built for creators, closers, and flirts
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-black text-white p-12 mb-12">
            <div className="text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold">$9.99</span>
                <span className="text-xl text-gray-300"> / month</span>
              </div>
              <p className="text-lg text-gray-300 mb-8">
                Cancel anytime. No contracts.
              </p>
              <Button
                onClick={handleSubscribe}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-12 py-4 text-lg font-medium rounded-none transform hover:scale-105 transition-all duration-300"
              >
                Subscribe Now
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Questions about pricing?
            </p>
            <Link to="/faq" className="text-black hover:underline font-medium">
              Check our FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unlock;