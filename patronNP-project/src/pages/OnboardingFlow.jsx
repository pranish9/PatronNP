import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import SignUpProgress from '../components/SignUpProgress';
import OnboardingPhase1 from './OnboardingSteps/OnboardingPhase1';
import OnboardingPhase2 from './OnboardingSteps/OnboardingPhase2';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Phase 1: Profile Setup
    profilePicture: null,
    profilePictureUrl: '',
    fullName: '',
    about: '',
    socialLink: '',
    socialPlatform: 'instagram',
    
    // Phase 2: Payment Setup
    selectedPaymentMethod: null,
    esewa_walletId: '',
    khalti_walletId: '',
    mobileNumber: '',
    mobileVerified: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/signup');
    }
  }, [navigate]);

  // Persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('onboardingData', JSON.stringify(profileData));
  }, [profileData]);

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

  const handleComplete = async () => {
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1500));

      localStorage.setItem('profileComplete', 'true');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Redirect to creator profile
      navigate(`/${user.username}`);
    } catch (error) {
      console.error('Onboarding failed:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingPhase1
            profileData={profileData}
            setProfileData={setProfileData}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <OnboardingPhase2
            profileData={profileData}
            setProfileData={setProfileData}
            onNext={handleComplete}
            onPrev={handlePrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout fullWidth={false}>
      <SignUpProgress currentStep={currentStep} totalSteps={2} />
      <div className="animate-fade-in">
        {renderStep()}
      </div>
    </AuthLayout>
  );
};

export default OnboardingFlow;
