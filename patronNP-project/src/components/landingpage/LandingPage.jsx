import React from 'react';
import { Heart, Users, TrendingUp, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';
import Navbar from './Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import Testimonials from './sections/Testimonials';
import CTA from './sections/CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
