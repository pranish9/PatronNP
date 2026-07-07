import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_HOST } from "../utils/apiHost";
import { useLanguage } from "../hooks/useLanguage";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      return setError(t('auth.emailRequired'));
    }

    try {
      setLoading(true);
      await axios.post(`${API_HOST}/auth/forgot-password`, { email });
      toast.success(t('auth.otpSent'));
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || t('payment.failedToSendOtp'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      return setError(t('auth.enterValidOtp'));
    }
    if (newPassword.length < 6) {
      return setError(t('auth.passwordMinLength'));
    }
    if (newPassword !== confirmPassword) {
      return setError(t('auth.passwordMismatch'));
    }

    try {
      setLoading(true);
      await axios.post(`${API_HOST}/auth/reset-password`, {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      toast.success(t('auth.signInSuccess'));
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || t('auth.invalidOtp'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <img
            src="/android-chrome-192x192.png"
            alt="PatronNP"
            className="w-16 h-16 mx-auto rounded-2xl shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-900">{t('auth.resetYourPassword')}</h2>
          <p className="text-gray-500 mt-2 text-sm">
            {step === "email"
              ? t('auth.forgotPasswordEmailStep')
              : t('auth.forgotPasswordResetStep')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder={t('auth.enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50"
            >
              {loading ? t('auth.sendingOtp') : t('auth.sendOtpButton')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              {t('auth.otpSentTo')} <span className="font-semibold">{email}</span>
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full p-4 text-center text-2xl tracking-[10px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="password"
              placeholder={t('auth.newPassword')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="password"
              placeholder={t('auth.confirmPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50"
            >
              {loading ? t('auth.resettingPassword') : t('auth.resetPasswordButton')}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              {t('auth.changeEmail')}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate("/signin")}
          className="w-full text-sm text-gray-500 hover:underline mt-6"
        >
          {t('auth.backToSignIn')}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
