import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, CheckCircle, Loader, Phone } from 'lucide-react';

const Step4Payment = ({ onNext, onPrev, formData, setFormData }) => {
  const [paymentMethods, setPaymentMethods] = useState(formData.paymentMethods || []);
  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber || '');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(formData.phoneVerified || false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const paymentProviders = [
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Quick and easy setup',
      gradient: 'from-orange-400 to-orange-600',
      icon: 'e'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      description: 'Popular payment gateway',
      gradient: 'from-purple-500 to-purple-700',
      icon: 'K'
    }
  ];

  const formatPhoneNumber = (value) => {
    return value.replace(/\D/g, '').slice(-10);
  };

  const maskPhoneNumber = (phone) => {
    return `****${phone.slice(-4)}`;
  };

  const togglePaymentMethod = (methodId) => {
    setError('');
    setPaymentMethods(prev =>
      prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId]
    );
  };

  const handleRequestOtp = async () => {
    setError('');
    
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    const cleanedPhone = formatPhoneNumber(phoneNumber);
    
    if (cleanedPhone.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    if (paymentMethods.length === 0) {
      setError('Please select at least one payment provider');
      return;
    }

    setOtpLoading(true);
    
    // Simulate OTP sending API call
    setTimeout(() => {
      setPhoneNumber(cleanedPhone);
      setOtpSent(true);
      setShowOtpModal(true);
      setOtpLoading(false);
      setError('');
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    setError('');

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 4 && otp.length !== 6) {
      setError('OTP must be 4-6 digits');
      return;
    }

    setVerifying(true);

    // Simulate OTP verification API call
    setTimeout(() => {
      // Mock verification: accept OTPs like 1234, 123456, or 9999
      if (['1234', '123456', '9999'].includes(otp) || otp === '0000') {
        setPhoneVerified(true);
        setShowOtpModal(false);
        setOtp('');
        setOtpSent(false);
        setError('');
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setVerifying(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (paymentMethods.length === 0) {
      setError('Please select at least one payment provider');
      return;
    }

    if (!phoneVerified) {
      setError('Phone number verification is required');
      return;
    }

    setFormData({
      paymentMethods,
      phoneNumber,
      phoneVerified,
      otpVerified: true
    });

    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Payment Method</h1>
        <p className="text-gray-600">Get paid directly. This step is required to receive funds.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Trust Badge */}
      <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
        <Lock size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-emerald-900">Secure Payment Gateway</p>
          <p className="text-emerald-700 text-xs">Select at least one payment provider to receive funds</p>
        </div>
      </div>

      {/* Payment Provider Selection */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Select Payment Providers (Select at least one)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentProviders.map(provider => (
            <button
              key={provider.id}
              onClick={() => togglePaymentMethod(provider.id)}
              type="button"
              className={`p-4 border-2 rounded-lg transition-all text-left cursor-pointer ${
                paymentMethods.includes(provider.id)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${provider.gradient} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                    {provider.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                  </div>
                </div>
                {paymentMethods.includes(provider.id) && (
                  <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Phone Verification Section */}
      {paymentMethods.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Phone size={16} className="text-blue-600" />
            Verify Phone Number
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Phone verification is mandatory for payment processing. We use this to secure your account.
          </p>

          {!phoneVerified ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number (10 digits)
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="98xxxxxxxxx"
                    maxLength="10"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={phoneVerified}
                  />
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={!phoneNumber || phoneNumber.length !== 10 || otpLoading || phoneVerified}
                    className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm flex items-center gap-2"
                  >
                    {otpLoading ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg text-xs text-blue-900">
                  ✓ OTP sent to {maskPhoneNumber(phoneNumber)}. Check your phone.
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-2 text-emerald-900">
              <CheckCircle size={16} className="flex-shrink-0" />
              <span className="text-xs font-medium">
                Phone verified: {maskPhoneNumber(phoneNumber)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Security Info */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">🔒 Payment Security</span>
          <br />
          Your payment credentials are never stored on our servers. We use secure payment gateways only.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={paymentMethods.length === 0 || !phoneVerified}
          className={`flex-1 py-3 font-semibold rounded-lg transition-colors ${
            paymentMethods.length > 0 && phoneVerified
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verify Phone Number</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 4-6 digit OTP sent to {maskPhoneNumber(phoneNumber)}
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-2xl letter-spacing tracking-widest"
                disabled={verifying}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.length < 4 || verifying}
                className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                  setError('');
                }}
                className="w-full py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                disabled={verifying}
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              For demo: Try OTP codes like 1234, 123456, or 9999
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Payment;
