import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      id: "01",
      title: t('landing.step1Title'),
      description: t('landing.step1Desc')
    },
    {
      id: "02",
      title: t('landing.step2Title'),
      description: t('landing.step2Desc')
    },
    {
      id: "03",
      title: t('landing.step3Title'),
      description: t('landing.step3Desc')
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">
            {t('landing.howItWorksEyebrow')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            {t('landing.howItWorksTitle')}
          </h2>
        </div>

        {/* Steps Grid: 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-bold text-emerald-500 mb-6">
                {step.id}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;