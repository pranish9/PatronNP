import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, Check, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import PaymentMethodPicker from "../../components/PublicCreatorLayout/PaymentMethodPicker";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import { getCreatorMemberships } from "../../data/creatorMockData";

const CreatorMembership = () => {
  const navigate = useNavigate();
  const { username, creator, loading, notFound, loggedIn } = useCreatorPage();
  const tiers = getCreatorMemberships(username);

  const [selectedTier, setSelectedTier] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [step, setStep] = useState("list");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [paying, setPaying] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  const tier = tiers.find((t) => t.id === selectedTier);
  const monthlyPrice = tier?.monthlyPrice ?? 0;
  const annualPrice = Math.round(monthlyPrice * 10);
  const displayPrice = billingCycle === "monthly" ? monthlyPrice : annualPrice;

  const handleJoinClick = (tierId) => {
    if (!loggedIn) {
      toast.error("Please log in or sign up to join");
      navigate("/signin", { state: { from: `/${username}/membership` } });
      return;
    }
    setSelectedTier(tierId);
    setStep("checkout");
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(
        `Redirecting to ${paymentMethod === "ESEWA" ? "eSewa" : "Khalti"} for Rs ${displayPrice}...`
      );
      setStep("list");
      setSelectedTier(null);
    } catch {
      toast.error("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (step === "checkout" && tier) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
        <button
          onClick={() => setStep("list")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-center border-b border-slate-100">
            <img
              src={
                creator?.profilePictureUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(creator?.displayName || username)}&background=7c3aed&color=fff`
              }
              alt=""
              className="w-16 h-16 rounded-full mx-auto ring-4 ring-violet-100 object-cover"
            />
            <p className="text-xs text-slate-400 mt-3 uppercase tracking-wider">Membership</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">{tier.name}</h2>
            <p className="text-sm text-slate-500 mt-1">by {creator?.displayName || username}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <ul className="space-y-2">
              {tier.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex rounded-xl border border-slate-200 p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  billingCycle === "monthly"
                    ? "bg-violet-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Monthly · Rs {monthlyPrice}
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  billingCycle === "annual"
                    ? "bg-violet-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Annual · Rs {annualPrice}
                <span className="block text-[10px] font-normal opacity-80">Save 2 months</span>
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-slate-100">
              <span className="text-slate-600">Total due</span>
              <span className="text-2xl font-bold">
                Rs {displayPrice.toLocaleString()}
                <span className="text-sm font-normal text-slate-400">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                Pay with
              </p>
              <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
            </div>

            <Button size="full" onClick={handlePay} isLoading={paying} className="rounded-xl py-3">
              Join for Rs {displayPrice.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <div className="text-center mb-8 sm:mb-10">
        <Crown className="mx-auto text-violet-600 mb-3" size={36} />
        <h1 className="text-2xl sm:text-3xl font-bold">Become a member</h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Support {creator?.displayName || username} and unlock exclusive content
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {tiers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col hover:border-violet-300 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold">{t.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-bold">Rs {t.monthlyPrice}</span>
              <span className="text-slate-400 text-sm"> / month</span>
            </p>

            <ul className="mt-5 space-y-2 flex-1">
              {t.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 rounded-xl w-full"
              onClick={() => handleJoinClick(t.id)}
            >
              Join
            </Button>
          </div>
        ))}
      </div>

      {!loggedIn && (
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/signin" state={{ from: `/${username}/membership` }} className="text-violet-600 hover:underline">
            Log in
          </Link>
          {" · "}
          <Link to="/signup" className="text-violet-600 hover:underline">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
};

export default CreatorMembership;
