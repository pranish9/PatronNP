import React from 'react';
import { CreditCard, Bell, ShoppingBag, Crown } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Accept Tips Easily',
      description: 'Let your fans send you money instantly with a simple link. No complicated setup.'
    },
    {
      icon: Bell,
      title: 'Live Donation Alerts',
      description: 'Real-time alerts with sound and animation. Perfect for streamers and live creators.'
    },
    {
      icon: ShoppingBag,
      title: 'Sell Digital Products',
      description: 'Sell notes, presets, courses, designs — anything digital. Upload once, earn forever.'
    },
    {
      icon: Crown,
      title: 'Membership Tiers',
      description: 'Bronze, Silver, Gold plans for your biggest fans with exclusive content.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-semibold text-sm uppercase tracking-wider mb-2">
            Everything You Need
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Four powerful ways to <span className="text-emerald-500">earn online</span>
          </h2>
          <p className="text-gray-600 text-lg">
            One platform. Every income stream a modern creator needs.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;