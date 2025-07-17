import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Star, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [accountCreated, setAccountCreated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      processPayment(sessionId);
    } else {
      setProcessing(false);
    }
  }, [searchParams]);

  const processPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      setUserEmail(data.email);
      setAccountCreated(true);
      
      toast({
        title: "Payment successful!",
        description: data.message || "Your account has been upgraded to premium!",
      });

    } catch (error: any) {
      console.error('Payment processing error:', error);
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
            <h2 className="text-xl font-bold mb-2">Processing your payment...</h2>
            <p className="text-gray-400">Creating your account and setting up access</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Welcome to InstaReply AI Premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-purple-400 mb-2">✨ Payment Successful!</h3>
            <p className="text-sm text-gray-300">
              Your account has been upgraded to premium! Sign in with your existing email and password to access all premium features.
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-green-400 mb-2">🎉 You now have access to:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Unlimited AI-powered DM replies</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Advanced psychology & sales techniques</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Real-time conversation analysis</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link to="/signin" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3">
                Sign In Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;