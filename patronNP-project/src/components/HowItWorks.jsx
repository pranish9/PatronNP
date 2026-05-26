import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Create an Account',
      description: 'Sign up as a supporter or creator in minutes'
    },
    {
      number: '2',
      title: 'Find Your Creators',
      description: 'Search and follow the creators you love most'
    },
    {
      number: '3',
      title: 'Send a Tip',
      description: 'Choose an amount and send appreciation instantly'
    },
    {
      number: '4',
      title: 'Creators Get Paid',
      description: 'Funds go directly to creators with zero fees'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
        <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
          Four simple steps to support and be supported
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
