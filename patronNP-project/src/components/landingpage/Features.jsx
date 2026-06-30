import React from 'react';
import { CreditCard, Bell, ShoppingBag, Crown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: CreditCard,
      title: t('landing.feature1Title'),
      description: t('landing.feature1Desc')
    },
    {
      icon: Bell,
      title: t('landing.feature2Title'),
      description: t('landing.feature2Desc')
    },
    {
      icon: ShoppingBag,
      title: t('landing.feature3Title'),
      description: t('landing.feature3Desc')
    },
    {
      icon: Crown,
      title: t('landing.feature4Title'),
      description: t('landing.feature4Desc')
    }
  ];

  const titleHighlight = t('landing.featuresTitleHighlight');

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-semibold text-sm uppercase tracking-wider mb-2">
            {t('landing.featuresEyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {t('landing.featuresTitle1')}{titleHighlight ? ' ' : ''}
            {titleHighlight && <span className="text-emerald-500">{titleHighlight}</span>}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('landing.featuresSubtitle')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;