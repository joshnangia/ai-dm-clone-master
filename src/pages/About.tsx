import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaCloser.ai Logo" 
              className="h-10 w-10"
            />
            <Link to="/" className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
              InstaCloser.ai
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/how-it-works" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              How It Works
            </Link>
            <Link to="/pricing" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Pricing
            </Link>
            <Link to="/about" className="font-mono text-gray-900 dark:text-white font-bold">
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono">
            About InstaCloser.ai
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-mono">
            The future of DM communication
          </p>
        </div>

        <div className="space-y-12">
          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-mono leading-relaxed">
              We believe that every entrepreneur deserves the tools to communicate effectively. 
              InstaCloser.ai was built to help you respond to DMs like a professional closer, 
              even when you're busy building your business.
            </p>
          </Card>

          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-4">
              Why We Built This
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-mono leading-relaxed">
              After seeing countless entrepreneurs lose deals because they couldn't respond 
              to DMs fast enough, we knew there had to be a better way. Our AI is trained 
              specifically on high-converting sales conversations to help you close more deals.
            </p>
          </Card>

          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-4">
              The Technology
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-mono leading-relaxed">
              Built on advanced AI models, InstaCloser.ai understands context, tone, and intent. 
              It generates replies that sound natural, professional, and conversion-focused. 
              Every response is designed to move your conversations forward.
            </p>
          </Card>

          <div className="text-center bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-mono mb-6">
              Join thousands of entrepreneurs who are already closing more deals with AI.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white px-8 py-4 text-lg font-bold font-mono transition-colors"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;