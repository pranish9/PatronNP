import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const OnboardingPhase2 = ({ profileData, setProfileData, onNext, onPrev }) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');

  const handlePaymentMethodChange = (method) => {
    setProfileData({
      ...profileData,
      selectedPaymentMethod: method,
      esewa_walletId: '',
      khalti_walletId: '',
    });
    setErrors({});
  };

  const handleSendMobileOTP = async () => {
    const newErrors = {};

    if (!profileData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(profileData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Mock API call
        await new Promise(r => setTimeout(r, 1000));
        setMobileOtpSent(true);
        toast.success('OTP sent to your mobile');
      } catch (err) {
        toast.error('Failed to send OTP');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyAndComplete = async () => {
    const newErrors = {};

    if (!profileData.selectedPaymentMethod) {
      newErrors.selectedPaymentMethod = 'Please select a payment method';
    }

    if (profileData.selectedPaymentMethod === 'esewa') {
      if (!profileData.esewa_walletId.trim()) {
        newErrors.esewa_walletId = 'eSewa wallet ID is required';
      }
    } else if (profileData.selectedPaymentMethod === 'khalti') {
      if (!profileData.khalti_walletId.trim()) {
        newErrors.khalti_walletId = 'Khalti wallet ID is required';
      }
    }

    if (!profileData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(profileData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit number';
    }

    if (mobileOtpSent && !profileData.mobileVerified) {
      if (!mobileOtp) {
        newErrors.mobileOtp = 'Please enter the OTP';
      } else if (mobileOtp.length !== 6) {
        newErrors.mobileOtp = 'OTP must be 6 digits';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Mock OTP verification
        if (mobileOtpSent) {
          await new Promise(r => setTimeout(r, 1000));
        }

        setProfileData({
          ...profileData,
          mobileVerified: true,
        });

        // Call completion handler
        await new Promise(r => setTimeout(r, 500));
        onNext();
      } catch (err) {
        toast.error('Verification failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Setup
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add your payment method for receiving support
        </p>
      </div>

      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Payment Method *
          </label>

          <div className="space-y-3">
            {/* eSewa Option */}
            <button
              onClick={() => handlePaymentMethodChange('esewa')}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                profileData.selectedPaymentMethod === 'esewa'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  E
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">eSewa</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Nepal's leading payment platform
                  </p>
                </div>
              </div>
            </button>

            {/* Khalti Option */}
            <button
              onClick={() => handlePaymentMethodChange('khalti')}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                profileData.selectedPaymentMethod === 'khalti'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  K
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Khalti</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Digital wallet & payment app
                  </p>
                </div>
              </div>
            </button>
          </div>

          {errors.selectedPaymentMethod && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {errors.selectedPaymentMethod}
            </p>
          )}
        </div>

        {/* eSewa Wallet ID */}
        {profileData.selectedPaymentMethod === 'esewa' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              eSewa Wallet/Mobile Number *
            </label>
            <input
              type="text"
              value={profileData.esewa_walletId}
              onChange={(e) =>
                setProfileData({ ...profileData, esewa_walletId: e.target.value })
              }
              placeholder="98XXXXXXXX or email"
              className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition ${
                errors.esewa_walletId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
              }`}
            />
            {errors.esewa_walletId && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.esewa_walletId}
              </p>
            )}
          </div>
        )}

        {/* Khalti Wallet ID */}
        {profileData.selectedPaymentMethod === 'khalti' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Khalti Wallet/Mobile Number *
            </label>
            <input
              type="text"
              value={profileData.khalti_walletId}
              onChange={(e) =>
                setProfileData({ ...profileData, khalti_walletId: e.target.value })
              }
              placeholder="98XXXXXXXX or email"
              className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition ${
                errors.khalti_walletId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
              }`}
            />
            {errors.khalti_walletId && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.khalti_walletId}
              </p>
            )}
          </div>
        )}

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mobile Number (Nepal) *
          </label>
          <input
            type="tel"
            value={profileData.mobileNumber}
            onChange={(e) =>
              setProfileData({ ...profileData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })
            }
            placeholder="9800000000"
            maxLength="10"
            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition ${
              errors.mobileNumber
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
            }`}
            disabled={mobileOtpSent}
          />
          {errors.mobileNumber && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.mobileNumber}
            </p>
          )}
        </div>

        {/* Send OTP Button */}
        {!mobileOtpSent && (
          <button
            onClick={handleSendMobileOTP}
            disabled={isLoading || !profileData.mobileNumber}
            className="w-full py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Sending...' : 'Send OTP to Mobile'}
          </button>
        )}

        {/* Mobile OTP Verification */}
        {mobileOtpSent && !profileData.mobileVerified && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={mobileOtp}
              onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 transition ${
                errors.mobileOtp
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
              }`}
            />
            {errors.mobileOtp && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.mobileOtp}
              </p>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-400">
            <span className="font-semibold">✓ Secure Payment</span>
            <br />
            Your payment information is encrypted and secure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="flex-1 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={handleVerifyAndComplete}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {isLoading ? 'Please wait...' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPhase2;
