import React from 'react';
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          PatronNP
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Testimonials</a>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 text-gray-900 font-medium hover:text-gray-600 transition">
            Login
          </button>
          <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;