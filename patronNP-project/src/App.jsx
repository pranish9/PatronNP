import React from 'react';
import { Heart, Users, TrendingUp, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';
import Navbar from './components/landingpage/Navbar';
import { HeartOff } from 'lucide-react';  
import Hero from './components/landingpage/Hero';
import Features from './components/landingpage/Features';
import HowItWorks from './components/landingpage/HowItWorks';
import Testimonials from './components/landingpage/Testimonials';
import CTA from './components/landingpage/CTA';
import Footer from './components/landingpage/Footer'; 

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default App;