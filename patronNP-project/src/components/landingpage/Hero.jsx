import React from 'react';
import { Search, Heart, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const Hero = ({ onSearchOpen }) => {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 md:pt-24 md:pb-24 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">

        {/* Left Side: Content */}
        <div className="text-center md:text-left">
          <h1 className="text-[2.5rem] sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            {t('landing.heroTitle1')}<br />
            <span className="text-emerald-500">{t('landing.heroTitle2')}</span><br />
            {t('landing.heroTitle3')}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            {t('landing.heroSubtitle')}
          </p>

          {/* Search Trigger Button */}
          <button
            onClick={onSearchOpen}
            className="w-full max-w-md mx-auto md:mx-0 mb-8 flex items-center justify-between pl-4 sm:pl-6 pr-2 py-3 sm:py-4 border border-gray-200 rounded-full focus:outline-none hover:border-orange-500 shadow-sm transition-all text-gray-500 hover:shadow-md"
          >
            <span className="flex items-center gap-3 text-sm sm:text-base">
              <Search className="h-5 w-5 text-gray-400" />
              {t('landing.findCreator')}
            </span>
            <span className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base">
              {t('landing.search')}
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center md:justify-start">
            <Link to="/signup" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg text-center">
              {t('landing.startAsCreator')}
            </Link>
            <Link to="/explore" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-center">
              {t('landing.supportACreator')}
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-gray-500 text-xs sm:text-sm justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-500" /> {t('landing.trustEsewaKhalti')}
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" /> {t('landing.trustLiveAlerts')}
            </div>
          </div>
        </div>

        {/* Right Side: Illustration (Hidden on small mobile if needed, or scaled) */}
        <div className="relative hidden md:block">
          <img 
            src="/hero.webp" 
            alt="Creators working" 
            className="rounded-3xl shadow-2xl w-full object-cover"
          />
          <div className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-xl w-48 lg:w-64 border-l-4 border-emerald-500">
            <p className="text-xs font-bold text-gray-900">Pranish tipped Rs 500</p>
          </div>
          <div className="absolute bottom-10 -right-6 bg-white p-4 rounded-xl shadow-xl w-48 lg:w-64 border-l-4 border-orange-500">
            <p className="text-sm font-bold text-gray-900">Raj joined Gold Tier</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;