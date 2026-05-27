import React from 'react';
import { Users, TrendingUp, Zap, Lock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Users,
      title: 'Easy to Use',
      description: 'Simple, intuitive interface for supporters to send tips in seconds'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Support',
      description: 'Help creators build a sustainable income from their passion'
    },
    {
      icon: Zap,
      title: 'Instant Payouts',
      description: 'Fast and reliable payment processing directly to creators'
    },
    {
      icon: Lock,
      title: 'Secure & Safe',
      description: 'Bank-level security for all transactions and personal data'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Why Choose PatronNP?</h2>
        <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
          We provide everything creators and supporters need for meaningful connections
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-8 border border-gray-200 rounded-xl hover:border-gray-300 transition">
                <Icon className="w-12 h-12 text-gray-900 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
