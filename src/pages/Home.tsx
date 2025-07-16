import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle moving background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-2 h-2 bg-black rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-black rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-black rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-black rounded-full animate-pulse delay-3000"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-black rounded-full animate-pulse delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 border-b border-gray-100">
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
            <Link to="/unlock" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link to="/faq" className="text-gray-600 hover:text-black transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-black mb-8 leading-tight">
            Your AI DM Closer.
            <br />
            One reply. One shot.
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed">
            Paste a DM. Watch AI reply like a closer. First try is free.
          </p>
          <Link to="/try">
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium rounded-none transform hover:scale-105 transition-all duration-300"
            >
              Try It Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-8">
              Built for DMs.
              <br />
              Not for chatbots.
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                This isn't ChatGPT with a new face.
              </p>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                This AI is trained to write confident, persuasive replies that work in real-world Instagram DMs — for closing sales, flirting, and making moves.
              </p>
              <p className="text-lg lg:text-xl text-black font-medium">
                One try is all you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-8">
            One try is free.
            <br />
            Unlimited = $9.99/mo.
          </h2>
          <Link to="/try">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-black text-black hover:bg-black hover:text-white px-12 py-4 text-lg font-medium rounded-none transform hover:scale-105 transition-all duration-300"
            >
              Try It Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Floating elements for subtle movement */}
      <div className="absolute top-1/4 left-8 w-32 h-0.5 bg-black opacity-10 transform rotate-45 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 right-8 w-24 h-0.5 bg-black opacity-10 transform -rotate-45 animate-pulse delay-2000"></div>
    </div>
  );
};

export default Home;