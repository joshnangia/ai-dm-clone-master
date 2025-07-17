import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const { user, subscribed, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Mobile-first hero - no navigation clutter */}
      <div className="px-4 py-8">
        {/* Logo with auth */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">InstaReply.co</div>
          <div className="flex gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                {subscribed && (
                  <span className="text-sm bg-green-600 px-3 py-1 rounded-full font-medium">
                    Premium
                  </span>
                )}
                <Link to="/dashboard">
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button
                  variant="secondary"
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
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

        {/* Testimonials - better handles */}
        <div className="text-center mb-12">
          <div className="bg-white/5 rounded-2xl p-6 mb-4">
            <p className="text-lg mb-2">"This AI just closed a $15k deal for me"</p>
            <p className="text-sm text-gray-400">- @alexbecker, 1.8M followers</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6">
            <p className="text-lg mb-2">"Made $30k this month using AI replies"</p>
            <p className="text-sm text-gray-400">- @biaheza, 890k followers</p>
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
            Used by 50,000+ creators • 4.9★ rating • Secure payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;