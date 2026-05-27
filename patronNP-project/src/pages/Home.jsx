import React, { useState, useCallback } from 'react';
import SearchModal from '../components/search/SearchModal';
import Navbar from '../components/landingpage/Navbar';
import Hero from '../components/landingpage/Hero';
import Features from '../components/landingpage/Features';
import HowItWorks from '../components/landingpage/HowItWorks';
import CreatorTypes from '../components/landingpage/CreatorTypes';
import Testimonials from '../components/landingpage/Testimonials';
import CTA from '../components/landingpage/CTA';
import EarningsSection from '../components/landingpage/EarningsSection';
import Footer from '../components/landingpage/Footer';
import FAQ from '../components/landingpage/FQA';

const Home = () => {
  // 1. Initialized to false so it does not load on page start
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 2. Use callbacks for clean prop passing
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar now properly triggers the modal open */}
      <Navbar onSearchOpen={openSearch} />
      
      <main>
        <div id="hero">
          <Hero onSearchOpen={openSearch} />
        </div>

        <div id="features">
          <Features />
        </div>
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="creator-types">  
          <CreatorTypes />
        </div>
        <div id="earning-sections">
          <EarningsSection />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <FAQ />
        <div id="cta">
          <CTA />
        </div>
      </main>

      <Footer />

      {/* 3. Modal logic: Render only when isSearchOpen is true */}
      {isSearchOpen && (
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={closeSearch} 
        />
      )}
    </div>
  );
};

export default Home;