import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Zap, 
  Brain, 
  Clock, 
  BarChart3, 
  Shield, 
  Rocket, 
  Instagram,
  MessageCircle,
  TrendingUp,
  Target,
  Star
} from 'lucide-react';

const Home = () => {
  const { user, subscribed, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header with auth */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-black">InstaReply.co</div>
          <div className="flex gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                {subscribed && (
                  <span className="text-sm bg-premium px-3 py-1 rounded-full font-medium">
                    Premium
                  </span>
                )}
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm">Dashboard</Button>
                </Link>
                <Button onClick={signOut} variant="ghost" size="sm">Sign Out</Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
            Your AI Closer.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              On. Demand.
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Sell your product, book calls, and convert leads — instantly.
          </p>
          
          {/* Glowing CTA */}
          <div className="mb-6">
            <Link to="/try">
              <Button className="relative px-12 py-6 text-2xl font-black rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] transform hover:scale-105 transition-all duration-300 animate-pulse">
                <Rocket className="mr-3 w-6 h-6" />
                Try It FREE Now
              </Button>
            </Link>
          </div>
          
          <p className="text-gray-400 text-lg">
            No login needed. First reply is free.
          </p>
        </div>
      </div>

      {/* Social Proof Wall */}
      <div className="px-4 py-16 bg-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg">AB</span>
                </div>
                <div>
                  <div className="font-bold">Alex Becker</div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Instagram className="w-4 h-4 mr-1" />
                    2.1M followers
                  </div>
                </div>
              </div>
              <p className="text-lg">"This AI just closed a $47k deal while I was sleeping"</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg">B</span>
                </div>
                <div>
                  <div className="font-bold">Biaheza</div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Instagram className="w-4 h-4 mr-1" />
                    1.2M followers
                  </div>
                </div>
              </div>
              <p className="text-lg">"Made $89k this month using AI replies"</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg">B</span>
                </div>
                <div>
                  <div className="font-bold">Ben</div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Instagram className="w-4 h-4 mr-1" />
                    890k followers
                  </div>
                </div>
              </div>
              <p className="text-lg">"Converts 3x better than my manual replies"</p>
            </div>
          </div>
          
          {/* Brand Logos */}
          <div className="text-center">
            <p className="text-gray-400 mb-6">As seen on:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-2xl font-bold text-gray-500">
              <span>Instagram</span>
              <span>•</span>
              <span>TikTok</span>
              <span>•</span>
              <span>Gumroad</span>
              <span>•</span>
              <span>Twitter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Benefit Grid */}
      <div className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
            Built to <span className="text-purple-400">Convert</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4 p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">24/7 Auto-Replies</h3>
                <p className="text-gray-400">Never miss a lead, even while you sleep</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Objection Handling</h3>
                <p className="text-gray-400">Trained to overcome every sales objection</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">5x Faster DM Response</h3>
                <p className="text-gray-400">Instant replies that feel human</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Psychology-Trained</h3>
                <p className="text-gray-400">Uses proven sales psychology triggers</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 md:col-span-2 md:w-1/2 md:mx-auto">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-400">Track your conversion rates and optimize</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Wall */}
      <div className="px-4 py-20 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-8">
                Unlock The AI That <span className="text-purple-400">Pays You Back</span>
              </h2>
              
              <div className="text-left max-w-md mx-auto mb-10 space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-lg">Unlimited replies</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-lg">Trained for your exact offer</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-lg">Advanced sales logic + objection handling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-lg">Call booking integration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-lg">30-day refund policy</span>
                </div>
              </div>
              
              <Link to="/auth">
                <Button className="px-10 py-6 text-2xl font-black rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transform hover:scale-105 transition-all duration-300 mb-4">
                  <Rocket className="mr-3 w-6 h-6" />
                  Start Trial – $9.99/mo
                </Button>
              </Link>
              
              <p className="text-gray-400">Cancel anytime. No risk.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            Stop Losing Leads<br />In Your DMs
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Let your AI Closer sell for you 24/7.
          </p>
          
          <Link to="/try">
            <Button className="px-12 py-6 text-2xl font-black rounded-full bg-white text-black hover:bg-gray-200 shadow-2xl transform hover:scale-105 transition-all duration-300">
              Try Free – First Reply On Us
            </Button>
          </Link>
        </div>
      </div>

      {/* Sticky CTA Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-purple-500/30 p-4 z-50">
        <Link to="/try">
          <Button className="w-full py-4 text-lg font-black rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
            Try FREE Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;