import React from 'react';
// Import your logo from your assets folder
import logo from '/android-chrome-192x192.png';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../LanguageSwitcher';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="PatronNP Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="font-bold text-xl text-emerald-600">PatronNP</span>
          </div>
          <p className="text-gray-500 text-sm">
            {t('landing.footerTagline')}
          </p>
          <LanguageSwitcher />
        </div>

        {/* Links Sections */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">{t('landing.footerProduct')}</h4>
          <ul className="space-y-2 text-gray-600 text-sm cursor-pointer">
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerFeatures')}</li>
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerPricing')}</li>
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerHowItWorks')}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">{t('landing.footerCompany')}</h4>
          <ul className="space-y-2 text-gray-600 text-sm cursor-pointer">
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerAbout')}</li>
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerContact')}</li>
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerBlog')}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">{t('landing.footerLegal')}</h4>
          <ul className="space-y-2 text-gray-600 text-sm cursor-pointer">
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerTerms')}</li>
            <li className="hover:text-emerald-600 transition-colors">{t('landing.footerPrivacy')}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} {t('landing.footerCopyright')}
      </div>
    </footer>
  );
};

export default Footer;