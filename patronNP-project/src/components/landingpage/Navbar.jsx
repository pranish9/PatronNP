import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../LanguageSwitcher';

const Navbar = ({ onSearchOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { name: t('landing.navFeatures'), path: '#features' },
    { name: t('landing.navHowItWorks'), path: '#how-it-works' },
    { name: t('landing.navEarning'), path: '#earning-sections'},
    { name: t('landing.navTestimonials'), path: '#testimonials' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/android-chrome-192x192.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-gray-900 hidden sm:block">PatronNP</span>
        </Link>

        {/* Desktop Search Trigger - Improved for Tablet/Desktop */}
        {/* 'flex-grow' allows it to take available space, 'max-w-md' keeps it from getting too huge */}
        <button 
          onClick={onSearchOpen}
          className="flex-grow max-w-sm mx-4 flex items-center gap-3 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-500 hover:border-orange-300 hover:bg-white hover:text-orange-600 transition-all shadow-sm"
        >
          <Search size={16} />
          <span className="truncate">{t('landing.searchPlaceholder')}</span>
        </button>

        {/* Desktop Navigation Links - Hidden on small tablets to prevent overflow */}
        <div className="hidden lg:flex items-center gap-6 text-gray-600 text-sm font-medium flex-shrink-0">
          {navLinks.map((item) => (
            <a key={item.name} href={item.path} className="hover:text-gray-900 transition-colors">
              {item.name}
            </a>
          ))}
        </div>

        {/* Auth Buttons - Hidden on small tablets */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <LanguageSwitcher />
          <Link to="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3">{t('landing.login')}</Link>
          <Link to="/signup" className="px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-all shadow-md hover:shadow-orange-200">{t('landing.signUp')}</Link>
        </div>

        {/* Mobile/Tablet Menu Toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile/Tablet Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-xl absolute w-full">
          <button
            onClick={() => { onSearchOpen(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-full text-gray-500 bg-gray-50"
          >
            <Search size={18} /> {t('landing.searchPlaceholder')}
          </button>

          {navLinks.map((item) => (
            <a key={item.name} href={item.path} className="text-gray-600 py-2 font-medium" onClick={() => setIsOpen(false)}>
              {item.name}
            </a>
          ))}

          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>

          <hr />
          <Link to="/signin" className="text-center font-medium text-gray-600 py-2" onClick={() => setIsOpen(false)}>{t('landing.login')}</Link>
          <Link to="/signup" className="bg-orange-500 text-white py-3 rounded-full font-medium text-center" onClick={() => setIsOpen(false)}>{t('landing.signUp')}</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;