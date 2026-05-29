import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignIn from '../components/auth/GoogleSignIn';

const SignIn = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // States: 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) setStep('otp');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center w-full max-w-5xl mx-auto py-6 px-4">
        <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="w-10 h-10 overflow-hidden rounded-lg shadow-sm">
            <img 
              src="/android-chrome-192x192.png" 
              alt="PatronNP Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-[#111827] font-bold text-xl tracking-tight">PatronNP</span>
        </a>
        
        <div className="text-sm text-[#111827]">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/signup')} 
            className="text-[#10B981] font-semibold hover:underline"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Main Login Card */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#111827]">Welcome back</h1>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[#E5E7EB] rounded-lg bg-[#F8FAFC] focus:ring-2 focus:ring-[#10B981] outline-none"
                />
                <button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 rounded-lg transition-colors">
                  Continue with email
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-[#F8FAFC] p-3 rounded-lg text-sm text-[#111827] border border-[#E5E7EB]">
                  {email}
                </div>
                <input
                  type="text"
                  placeholder="Paste login code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
                />
                <p className="text-sm text-[#6B7280]">We just sent you a temporary login code. Please check your inbox.</p>
                <button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 rounded-lg transition-colors">
                  Login
                </button>
                <button onClick={() => setStep('email')} className="w-full text-sm text-[#6B7280] hover:underline">
                  Resend code
                </button>
              </div>
            )}
          </div>

          {/* Social Authentication */}
          <div className="mt-6">
            <div className="relative flex items-center mb-4">
              <div className="flex-grow border-t border-[#E5E7EB]"></div>
              <span className="px-3 text-sm text-[#6B7280]">or login with</span>
              <div className="flex-grow border-t border-[#E5E7EB]"></div>
            </div>
            <GoogleSignIn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;