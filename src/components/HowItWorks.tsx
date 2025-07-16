
import React from 'react';
import { FileText, Cpu, Rocket, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Fill out a quick form",
      description: "Tell us about your style, tone, and what you want your AI clone to achieve",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Cpu,
      title: "We create your custom AI",
      description: "Our team builds and trains your personalized DM system using advanced AI",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Rocket,
      title: "Deploy and start closing",
      description: "Get your dashboard or script and watch your AI handle DMs like a pro",
      color: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMzc0MTUxIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From zero to AI DM master in three simple steps
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex flex-col md:flex-row items-center mb-12 last:mb-0">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <span className="text-2xl font-bold text-purple-400 mr-4">0{index + 1}</span>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block ml-8">
                    <ArrowRight className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
