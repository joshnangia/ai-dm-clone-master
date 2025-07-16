import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Mobile-first hero - no navigation clutter */}
      <div className="px-4 py-8">
        {/* Logo minimal */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold">InstaCloser.ai</div>
        </div>

        {/* Hero - MOBILE OPTIMIZED */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
            Never Get Left 
            <br />
            On Read Again
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 px-2">
            AI replies to your DMs in seconds.
            <br />
            <span className="text-white font-bold">First reply FREE.</span>
          </p>
          
          {/* MAIN CTA - HUGE AND OBVIOUS */}
          <Link to="/try">
            <Button 
              size="lg" 
              className="w-full max-w-sm bg-white text-black hover:bg-gray-200 py-6 text-2xl font-black rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Try It FREE Now
            </Button>
          </Link>
          
          <p className="text-sm text-gray-400 mt-4">
            No signup required • Works instantly
          </p>
        </div>

        {/* Social proof - quick hits */}
        <div className="text-center mb-12">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div>
              <div className="text-3xl font-black text-white">10x</div>
              <div className="text-xs text-gray-400">Faster</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">94%</div>
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">2.3M</div>
              <div className="text-xs text-gray-400">DMs Sent</div>
            </div>
          </div>
        </div>

        {/* How it works - SUPER simple */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">1</div>
              <div>Paste any DM you received</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">2</div>
              <div>AI writes the perfect reply</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">3</div>
              <div>Copy, send, close the deal</div>
            </div>
          </div>
        </div>

        {/* Testimonials - quick */}
        <div className="text-center mb-12">
          <div className="bg-white/5 rounded-2xl p-6 mb-4">
            <p className="text-lg mb-2">"Holy shit this actually works"</p>
            <p className="text-sm text-gray-400">- @mikeCEO, 2.1M followers</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6">
            <p className="text-lg mb-2">"Closed 3 deals in one day using this"</p>
            <p className="text-sm text-gray-400">- @sarahstartup, Entrepreneur</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Never Miss Another Deal?</h3>
          <Link to="/try">
            <Button 
              size="lg" 
              className="w-full bg-white text-black hover:bg-gray-200 py-4 text-xl font-black rounded-2xl"
            >
              Start FREE Trial
            </Button>
          </Link>
          <p className="text-sm mt-3 opacity-80">Then $9.99/month • Cancel anytime</p>
        </div>

        {/* Trust signals */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Used by 50,000+ creators • 4.9★ rating • Money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;