import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SignUpProgress from '../components/SignUpProgress';
import Step1Authentication from './SignUpSteps/Step1Authentication';
import Step2Profile from './SignUpSteps/Step2Profile';
import Step3Payment from './SignUpSteps/Step3Payment';
import Step4Success from './SignUpSteps/Step4Success';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    authMethod: null,
    email: '',
    password: '',
    name: '',
    uniqueUrl: '',
    category: '',
    paymentConnected: false,
    paymentMethod: null,
  });

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Authentication
            onNext={handleNextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <Step2Profile
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <Step3Payment
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return <Step4Success formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <AuthLayout fullWidth={currentStep === 4}>
      {currentStep !== 4 && <SignUpProgress currentStep={currentStep} />}
      {renderStep()}
    </AuthLayout>
  );
};

export default SignUp;
