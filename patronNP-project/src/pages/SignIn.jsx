import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleSignIn from "../components/auth/GoogleSignIn";

const OTP_TIME = 60; // seconds (you can change to 300 for 5 min)

const SignIn = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(OTP_TIME);
  const [canResend, setCanResend] = useState(false);

  // =========================
  // REDIRECT IF LOGGED IN
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token && user) navigate("/dashboard");
  }, [navigate]);

  // =========================
  // OTP TIMER
  // =========================
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

  // =========================
  // SEND OTP
  // =========================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Email is required");

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/auth/send-login-otp", {
        email,
      });

      setStep("otp");
      setTimer(OTP_TIME);
      setCanResend(false);
      setOtp("");

    } catch (err) {
      setError(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      return setError("Enter valid 6-digit OTP");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/auth/verify-login-otp",
        { email, otp }
      );

      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/dashboard");

    } catch (err) {
      setError("Invalid or expired OTP");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PROGRESS BAR %
  // =========================
  const progress = ((OTP_TIME - timer) / OTP_TIME) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* LOGO */}
        <div className="text-center mb-6">
          <img
            src="/android-chrome-192x192.png"
            className="w-16 mx-auto mb-2"
            alt="logo"
          />
          <h1 className="text-xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500">Login with OTP</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* EMAIL STEP */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              className="w-full bg-green-500 text-white p-3 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="space-y-4">

            {/* TIMER */}
            <div className="text-sm text-gray-600 text-center">
              OTP expires in <b>{timer}s</b>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-center text-sm text-gray-500">
              Sent to {email}
            </p>

            {/* OTP INPUT */}
            <input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full p-3 border rounded-lg text-center tracking-widest text-lg"
              placeholder="000000"
            />

            {/* VERIFY BUTTON */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-orange-500 text-white p-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Login"}
            </button>

            {/* RESEND */}
            <button
              disabled={!canResend}
              onClick={handleSendOtp}
              className={`w-full text-sm ${
                canResend ? "text-green-600" : "text-gray-400"
              }`}
            >
              {canResend ? "Resend OTP" : "Wait to resend"}
            </button>

            {/* BACK */}
            <button
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-500"
            >
              Change email
            </button>
          </div>
        )}

        {/* GOOGLE LOGIN */}
        <div className="mt-6 border-t pt-4">
          <GoogleSignIn />
        </div>

      </div>
    </div>
  );
};

export default SignIn;