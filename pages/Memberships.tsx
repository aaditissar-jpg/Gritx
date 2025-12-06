import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MembershipPlan } from '../types';
import { CheckCircle, Zap } from 'lucide-react';
import { formatCurrency } from '../lib/currency';

const Memberships: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    api.memberships.list().then(setPlans);
  }, []);

  return (
    <div className="bg-bg min-h-screen py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">Unlock Your <span className="text-glow text-primary">Potential</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the community of elite performers. Choose the plan that fits your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                plan.recommended 
                  ? 'bg-surface border-2 border-primary shadow-neon scale-105 z-10' 
                  : 'bg-surface/50 border border-white/10 hover:border-white/30 backdrop-blur-sm'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-black px-6 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" />
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="font-display text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-bold text-white">{formatCurrency(plan.price)}</span>
                <span className="ml-2 text-gray-500 font-medium">/{plan.billingCycle}</span>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              <ul className="space-y-5 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.recommended ? 'text-primary' : 'text-gray-500'}`} />
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                plan.recommended
                  ? 'bg-primary text-black hover:bg-white hover:shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white hover:text-black'
              }`}>
                SELECT PLAN
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Memberships;
