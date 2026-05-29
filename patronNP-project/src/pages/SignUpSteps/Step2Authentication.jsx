import React, { useState } from "react";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

import GoogleSignIn from "../../components/auth/GoogleSignIn";

const Step2Authentication = ({
  onNext,
  onPrev,
  formData,
  setFormData,
}) => {
  const [email, setEmail] = useState(
    formData.email || ""
  );

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] =
    useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate email
  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  };

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    // Generate 6 digit OTP
    const otpCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save OTP
    setGeneratedOtp(otpCode);

    // Print OTP in console
    console.log("Generated OTP:", otpCode);

    // Fake API delay
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);

      setSuccess(
        "OTP has been sent to your email"
      );
    }, 1500);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setVerifying(true);

    setTimeout(() => {
      if (otp === generatedOtp) {
        setVerified(true);

        setFormData({
          ...formData,
          authMethod: "email",
          email,
          verified: true,
        });

        setSuccess(
          "Email verified successfully!"
        );

        setTimeout(() => {
          onNext();
        }, 1000);
      } else {
        setError("Invalid OTP");
      }

      setVerifying(false);
    }, 1200);
  };

  // Google Success
  const handleGoogleSuccess = (
    credentialResponse
  ) => {
    setFormData({
      ...formData,
      authMethod: "google",
      email: credentialResponse.email || "",
      googleData: credentialResponse,
      verified: true,
    });

    onNext();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h1>

        <p className="text-gray-600">
          Continue using email OTP or Google
        </p>
      </div>

      <form
        onSubmit={handleSendOtp}
        className="space-y-5"
      >
        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle
              size={16}
              className="text-red-600 mt-0.5 flex-shrink-0"
            />

            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
            <CheckCircle
              size={16}
              className="text-emerald-600 mt-0.5 flex-shrink-0"
            />

            <p className="text-sm text-emerald-700">
              {success}
            </p>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              disabled={otpSent}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100"
            />
          </div>

          {email &&
            validateEmail(email) && (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle size={14} />
                Valid email format
              </p>
            )}
        </div>

        {/* Send OTP Button */}
        {!otpSent && (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader
                  size={18}
                  className="animate-spin"
                />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        )}

        {/* OTP Section */}
        {otpSent && !verified && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-[0.4em] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifying}
              className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <Loader
                    size={18}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setGeneratedOtp("");
                setSuccess("");
                setError("");
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Change Email
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <GoogleSignIn
          onSuccess={handleGoogleSuccess}
        />
      </form>

      {/* Security Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">
            🔒 Secure Authentication
          </span>

          <br />

          Email OTP and Google login are used
          for secure account verification.
        </p>
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={onPrev}
        className="w-full mt-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
      >
        Back
      </button>
    </div>
  );
};

export default Step2Authentication;