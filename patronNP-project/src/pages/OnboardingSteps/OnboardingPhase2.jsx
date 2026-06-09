
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SupportForm = () => {
  const navigate = useNavigate();

  const [provider, setProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:8080/api/payment";

  useEffect(() => {
    const verified = localStorage.getItem("paymentVerified");

    if (verified === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handlePhoneSubmit = async () => {
    if (!provider) {
      setError("Please select a payment provider.");
      return;
    }

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          provider,
        }),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Failed to send OTP");
      }

      alert(message);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          otp,
        }),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "OTP verification failed");
      }

      localStorage.setItem("paymentVerified", "true");

      alert("Verification Successful");

      navigate("/${data.username}", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-8">

        <div className="flex flex-col items-center mb-8">
          <img
            src="/android-chrome-192x192.png"
            alt="PatronNP"
            className="w-16 h-16 rounded-2xl shadow-md mb-4"
          />

          <h2 className="text-2xl font-bold text-gray-800">
            Payment Verification
          </h2>

          <p className="text-gray-500 text-sm">
            {step === "phone"
              ? "Link your payment account"
              : "Verify OTP"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <div className="space-y-6">

            <div className="grid grid-cols-3 gap-2">
              {["ESEWA", "BOTH", "KHALTI"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setProvider(item)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${
                    provider === item
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {provider && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="98XXXXXXXX"
                    className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <button
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            )}

          </div>
        ) : (
          <div className="space-y-4">

            <p className="text-center text-sm text-gray-600">
              Enter the OTP sent to <b>{phoneNumber}</b>
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              className="w-full p-4 text-center text-2xl tracking-widest rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              onClick={handleOtpVerify}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Change Number
            </button>

          </div>
        )}

        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-400">
          Secure Payment Portal
        </p>

      </div>
    </div>
  );
};

export default SupportForm;

