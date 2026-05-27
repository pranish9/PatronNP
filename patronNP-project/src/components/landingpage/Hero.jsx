import React from 'react';
import { Search, Heart, Bell } from 'lucide-react';

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Container: Stacks on mobile (default), side-by-side on md screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Made for Nepali Creators
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Support Creators.<br />
            <span className="text-emerald-500">Earn Online.</span><br />
            Grow Your Community.
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            Accept tips, get live donation alerts, sell digital products, and offer 
            membership subscriptions — all in one simple platform built for Nepal.
          </p>

          {/* Search Bar - Responsive width */}
          <div className="relative max-w-md mx-auto md:mx-0 mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              placeholder="Find a creator..."
            />
            {/* Hide 'Search' text button on very small screens if it gets too crowded, or stack it */}
            <button className="hidden sm:block absolute right-2 top-2 bottom-2 bg-orange-500 text-white px-6 rounded-full font-medium hover:bg-orange-600 transition">
              Search
            </button>
          </div>

          {/* Action Buttons - Stacked on small, side-by-side on larger */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center md:justify-start">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg">
              Start as Creator
            </button>
            <button className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
              Support a Creator
            </button>
          </div>

          <div className="flex gap-6 text-gray-500 text-sm justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-500" /> eSewa & Khalti
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" /> Live Alerts
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="relative hidden md:block">
          <div className="bg-gray-900 rounded-3xl p-8 aspect-[4/3] flex items-center justify-center text-white">
            <div className="text-center italic text-gray-500">[Illustration]</div>
            
            {/* Floating Cards - Positioned relative to the container */}
            <div className="absolute top-10 -left-6 bg-white text-gray-900 p-4 rounded-xl shadow-xl w-64">
              <p className="text-xs font-bold">Aarav tipped Rs 500</p>
            </div>
            <div className="absolute bottom-10 -right-6 bg-white text-gray-900 p-4 rounded-xl shadow-xl w-64">
              <p className="text-sm font-bold">Sita joined Gold Tier</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;