import React from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "Can I use this on Instagram?",
      answer: "Yes — it's built for Instagram DMs. Just paste the convo."
    },
    {
      question: "Do I need to install anything?",
      answer: "No. It's browser-based and mobile-friendly."
    },
    {
      question: "Can I train it on my tone?",
      answer: "Soon. For now, it's pre-trained to sound like a confident, persuasive closer."
    },
    {
      question: "How does the free trial work?",
      answer: "You get one free AI reply to test the quality. After that, upgrade to unlimited for $9.99/month."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel your subscription anytime with no penalties or contracts."
    },
    {
      question: "What makes this different from ChatGPT?",
      answer: "This AI is specifically trained on successful DM conversations for sales, dating, and business. It's not a general chatbot."
    }
  ];

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
            <Link to="/unlock" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link to="/faq" className="text-black font-medium">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-8">
              Frequently Asked Questions
            </h1>
          </div>

          <div className="space-y-12">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-black mb-4">
                  {faq.question}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Ready to get started?
            </p>
            <Link to="/try">
              <button className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium rounded-none transform hover:scale-105 transition-all duration-300">
                Try It Free
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;