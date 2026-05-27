import React from 'react';
// Import icons explicitly. If one fails, delete the line to test.
import { Play, Camera, Book, Palette, Code, Music, Circle } from 'lucide-react';

const CreatorTypes = () => {
  // Use a safe mapping object
  const creators = [
    { name: 'YouTubers', icon: Play },
    { name: 'Insta / TikTok', icon: Camera },
    { name: 'Students', icon: Book },
    { name: 'Designers', icon: Palette },
    { name: 'Developers', icon: Code },
    { name: 'Musicians', icon: Music },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Built for <span className="text-emerald-500">every kind of creator</span>
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