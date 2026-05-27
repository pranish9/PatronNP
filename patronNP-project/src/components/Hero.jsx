import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Support your favorite creators, <span className="text-red-500">one tip at a time</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          PatronNP makes it easy for supporters to send tips and show appreciation to content creators, artists, and makers they love.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2">
            Start Supporting <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition">
            Learn More
          </button>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">10k+</div>
            <div className="text-gray-600">Active Creators</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">50k+</div>
            <div className="text-gray-600">Happy Supporters</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">$2M+</div>
            <div className="text-gray-600">Tips Distributed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
