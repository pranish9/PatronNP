import React from 'react';
// Import icons explicitly. If one fails, delete the line to test.
import { Play, Camera, Book, Palette, Code, Music, Circle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const CreatorTypes = () => {
  const { t } = useLanguage();

  // Use a safe mapping object
  const creators = [
    { name: t('landing.creatorYoutubers'), icon: Play },
    { name: t('landing.creatorInstaTiktok'), icon: Camera },
    { name: t('landing.creatorStudents'), icon: Book },
    { name: t('landing.creatorDesigners'), icon: Palette },
    { name: t('landing.creatorDevelopers'), icon: Code },
    { name: t('landing.creatorMusicians'), icon: Music },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            {t('landing.creatorTypesTitle1')} <span className="text-emerald-500">{t('landing.creatorTypesTitleHighlight')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {creators.map((item, index) => {
            const Icon = item.icon || Circle; // Default to Circle if icon is missing
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all"
              >
                <Icon className="w-8 h-8 text-emerald-500 mb-4" />
                <span className="text-sm font-semibold text-gray-700">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CreatorTypes;