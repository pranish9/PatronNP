import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Bibek Shrestha",
    role: "Twitch Streamer",
    initial: "B",
    text: "I earned my first Rs 10,000 in two weeks. The live alerts make my stream so much more interactive.",
    rating: 5
  },
  {
    name: "Anjali Karki",
    role: "YouTuber",
    initial: "A",
    text: "Super easy to set up. My subscribers love being able to support me directly through eSewa.",
    rating: 5
  },
  {
    name: "Roshan Tamang",
    role: "Designer",
    initial: "R",
    text: "Selling my Photoshop presets has become a real side income. No coding, no headaches.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">
            What creators say
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            Loved by Nepali <span className="text-emerald-500">creators</span>
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