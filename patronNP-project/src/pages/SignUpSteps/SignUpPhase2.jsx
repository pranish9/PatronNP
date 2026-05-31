import React, { useState } from "react";
import { Mail, Eye, EyeOff, ArrowLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPhase2 = ({ onPrev, formData, setFormData }) => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState(formData.authMethod || null);
  const [email, setEmail] = useState(formData.email || "");
  const [password, setPassword] = useState(formData.password || "");
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      // Mock Google OAuth - replace with actual implementation
      await new Promise(r => setTimeout(r, 1500));
      
      setFormData({
        ...formData,
        authMethod: "google",
      });

      // Save to localStorage and redirect to onboarding
      localStorage.setItem("accessToken", "mock_jwt_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify({
        username: formData.username,
        email: "user@gmail.com",
      }));

      toast.success("Welcome! Let's set up your profile");
      navigate("/onboarding");
    } catch (err) {
      toast.error("Google sign-up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      // Mock OTP send
      await new Promise(r => setTimeout(r, 1000));
      setOtpSent(true);
      toast.success("OTP sent to " + email);
      setFormData({ ...formData, authMethod: "email", email });
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    // Validate password if email method
    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Mock OTP verification
      await new Promise(r => setTimeout(r, 1500));

      setFormData({
        ...formData,
        email,
        password,
        confirmPassword,
      });

      // Save to localStorage and redirect to onboarding
      localStorage.setItem("accessToken", "mock_jwt_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify({
        username: formData.username,
        email,
      }));

      toast.success("Welcome! Let's set up your profile");
      navigate("/onboarding");
    } catch (err) {
      setError("OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onPrev}
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Choose how you'd like to verify
          </p>
        </div>
      </div>

      {!authMethod ? (
        <div className="space-y-4">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {isLoading ? "Signing up..." : "Continue with Google"}
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Email Option */}
          <button
            onClick={() => setAuthMethod("email")}
            className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition flex items-center justify-center gap-3"
          >
            <Mail size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Sign up with Email
            </span>
          </button>
        </div>
      ) : authMethod === "email" && !otpSent ? (
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={isLoading || !email || !password || !confirmPassword}
            className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>

          <button
            onClick={() => setAuthMethod(null)}
            className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
          >
            Back
          </button>
        </div>
      ) : authMethod === "email" && otpSent ? (
        <div className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter 6-digit OTP sent to {email}
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Didn't receive it? <button className="text-emerald-600 dark:text-emerald-400 hover:underline">Resend OTP</button>
          </p>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          <button
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setError("");
            }}
            className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
          >
            Change Email
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SignUpPhase2;
