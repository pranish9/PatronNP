import React, { useState, useEffect } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SignUpProgress from '../components/SignUpProgress';
import Step1Identity from './SignUpSteps/Step1Identity';
import Step2Authentication from './SignUpSteps/Step2Authentication';
import Step3Profile from './SignUpSteps/Step3Profile';
import Step4Payment from './SignUpSteps/Step4Payment';
import Step5FinalPage from './SignUpSteps/Step5FinalPage';

const OnboardingContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    username: '',
    // Step 2
    authMethod: null,
    email: '',
    password: '',
    confirmPassword: '',
    googleData: null,
    socialData: null,
    // Step 3
    displayName: '',
    profilePicture: null,
    profilePictureUrl: '',
    about: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      website: ''
    },
    // Step 4
    paymentMethods: [],
    selectedPaymentMethod: null,
    phoneNumber: '',
    phoneVerified: false,
    otpVerified: false,
    // Step 5
    publicPageCreated: false
  });

  // Persist form data to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('onboardingFormData', JSON.stringify(formData));
  }, [formData]);

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('onboardingFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to restore form data:', error);
      }
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < 5) {
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
          <Step1Identity
            onNext={handleStepComplete}
            formData={formData}
            setFormData={handleFormDataUpdate}
          />
        );
      case 2:
        return (
          <Step2Authentication
            onNext={handleStepComplete}
            onPrev={handlePrevStep}
            formData={formData}
            setFormData={handleFormDataUpdate}
          />
        );
      case 3:
        return (
          <Step3Profile
            onNext={handleStepComplete}
            onPrev={handlePrevStep}
            formData={formData}
            setFormData={handleFormDataUpdate}
          />
        );
      case 4:
        return (
          <Step4Payment
            onNext={handleStepComplete}
            onPrev={handlePrevStep}
            formData={formData}
            setFormData={handleFormDataUpdate}
          />
        );
      case 5:
        return (
          <Step5FinalPage
            formData={formData}
            onRestart={() => {
              setCurrentStep(1);
              setFormData({
                username: '',
                authMethod: null,
                email: '',
                password: '',
                confirmPassword: '',
                googleData: null,
                socialData: null,
                displayName: '',
                profilePicture: null,
                profilePictureUrl: '',
                about: '',
                socialLinks: {
                  twitter: '',
                  instagram: '',
                  facebook: '',
                  linkedin: '',
                  website: ''
                },
                paymentMethods: [],
                selectedPaymentMethod: null,
                phoneNumber: '',
                phoneVerified: false,
                otpVerified: false,
                publicPageCreated: false
              });
              sessionStorage.removeItem('onboardingFormData');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout fullWidth={currentStep === 5}>
      {currentStep !== 5 && <SignUpProgress currentStep={currentStep} totalSteps={5} />}
      <div className="animate-fade-in">
        {renderStep()}
      </div>
    </AuthLayout>
  );
};

export default OnboardingContainer;
