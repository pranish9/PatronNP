import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Aarav Singh',
      role: 'Music Producer',
      content: 'PatronNP changed my life! Now I can focus on creating instead of worrying about income.',
      avatar: '🎵'
    },
    {
      name: 'Sita Patel',
      role: 'Digital Artist',
      content: 'The support from my patrons is incredible. This platform made it possible to pursue art full-time.',
      avatar: '🎨'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Content Creator & Supporter',
      content: 'Love supporting creators here. It\'s the easiest way to show appreciation for amazing content.',
      avatar: '📸'
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Loved by Creators & Supporters</h2>
        <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
          Join thousands of happy creators and supporters
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-8 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
