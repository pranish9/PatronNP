import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of creators and supporters today. Whether you're a creator looking to earn or a supporter wanting to help, PatronNP is the place to be.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2">
            Start as Creator <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
            Start as Supporter
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-700">
          <div>
            <p className="text-2xl font-bold">0%</p>
            <p className="text-gray-400 text-sm">Platform Fees</p>
          </div>
          <div>
            <p className="text-2xl font-bold">&lt;2hr</p>
            <p className="text-gray-400 text-sm">Instant Payouts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-gray-400 text-sm">Secure</p>
          </div>
          <div>
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-gray-400 text-sm">Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
