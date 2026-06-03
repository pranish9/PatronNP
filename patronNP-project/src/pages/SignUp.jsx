import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingContainer from './OnboardingContainer';

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token || user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <OnboardingContainer />;
};

export default SignUp;