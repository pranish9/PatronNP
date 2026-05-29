import React from 'react';

const SignUpProgress = ({ currentStep, totalSteps = 4 }) => {
  const steps = ['Authenticate', 'Profile', 'Payment', 'Complete'];

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i < currentStep
                  ? 'bg-emerald-500'
                  : i === currentStep - 1
                  ? 'bg-emerald-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-xs text-gray-500">
          {steps[currentStep - 1]}
        </p>
      </div>
    </div>
  );
};

export default SignUpProgress;
