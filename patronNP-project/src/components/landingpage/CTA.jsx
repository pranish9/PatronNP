import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = ({ onSearchOpen }) => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-20 text-center shadow-2xl relative overflow-hidden">
        
        {/* Background Depth Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Start earning from your <br className="hidden md:block" /> audience today.
          </h2>
          
          <p className="text-emerald-50 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
            Join hundreds of Nepali creators turning their passion into real income with a platform built for your growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="group flex items-center gap-2 w-full sm:w-auto px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-400/30"
            >
              Become a Creator
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Clickable button to trigger the search */}
            <button 
              onClick={onSearchOpen}
              className="flex items-center gap-2 w-full sm:w-auto px-8 py-4 bg-emerald-700/30 text-white font-bold rounded-full hover:bg-emerald-700/50 transition-all backdrop-blur-sm border border-emerald-400/20"
            >
              <Search size={18} />
              Explore Creators
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;