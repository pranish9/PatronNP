import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t('landing.testimonial1Name'),
      role: t('landing.testimonial1Role'),
      initial: "B",
      text: t('landing.testimonial1Text'),
      rating: 5
    },
    {
      name: t('landing.testimonial2Name'),
      role: t('landing.testimonial2Role'),
      initial: "A",
      text: t('landing.testimonial2Text'),
      rating: 5
    },
    {
      name: t('landing.testimonial3Name'),
      role: t('landing.testimonial3Role'),
      initial: "R",
      text: t('landing.testimonial3Text'),
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">
            {t('landing.testimonialsEyebrow')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            {t('landing.testimonialsTitle1')} <span className="text-emerald-500">{t('landing.testimonialsTitleHighlight')}</span>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                "{t.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                  {t.initial}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;