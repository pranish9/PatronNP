
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const OTP_TIME = 60;

const SignIn = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(OTP_TIME);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token) {
      navigate("/onboarding");
    }
  }, [navigate]);


  useEffect(() => {
    let interval;

    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, step]);

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(
        "http://localhost:8080/auth/google-login",
        {
          token: tokenResponse.access_token,
        }
      );

      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("onboardingCompleted", data.onboardingCompleted);
      
      toast.success("Logged in successfully with Google");
      if (data.onboardingCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
      
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Google login failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  },

  onError: () => {
    setError("Google authentication failed");
    toast.error("Google authentication failed");
  },
});

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      return setError("Please enter your email");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/auth/send-login-otp",
        {
          email,
        }
      );

      setStep("otp");
      setTimer(OTP_TIME);
      setCanResend(false);
      setOtp("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      return setError("Please enter a valid 6 digit OTP");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/auth/verify-login-otp",
        {
          email,
          otp,
        }
      );

      localStorage.setItem("accessToken", res.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
            role: res.data.role,
          })
        );

        localStorage.setItem("onboardingCompleted", res.data.onboardingCompleted);

        if (res.data.onboardingCompleted) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }

    } catch (err) {
      setOtp("");

      setError(
        err.response?.data?.message ||
        "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };
  
  const progress =
    ((OTP_TIME - timer) / OTP_TIME) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">

      {/* HEADER */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="/android-chrome-192x192.png"
            alt="PatronNP"
            className="w-12 h-12 rounded-xl shadow-md"
          />

          <div>
            <h1 className="font-bold text-xl text-gray-900">
              PatronNP
            </h1>

            <p className="text-xs text-gray-500">
              Support creators directly
            </p>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-gray-600">
            Not registered yet?
          </span>

          <button
            onClick={() => navigate("/signup")}
            className="ml-2 font-semibold text-green-600 hover:text-green-700"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex items-center justify-center px-4 py-8">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">

          {/* LOGO */}
          <div className="text-center mb-8">

            <img
              src="/android-chrome-192x192.png"
              alt="PatronNP"
              className="w-20 h-20 mx-auto rounded-2xl shadow-lg"
            />

            <h2 className="text-3xl font-bold mt-4 text-gray-900">
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to continue supporting creators
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === "email" && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition"
              >
                {loading
                  ? "Sending OTP..."
                  : "Continue with Email"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <div className="space-y-5">

              <div className="text-center text-sm text-gray-600">
                OTP sent to
                <br />
                <span className="font-semibold">
                  {email}
                </span>
              </div>

              <div className="text-center">
                <span className="text-orange-600 font-semibold">
                  {timer}s remaining
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                placeholder="000000"
                className="w-full p-4 text-center text-2xl tracking-[10px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition"
              >
                {loading
                  ? "Verifying..."
                  : "Login"}
              </button>

              <button
                disabled={!canResend}
                onClick={handleSendOtp}
                className={`w-full text-sm ${
                  canResend
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {canResend
                  ? "Resend OTP"
                  : `Resend available in ${timer}s`}
              </button>

              <button
                onClick={() => setStep("email")}
                className="w-full text-gray-500 text-sm hover:underline"
              >
                Change Email
              </button>
            </div>
          )}

          {/* DIVIDER */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-200"></div>

            <span className="px-4 text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full border border-gray-200 bg-white hover:bg-gray-50 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Connecting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.2 6.9l6.2 5.2C39.1 36.7 44 31 44 24c0-1.3-.1-2.4-.4-3.5z"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
