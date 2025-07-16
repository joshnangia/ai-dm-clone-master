
import React from 'react';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23A855F7" fill-opacity="0.1"%3E%3Cpath d="M0 0h40v40H0V0zm40 40h40v40H40V40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Urgency Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-full border border-red-500/30 mb-8 backdrop-blur-sm">
            <Clock className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-300 font-semibold">🔒 Only 3 spots left tonight!</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Clone Your
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Closing Power?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Stop missing opportunities. Let your AI clone handle DMs while you focus on what matters.
            <br />
            <span className="text-purple-400 font-semibold">Setup starts in 24 hours.</span>
          </p>
          
          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              <span>47 clones created this week</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Average 24hr delivery</span>
            </div>
          </div>
          
          {/* Main CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105"
            >
              Buy Your Clone Now
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mt-6">
            Connect to Fanbasis or Stripe • Secure Payment Processing
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
