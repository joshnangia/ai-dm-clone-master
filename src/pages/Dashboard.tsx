import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Bot, CreditCard, MessageSquare, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const { user, subscribed, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-2xl font-bold">InstaCloser.ai</Link>
          </div>
          <div className="flex items-center gap-4">
            {subscribed && (
              <span className="text-sm bg-green-600 px-3 py-1 rounded-full font-medium">
                Premium Active
              </span>
            )}
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            Welcome, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {subscribed 
              ? 'Your premium account is active. Generate unlimited AI replies!'
              : 'Upgrade to premium for unlimited AI-powered DM replies.'
            }
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/try">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-bold rounded-lg">
                {subscribed ? 'Generate AI Replies' : 'Try AI (Limited)'}
              </Button>
            </Link>
            {!subscribed && (
              <Button 
                onClick={() => window.location.href = 'https://buy.stripe.com/test_aFa5kEcVagA855I3YFb7y01'}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Account Type</CardTitle>
              <User className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {subscribed ? 'Premium' : 'Free'}
              </div>
              <p className="text-xs text-gray-400">
                {subscribed ? 'Unlimited access' : 'Limited access'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">AI Replies</CardTitle>
              <Bot className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {subscribed ? '∞' : '1'}
              </div>
              <p className="text-xs text-gray-400">
                {subscribed ? 'Unlimited' : 'Per session'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Status</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Active</div>
              <p className="text-xs text-gray-400">Ready to use</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Reply Generator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Generate perfect replies to any DM using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/try">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Start Generating Replies
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
              <CardDescription className="text-gray-400">
                {subscribed ? 'Manage your premium subscription' : 'Upgrade for unlimited access'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscribed ? (
                <Link to="/success">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Manage Subscription
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => window.location.href = 'https://buy.stripe.com/test_aFa5kEcVagA855I3YFb7y01'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Upgrade to Premium - $9.99/mo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Need help? Contact us at support@instacloser.ai
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;