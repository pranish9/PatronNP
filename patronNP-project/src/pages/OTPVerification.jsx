import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { useLanguage } from '../hooks/useLanguage';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const email = location.state?.email || 'user@example.com';

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError(t('errors.enterAllDigits'));
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to password reset page
      navigate('/reset-password', { state: { email, otp: otpValue } });
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/forgot-password')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft size={18} />
          {t('common.back')}
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('auth.verifyOtpTitle')}</h1>
        <p className="text-gray-600 mt-2">
          {t('auth.sentCodeTo')} <span className="font-semibold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">{t('auth.enterOTP')}</label>
          <div className="flex gap-2 sm:gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            ))}
          </div>
        </div>

        {/* Resend Option */}
        <div className="text-center text-sm text-gray-600">
          {t('auth.didntReceiveCode')}{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {t('auth.resendOTP')}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? t('auth.verifying') : t('auth.verifyOtpTitle')}
        </button>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;
