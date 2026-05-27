import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SearchModal from '../components/search/SearchModal';
import Navbar from '../components/landingpage/Navbar';
import Hero from '../components/landingpage/Hero';
import Features from '../components/landingpage/Features';
import HowItWorks from '../components/landingpage/HowItWorks';
import Testimonials from '../components/landingpage/Testimonials';
import CTA from '../components/landingpage/CTA';
import Footer from '../components/landingpage/Footer';

const Home = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero with Search Bar */}
      <div className="relative">
        <Hero />
        
        {/* Search Bar */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-10">
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-full flex items-center gap-3 hover:border-blue-500 transition-colors shadow-md"
            >
              <Search size={20} className="text-gray-400" />
              <span className="text-gray-500">Search for services, people...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}

      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
