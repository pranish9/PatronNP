import React, { useState, useEffect } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SignUpProgress from '../components/SignUpProgress';
import SignUpPhase1 from './SignUpSteps/SignUpPhase1';
import AuthMethodChoice from './SignUpSteps/AuthMethodChoice';
import SignUpPhase2 from './SignUpSteps/SignUpPhase2';

const OnboardingContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Signup Phase 1
    username: '',
    // Signup Phase 2 - Auth Method
    authMethod: null,
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Persist form data to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [formData]);

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('signupFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to restore form data:', error);
      }
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepComplete = () => {
    handleNextStep();
  };

  const handleFormDataUpdate = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignUpPhase1
            onNext={handleStepComplete}
            formData={formData}
            setFormData={handleFormDataUpdate}
          />
        );
      case 2:
        return (
          <AuthMethodChoice
            onEmailChoice={() => {
              handleFormDataUpdate({ authMethod: 'email' });
              handleNextStep();
            }}
            onGoogleChoice={() => {
              handleFormDataUpdate({ authMethod: 'google' });
              handleNextStep();
            }}
          />
        );
      case 3:
        return (
          <SignUpPhase2
            onNext={handleStepComplete}
            onPrev={handlePrevStep}
            formData={formData}
            setFormData={handleFormDataUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout fullWidth={false}>
      <SignUpProgress currentStep={currentStep} totalSteps={3} />
      <div className="animate-fade-in">
        {renderStep()}
      </div>
    </AuthLayout>
  );
};

export default OnboardingContainer;
