import React from 'react';
import { Wallet, TrendingUp, ShoppingBag } from 'lucide-react';

const EarningsSection = () => {
  const earningMethods = [
    { name: 'Direct Tips', desc: 'From fans who love your work', amount: 'Rs 2,000+', icon: Wallet },
    { name: 'Subscriptions', desc: 'Monthly recurring income', amount: 'Rs 8,000+', icon: TrendingUp },
    { name: 'Product Sales', desc: 'Sell anytime, anywhere', amount: 'Rs 10,000+', icon: ShoppingBag },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content */}
        <div className="space-y-8">
          <div>
            <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">
              Earn in multiple ways
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">
              From Rs 5,000 to <br />
              <span className="text-emerald-500">Rs 50,000+ per month</span>
            </h2>
            <p className="text-gray-600 mt-6 text-lg max-w-md">
              Stack your income streams. Even small Nepali creators are earning a stable side income with tips, members, and digital products.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
            <p className="text-gray-500 text-sm font-medium">Average monthly potential</p>
            <h3 className="text-4xl font-bold text-gray-900 mt-1">Rs 20,000</h3>
            <p className="text-gray-400 text-xs mt-2">Based on active creators with 1k+ followers</p>
          </div>
        </div>

        {/* Right Side: List */}
        <div className="space-y-4">
          {earningMethods.map((method, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <method.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-500">{method.desc}</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600">{method.amount}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EarningsSection;