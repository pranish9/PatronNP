import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Create your page",
      description: "Sign up and set up your creator profile in minutes. Add your photo, bio, and tip jar."
    },
    {
      id: "02",
      title: "Share your link",
      description: "Drop your PatronNP link on Instagram, YouTube, TikTok, Facebook — anywhere your fans hang out."
    },
    {
      id: "03",
      title: "Start earning",
      description: "Receive tips, sell products, grow subscribers. Withdraw to eSewa, Khalti or your bank."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            Start earning in 3 simple steps
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