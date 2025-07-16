import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const HowItWorks = () => {
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
            <Link to="/how-it-works" className="font-mono text-gray-900 dark:text-white font-bold">
              How It Works
            </Link>
            <Link to="/pricing" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
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
            How It Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-mono">
            Three simple steps to AI-powered DM replies
          </p>
        </div>

        <div className="space-y-12">
          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-6">
              <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold font-mono text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-3">
                  Paste Your DM
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-mono">
                  Copy the message you received and paste it into our tool. 
                  Works with any type of DM - sales inquiries, lead questions, or casual conversations.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-6">
              <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold font-mono text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-3">
                  AI Generates Reply
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-mono">
                  Our AI analyzes the message and creates a professional, engaging response 
                  designed to move the conversation forward and increase conversions.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-6">
              <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold font-mono text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-3">
                  Copy and Send
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-mono">
                  Copy the generated reply and send it back. 
                  Watch your response rates and conversions improve instantly.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Link 
            to="/" 
            className="inline-block bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white px-8 py-4 text-lg font-bold font-mono transition-colors"
          >
            Try It Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;