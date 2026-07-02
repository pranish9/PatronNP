import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import { scheduleAutoLogout } from "../utils/authTimer";
import { useLanguage } from "../hooks/useLanguage";
import { API_HOST } from "../utils/apiHost";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const { username, email, password } = location.state || {};

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if page accessed directly
  useEffect(() => {
    if (!username || !email || !password) {
      navigate("/signup");
    }
  }, [username, email, password, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      setError(t('auth.enterValid6DigitOtp'));
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_HOST}/auth/verify-otp-register`,
        {
          username,
          email,
          password,
          otp,
        }
      );

      const user = res.data;

      localStorage.setItem("accessToken", user.token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      scheduleAutoLogout();

      toast.success(t('auth.signUpSuccess'));

      navigate("/onboarding");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        t('auth.invalidOtp');

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await axios.post(
        `${API_HOST}/auth/send-otp`,
        {
          email,
        }
      );

      toast.success(t('auth.otpSentSuccess'));

      setTimer(60);
      setOtp("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        t('auth.failedToResendOtp');

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout fullWidth={false}>
      <div className="max-w-md mx-auto py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold">
            {t('auth.verifyEmailTitle')}
          </h1>
        </div>

        {/* Email Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <p className="text-sm text-green-700 text-center">
            {t('auth.verificationCodeSentTo')}
          </p>

          <p className="font-semibold text-center mt-1 break-all">
            {email}
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            {t('auth.enterOTP')}
          </label>

          <input
            type="text"
            value={otp}
            maxLength={6}
            placeholder="000000"
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            className="w-full border-2 border-gray-300 rounded-xl p-4 text-center text-3xl font-bold tracking-widest focus:border-green-500 outline-none"
          />
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-5">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index < otp.length
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Timer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-center">
          {timer > 0 ? (
            <>
              <p className="text-sm text-blue-700 mb-2">
                {t('auth.resendAvailableInLabel')}
              </p>

              <p className="text-3xl font-bold text-blue-600">
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm mb-3 text-blue-700">
                {t('auth.didntReceiveCode')}
              </p>

              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {t('auth.resendOTP')}
              </button>
            </>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
          className={`w-full p-4 rounded-xl text-white font-semibold ${
            otp.length === 6 && !loading
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader size={18} className="animate-spin" />
              {t('auth.verifying')}
            </span>
          ) : (
            t('auth.createAccount')
          )}
        </button>

        <p className="text-xs text-center text-gray-500 mt-6">
          {t('auth.infoSecure')}
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTPPage;