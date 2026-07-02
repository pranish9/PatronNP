import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";
import { scheduleAutoLogout } from "../../utils/authTimer";
import { useLanguage } from "../../hooks/useLanguage";
import { API_HOST } from "../../utils/apiHost";

const SignUpPhase2 = ({ onPrev, formData }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState("form");

  const [email, setEmail] = useState(formData.email || "");
  const username = formData.username || "";
  const authMethod = formData.authMethod || "email";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Timer State
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // GOOGLE SIGN-UP HANDLER
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.post(
          `${API_HOST}/auth/google-signup`,
          {
            username,
            token: tokenResponse.access_token,
          }
        );

        localStorage.setItem("accessToken", res.data.token);
        scheduleAutoLogout();
        toast.success(t('auth.googleSignupSuccess'));
        navigate("/onboarding");
      } catch (err) {
        const msg = err.response?.data?.message || t('auth.failedGoogleSignup');
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError(t('auth.failedGoogleAuth'));
      toast.error(t('auth.failedGoogleAuth'));
    },
    scope: "openid email profile",
  });

  // PASSWORD STRENGTH
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-orange-500";
    if (strength === 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const isStrongPassword = () => strength >= 4;

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && step === "otp") {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, step]);

  // SEND OTP
  const handleSendOtp = async () => {
    setError("");

    if (!email) return setError(t('auth.emailRequired'));
    if (!password) return setError(t('auth.passwordRequired'));
    if (!isStrongPassword()) {
      return setError(t('auth.passwordTooWeak'));
    }
    if (password !== confirmPassword) {
      return setError(t('auth.passwordMismatch'));
    }

    try {
      setLoading(true);

      await axios.post(`${API_HOST}/auth/send-otp`, {
        email,
      });

      toast.success(t('auth.otpSentSuccess'));

      // Navigate to OTP verification page with data
      navigate("/verify-otp", {
        state: {
          username,
          email,
          password,
        },
      });

    } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data;

        if (status === 409) {
          setError(t('auth.emailAlreadyRegistered'));
          toast.error(t('auth.emailAlreadyRegistered'));
        } else {
          setError(msg || t('payment.failedToSendOtp'));
          toast.error(msg || t('payment.failedToSendOtp'));
        }
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex items-center mb-8">
        <button 
          onClick={step === "otp" ? () => setStep("form") : onPrev} 
          className="mr-4 p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold">
          {step === "otp" ? t('auth.verifyYourEmail') : authMethod === "google" ? t('auth.completeGoogleSignup') : t('auth.emailPassword')}
        </h1>
      </div>

      {/* GOOGLE SIGN-UP */}
      {authMethod === "google" && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {t('auth.weWillUseGoogle')} <b>{username}</b>
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                {t('auth.connecting')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t('auth.continueWithGoogle')}
              </>
            )}
          </button>
        </div>
      )}

      {/* EMAIL SIGN-UP */}
      {authMethod === "email" && (
        <div className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            placeholder={t('auth.email')}
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.password')}
              className="w-full border p-3 rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* PASSWORD STRENGTH BAR */}
          {password && (
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className={`h-2 rounded ${getStrengthColor()}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('auth.confirmPassword')}
              className="w-full border p-3 rounded pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-green-500 text-white p-3 rounded"
          >
            {loading ? t('auth.sendingOtp') : t('payment.sendOtp')}
          </button>
        </div>
      )}

    </div>
  );
};

export default SignUpPhase2;