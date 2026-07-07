import { useEffect, useState } from "react";
import { CheckCircle2, Wallet } from "lucide-react";
import toast from "react-hot-toast";

import paymentAccountService from "../../services/paymentAccountService";

const PROVIDERS = ["ESEWA", "BOTH", "KHALTI"];

const PayoutMethodTab = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [provider, setProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    paymentAccountService
      .getAccount()
      .then((res) => setAccount(res.data))
      .catch(() => toast.error("Failed to load payout method"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = () => {
    setProvider("");
    setPhoneNumber("");
    setOtp("");
    setStep("phone");
    setEditing(true);
  };

  const handleSendOtp = async () => {
    if (!provider) {
      toast.error("Select a payment provider");
      return;
    }
    if (phoneNumber.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setSubmitting(true);
    try {
      await paymentAccountService.sendOtp(phoneNumber, provider);
      toast.success("OTP sent");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setSubmitting(true);
    try {
      await paymentAccountService.verifyOtp(phoneNumber, otp);
      toast.success("Payout method updated");
      setEditing(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4 max-w-md">
      <h2 className="text-lg font-bold text-patron-black">Payout method</h2>
      <p className="text-xs text-patron-gray-500">
        The eSewa/Khalti account that receives your tips, membership, and shop payouts.
      </p>

      {!editing && account?.linked && (
        <div className="flex items-center gap-3 border border-patron-gray-200 rounded-xl p-4">
          <div className="w-10 h-10 rounded-full bg-patron-green-50 text-patron-green-600 flex items-center justify-center shrink-0">
            <Wallet size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-patron-black">{account.provider}</p>
            <p className="text-xs text-patron-gray-500">{account.maskedPhoneNumber}</p>
          </div>
          {account.verified && (
            <span className="flex items-center gap-1 text-xs font-medium text-patron-green-600 shrink-0">
              <CheckCircle2 size={14} /> Verified
            </span>
          )}
        </div>
      )}

      {!editing && !account?.linked && (
        <div className="text-sm text-patron-gray-500 py-4 text-center">No payout method linked yet.</div>
      )}

      {!editing && (
        <button
          onClick={startEdit}
          className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white"
        >
          {account?.linked ? "Change payout method" : "Link payout method"}
        </button>
      )}

      {editing && step === "phone" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {PROVIDERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setProvider(item)}
                className={`py-2.5 rounded-xl border-2 text-sm font-bold ${
                  provider === item
                    ? "bg-patron-green-600 text-white border-patron-green-600"
                    : "border-patron-gray-200 text-patron-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="98XXXXXXXX"
            className="w-full px-3 py-2.5 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-patron-gray-200 text-patron-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSendOtp}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>
      )}

      {editing && step === "otp" && (
        <div className="space-y-4">
          <p className="text-sm text-patron-gray-500">
            OTP sent to <b>{phoneNumber}</b>
          </p>
          <input
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full px-3 py-2.5 text-center text-xl tracking-widest bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setStep("phone")}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-patron-gray-200 text-patron-gray-600"
            >
              Back
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutMethodTab;
