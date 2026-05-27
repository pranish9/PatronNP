import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  { question: "How do I receive my money?", answer: "You can easily withdraw your earnings directly to your eSewa, Khalti, or linked bank account in Nepal." },
  { question: "What fees do you charge?", answer: "We keep it simple with a small transaction fee only when you earn. No hidden monthly costs." },
  { question: "Is it safe and secure?", answer: "Yes, we use industry-standard encryption and secure payment gateways to ensure your data and funds are protected." },
  { question: "Do I need any technical knowledge?", answer: "Not at all! Our platform is designed for everyone. If you can use social media, you can use our platform." },
  { question: "Can I sell any digital product?", answer: "Yes! You can sell e-books, presets, templates, exclusive videos, and much more." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Corrected background class here
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            Got questions?
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