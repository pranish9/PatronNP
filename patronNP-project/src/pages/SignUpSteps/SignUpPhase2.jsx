import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const SignUpPhase2 = ({ onPrev, formData }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");

  const [email, setEmail] = useState(formData.email || "");
  const username = formData.username || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // SEND OTP
  const handleSendOtp = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!password) return setError("Password is required");
    if (!isStrongPassword()) {
      return setError("Password is too weak");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/auth/send-otp", {
        email,
      });

      toast.success("OTP sent successfully");
      setStep("otp");

    } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data;

        if (status === 409) {
          setError("This email is already registered");
          toast.error("This email is already registered");
        } else {
          setError(msg || "Failed to send OTP");
          toast.error(msg || "Failed to send OTP");
        }
      } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP + REGISTER
const handleVerifyOtp = async () => {
  setError("");

  if (otp.length !== 6) {
    return setError("Enter valid 6 digit OTP");
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:8080/auth/verify-otp-register",
      {
        username,
        email,
        password,
        otp,
      }
    );

    localStorage.setItem("token", res.data.token);

    toast.success("Account created successfully");
    navigate("/onboarding");

  } catch (err) {
    const msg =
      err.response?.data ||
      err.response?.data?.message ||
      "Something went wrong";

    // 👇 IMPORTANT: show backend message properly
    setError(msg);

    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex items-center mb-8">
        <button onClick={onPrev} className="mr-4 p-2">
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold">Email Verification</h1>
      </div>

      {/* FORM STEP */}
      {step === "form" && (
        <div className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
              placeholder="Confirm Password"
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
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-3 rounded text-center text-xl tracking-widest"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-green-500 text-white p-3 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

    </div>
  );
};

export default SignUpPhase2;