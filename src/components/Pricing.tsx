
import React from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const plans = [
    {
      name: "Starter Clone",
      price: "$79",
      icon: Zap,
      description: "Perfect for getting started with AI DMs",
      features: [
        "Basic AI training on your style",
        "Standard DM responses",
        "24-hour setup",
        "Email support",
        "Basic dashboard access"
      ],
      popular: false,
      gradient: "from-blue-500 to-purple-500"
    },
    {
      name: "Flirty / Sales Killer Clone",
      price: "$129",
      icon: Star,
      description: "Advanced AI for serious closers",
      features: [
        "Advanced AI training",
        "Specialized flirting & sales modes",
        "Priority 12-hour setup",
        "Advanced conversation flows",
        "Premium dashboard",
        "Chat support"
      ],
      popular: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "VIP Clone",
      price: "$199",
      icon: Crown,
      description: "Complete package with personal strategy",
      features: [
        "Expert AI training & optimization",
        "Custom conversation strategies",
        "1-on-1 strategy session",
        "Priority 6-hour setup",
        "VIP dashboard with analytics",
        "Direct phone support",
        "30-day optimization period"
      ],
      popular: false,
      gradient: "from-pink-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Choose Your Clone
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Select the perfect AI DM system for your needs
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-full border border-red-500/30 backdrop-blur-sm">
            <span className="text-sm text-red-300 font-medium">🔒 Limited to 3 spots tonight</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={index}
                className={`relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                    : 'border-slate-700/50 hover:border-purple-500/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-white">{plan.price}</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white py-3 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular ? 'shadow-lg shadow-purple-500/25' : ''
                  }`}
                >
                  Get {plan.name}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
