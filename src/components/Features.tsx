
import React from 'react';
import { Brain, MessageSquare, Clock, Settings, Target, Heart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Custom-trained AI built on your style",
      description: "Your clone learns your unique voice, personality, and communication patterns",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Personalized DM replies",
      description: "Sales, leads, flirting — your choice. The AI adapts to any conversation context",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Setup in 24 hours",
      description: "From form submission to deployed AI — we handle everything quickly",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Settings,
      title: "Dashboard or plug-and-play prompts",
      description: "Access via your own dashboard or ready-made scripts to deploy anywhere",
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            What You Get
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A complete AI DM system that thinks, talks, and closes like you do
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
