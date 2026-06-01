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

  // 🔐 STRONG PASSWORD RULE
  const isStrongPassword = (pass) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    );
  };

  // GOOGLE SIGNUP
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));

      setFormData({ ...formData, authMethod: "google" });

      localStorage.setItem("accessToken", "mock_" + Date.now());
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          email: "user@gmail.com",
        })
      );

      toast.success("Welcome! Let's set up your profile");
      navigate("/onboarding");
    } catch {
      toast.error("Google sign-up failed");
    } finally {
      setIsLoading(false);
    }
  };

  // SEND OTP
  const handleSendOTP = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!email.includes("@")) return setError("Invalid email");

    if (!password) return setError("Password is required");
    if (!isStrongPassword(password)) {
      return setError(
        "Password must be 8+ chars with uppercase, lowercase, number & symbol"
      );
    }

    if (!confirmPassword) return setError("Confirm your password");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));

      setOtpSent(true);
      setFormData({ ...formData, authMethod: "email", email });

      toast.success("OTP sent to " + email);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async () => {
    setError("");

    if (!otp) return setError("OTP required");
    if (otp.length !== 6) return setError("OTP must be 6 digits");

    if (!isStrongPassword(password)) {
      return setError("Weak password detected");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      setFormData({
        ...formData,
        email,
        password,
      });

      localStorage.setItem("accessToken", "mock_" + Date.now());
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          email,
        })
      );

      toast.success("Welcome! Let's set up your profile");
      navigate("/onboarding");
    } catch {
      setError("OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex items-center mb-8">
        
        <button
          onClick={() => {
            if (otpSent) {
              setOtpSent(false);
              return;
            }

            if (authMethod) {
              setAuthMethod(null);
              return;
            }

            onPrev(); // go back to Phase 1
          }}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
          
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Choose how you'd like to verify
          </p>
        </div>
      </div>

      {/* AUTH CHOICE */}
      {!authMethod ? (
        <div className="space-y-4">

          {/* GOOGLE */}
         <button
  onClick={handleGoogleSignUp}
  disabled={isLoading}
  className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition flex items-center justify-center gap-3 disabled:opacity-50"
>
  {isLoading ? (
    <Loader className="animate-spin text-orange-500" size={20} />
  ) : (
    <>
      {/* Google Logo */}
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C17.5 2.9 15 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.6 12 20.6c6.1 0 10.2-4.3 10.2-10.4 0-.7-.1-1.2-.2-1.7H12z"/>
      </svg>

      <span className="text-gray-700 font-medium">
        Continue with Google
      </span>
    </>
  )}
</button>

          {/* EMAIL */}
          <button
            onClick={() => setAuthMethod("email")}
            className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg hover:border-green-500 transition"
          >
            <Mail className="inline mr-2 text-gray-600" size={20} />
            Email Sign Up
          </button>
        </div>
      ) : authMethod === "email" && !otpSent ? (
        <div className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Email"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM */}
          <div className="relative">
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSendOTP}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>

          <button
            onClick={() => setAuthMethod(null)}
            className="text-gray-600 w-full"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {/* OTP */}
          <input
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full text-center text-2xl tracking-widest border py-3 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Enter OTP"
          />

          {/* ERROR */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleVerifyOTP}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUpPhase2;