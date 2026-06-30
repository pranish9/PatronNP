import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    { question: t('landing.faq1Q'), answer: t('landing.faq1A') },
    { question: t('landing.faq2Q'), answer: t('landing.faq2A') },
    { question: t('landing.faq3Q'), answer: t('landing.faq3A') },
    { question: t('landing.faq4Q'), answer: t('landing.faq4A') },
    { question: t('landing.faq5Q'), answer: t('landing.faq5A') }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Corrected background class here
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">{t('landing.faqEyebrow')}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            {t('landing.faqTitle')}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-emerald-200 transition-colors"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-900"
              >
                {item.question}
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-emerald-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;