import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Bot, Crown, MessageSquare, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const { user, subscribed, signOut } = useAuth();

  const handleUpgrade = () => {
    window.open('https://buy.stripe.com/test_6oU9AU6QO0sY9Qn6HKdAk07', '_blank');
  };

  if (!subscribed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Sign Out
            </Button>
          </div>

          {/* Upgrade Required */}
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black mb-2">
                Upgrade to Premium
              </h1>
              <p className="text-gray-300 text-sm">
                Get unlimited AI replies and never get left on read again
              </p>
            </div>

            {/* Features */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left">
              <h3 className="font-bold mb-4 text-center">What you get:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Unlimited AI replies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Perfect responses every time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Works on any platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl font-black rounded-2xl mb-4"
            >
              Get Premium - $9.99/mo
            </Button>

            <p className="text-xs text-gray-400">
              Secure payment with Stripe • Cancel anytime
            </p>

            {/* Try Free Link */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">Want to try first?</p>
              <Link to="/try">
                <Button variant="outline" className="w-full">
                  Try 1 Free Reply
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-600 px-3 py-1 rounded-full font-medium">
              Premium Active
            </span>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-300">
            You have unlimited AI replies
          </p>
        </div>

        {/* Main Action */}
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 mb-6">
            <CardContent className="p-6 text-center">
              <Bot className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-xl font-bold mb-2">AI Reply Generator</h2>
              <p className="text-gray-300 text-sm mb-4">
                Generate perfect replies to any DM
              </p>
              <Link to="/try">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 font-bold">
                  Start Generating Replies
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">∞</div>
                <p className="text-xs text-gray-400">Replies Available</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">Premium</div>
                <p className="text-xs text-gray-400">Account Type</p>
              </CardContent>
            </Card>
          </div>

          {/* Help */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Need help? Email support@instacloser.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;