import React from 'react';
import { Search, Heart, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '/hero.webp';

const Hero = ({ onSearchOpen }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="text-center md:text-left">
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Support Creators.<br />
            <span className="text-emerald-500">Earn Online.</span><br />
            Grow Your Community.
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            Accept tips, get live donation alerts, sell digital products, and offer 
            membership subscriptions — all in one simple platform built for Nepal.
          </p>

          {/* Search Trigger Button */}
          <button 
            onClick={onSearchOpen}
            className="w-full max-w-md mx-auto md:mx-0 mb-8 flex items-center justify-between pl-6 pr-2 py-4 border border-gray-200 rounded-full focus:outline-none hover:border-orange-500 shadow-sm transition-all text-gray-500 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-400" />
              Find a creator...
            </span>
            <span className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium">
              Search
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center md:justify-start">
            <Link to="/signup" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg text-center">
              Start as Creator
            </Link>
            <Link to="/explore" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-center">
              Support a Creator
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex gap-6 text-gray-500 text-sm justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-500" /> eSewa & Khalti
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" /> Live Alerts
            </div>
          </div>
        </div>

        {/* Right Side: Online Illustration */}
        <div className="relative hidden md:block">
          <img 
            src="/hero.webp" 
            alt="Creators working" 
            className="rounded-3xl shadow-2xl w-full object-cover"
          />
          {/* Floating UI Elements */}
          <div className="absolute top-10 -left-6 bg-white text-gray-900 p-4 rounded-xl shadow-xl w-64 border-l-4 border-emerald-500">
            <p className="text-xs font-bold">Aarav tipped Rs 500</p>
          </div>
          <div className="absolute bottom-10 -right-6 bg-white text-gray-900 p-4 rounded-xl shadow-xl w-64 border-l-4 border-orange-500">
            <p className="text-sm font-bold">Sita joined Gold Tier</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;