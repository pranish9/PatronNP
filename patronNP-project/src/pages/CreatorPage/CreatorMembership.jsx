import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Crown, Check, ArrowLeft, ShieldCheck, Flag } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import PaymentMethodPicker from "../../components/PublicCreatorLayout/PaymentMethodPicker";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import membershipService from "../../services/membershipService";
import { initiateEsewaMembership, redirectToEsewa } from "../../services/esewaService";
import { initiateKhaltiMembership, redirectToKhalti } from "../../services/khaltiService";
import { reportContent } from "../../services/reportService";

const CreatorMembership = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { username, creator, loading, notFound, loggedIn } = useCreatorPage();

  const [tiers, setTiers] = useState([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [mySubscription, setMySubscription] = useState(null);

  const [selectedTier, setSelectedTier] = useState(null);
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [step, setStep] = useState("list");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [requestRefund, setRequestRefund] = useState(false);
  const [refundPhone, setRefundPhone] = useState("");
  const [refundMethod, setRefundMethod] = useState("ESEWA");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const loadLevelsAndSubscription = async () => {
    if (!username) return;
    setLoadingTiers(true);
    try {
      const levelsRes = await membershipService.getPublicLevels(username);
      setTiers(levelsRes.data || []);
    } catch {
      toast.error("Failed to load membership levels");
    } finally {
      setLoadingTiers(false);
    }

    if (loggedIn) {
      try {
        const mineRes = await membershipService.getMyMembership(username);
        setMySubscription(mineRes.data || null);
      } catch {
        setMySubscription(null);
      }
    }
  };

  useEffect(() => {
    loadLevelsAndSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, loggedIn]);

  // Handle the redirect back from eSewa/Khalti after a membership payment.
  useEffect(() => {
    const outcome = searchParams.get("membership");
    if (!outcome) return;
    if (outcome === "success") {
      toast.success("Welcome! Your membership is now active.");
      loadLevelsAndSubscription();
    } else {
      toast.error("Payment didn't go through. Please try again.");
    }
    searchParams.delete("membership");
    searchParams.delete("txn");
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  const tier = tiers.find((t) => t.id === selectedTier);
  const displayPrice = tier ? (billingCycle === "MONTHLY" ? tier.monthlyPrice : tier.yearlyPrice) : 0;

  const handleJoinClick = (tierId) => {
    if (!loggedIn) {
      toast.error("Please log in or sign up to join");
      navigate("/signin", { state: { from: `/${username}/membership` } });
      return;
    }
    const t = tiers.find((x) => x.id === tierId);
    setBillingCycle(t?.yearlyPrice ? "MONTHLY" : "MONTHLY");
    setSelectedTier(tierId);
    setStep("checkout");
  };

  const handleReportLevel = async (tierId) => {
    if (!loggedIn) {
      navigate("/signin", { state: { from: `/${username}/membership` } });
      return;
    }
    const reason = window.prompt("Why are you reporting this membership level?");
    if (reason === null) return;
    try {
      await reportContent("MEMBERSHIP_LEVEL", tierId, reason.trim());
      toast.success("Thanks — this has been reported to our team.");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to submit report");
    }
  };

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlePhoneChange = (e) => {
    setBuyerPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handlePay = async () => {
    if (!tier) return;
    if (!buyerEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!EMAIL_PATTERN.test(buyerEmail.trim())) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!buyerPhone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (buyerPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setPaying(true);
    try {
      if (paymentMethod === "ESEWA") {
        const data = await initiateEsewaMembership({
          creatorUsername: username,
          levelId: tier.id,
          billingCycle,
          buyerEmail,
          buyerPhone,
        });
        redirectToEsewa(data);
      } else {
        const data = await initiateKhaltiMembership({
          creatorUsername: username,
          levelId: tier.id,
          billingCycle,
          buyerEmail,
          buyerPhone,
        });
        redirectToKhalti(data.paymentUrl);
      }
    } catch (err) {
      if (!err.response) {
        toast.error("Network error — check your connection and try again");
      } else if (err.response.status === 401) {
        toast.error("Please log in again to continue");
      } else {
        toast.error(err.response?.data?.message || "Failed to start payment");
      }
      setPaying(false);
    }
  };

  // Mirrors the backend calculation in MembershipService: a flat 25% cancellation fee comes
  // off the top, then the rest is prorated by the days left in the current billing period.
  // This is a preview only — the server recomputes it authoritatively when cancelling.
  const CANCELLATION_FEE_RATE = 0.25;
  const cycleDays = (cycle) => (cycle === "YEARLY" ? 365 : 30);

  const refundPreview = (() => {
    if (!mySubscription?.currentPeriodEnd) return null;
    const totalDays = cycleDays(mySubscription.billingCycle);
    const periodEnd = new Date(mySubscription.currentPeriodEnd);
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - totalDays);
    const daysElapsed = Math.floor((Date.now() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, Math.min(totalDays, totalDays - daysElapsed));
    const amountAfterFee = mySubscription.amount * (1 - CANCELLATION_FEE_RATE);
    const refundAmount = Math.round(amountAfterFee * (daysRemaining / totalDays) * 100) / 100;
    const refundPercent = Math.round(((1 - CANCELLATION_FEE_RATE) * (daysRemaining / totalDays)) * 100);
    return { totalDays, daysRemaining, refundAmount, refundPercent };
  })();

  const handleCancel = async () => {
    if (!mySubscription) return;
    if (requestRefund) {
      if (refundPhone.length !== 10) {
        toast.error("Enter a valid 10-digit phone number for the refund");
        return;
      }
    }

    setCancelling(true);
    try {
      await membershipService.cancelSubscription(mySubscription.subscriptionId, {
        reason: cancelReason,
        requestRefund,
        refundPhone: requestRefund ? refundPhone : null,
        refundMethod: requestRefund ? refundMethod : null,
      });
      toast.success(
        requestRefund && refundPreview
          ? `Membership cancelled — refund of Rs ${refundPreview.refundAmount} requested via ${refundMethod === "KHALTI" ? "Khalti" : "eSewa"}`
          : "Membership cancelled"
      );
      setMySubscription(null);
      setShowCancelForm(false);
      loadLevelsAndSubscription();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel membership");
    } finally {
      setCancelling(false);
    }
  };

  if (step === "checkout" && tier) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
        <button
          onClick={() => setStep("list")}
          className="flex items-center gap-1.5 text-sm text-patron-gray-500 hover:text-patron-green-700 mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-patron-white rounded-2xl sm:rounded-3xl border border-patron-gray-200/80 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-center border-b border-patron-gray-100">
            <img
              src={
                creator?.profilePictureUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(creator?.displayName || username)}&background=16a34a&color=fff`
              }
              alt=""
              className="w-16 h-16 rounded-full mx-auto ring-4 ring-patron-green-100 object-cover"
            />
            <p className="text-xs text-patron-gray-400 mt-3 uppercase tracking-wider">Membership</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">{tier.name}</h2>
            <p className="text-sm text-patron-gray-500 mt-1">by {creator?.displayName || username}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <ul className="space-y-2">
              {(tier.rewards || []).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-patron-gray-600">
                  <Check size={16} className="text-patron-green-600 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex rounded-xl border border-patron-gray-200 p-1">
              <button
                onClick={() => setBillingCycle("MONTHLY")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  billingCycle === "MONTHLY"
                    ? "bg-patron-green-600 text-white"
                    : "text-patron-gray-600 hover:bg-patron-gray-50"
                }`}
              >
                Monthly · Rs {tier.monthlyPrice}
              </button>
              <button
                onClick={() => tier.yearlyPrice && setBillingCycle("YEARLY")}
                disabled={!tier.yearlyPrice}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  billingCycle === "YEARLY"
                    ? "bg-patron-green-600 text-white"
                    : "text-patron-gray-600 hover:bg-patron-gray-50"
                }`}
              >
                {tier.yearlyPrice ? `Yearly · Rs ${tier.yearlyPrice}` : "Yearly unavailable"}
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-patron-gray-100">
              <span className="text-patron-gray-600">Total due</span>
              <span className="text-2xl font-bold">
                Rs {displayPrice?.toLocaleString()}
                <span className="text-sm font-normal text-patron-gray-400">
                  /{billingCycle === "MONTHLY" ? "mo" : "yr"}
                </span>
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-patron-gray-500 uppercase tracking-wider">
                Contact info
              </p>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Email address *"
                required
                className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
              <input
                type="tel"
                inputMode="numeric"
                value={buyerPhone}
                onChange={handlePhoneChange}
                placeholder="Phone number (10 digits) *"
                maxLength={10}
                required
                className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-patron-gray-500 mb-2 uppercase tracking-wider">
                Pay with
              </p>
              <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
            </div>

            <Button size="full" onClick={handlePay} isLoading={paying} className="rounded-xl py-3">
              Join for Rs {displayPrice?.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <div className="text-center mb-8 sm:mb-10">
        <Crown className="mx-auto text-patron-green-700 mb-3" size={36} />
        <h1 className="text-2xl sm:text-3xl font-bold">Become a member</h1>
        <p className="text-patron-gray-500 text-sm sm:text-base mt-2">
          Support {creator?.displayName || username} and unlock exclusive content
        </p>
      </div>

      {mySubscription ? (
        <div className="bg-patron-white rounded-2xl border border-patron-green-200 shadow-sm p-6 sm:p-8 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-patron-green-700">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold uppercase tracking-wide">You're a member</span>
          </div>
          <h3 className="text-lg font-bold mt-2">{mySubscription.levelName}</h3>
          <p className="text-sm text-patron-gray-500 mt-1">
            Rs {mySubscription.amount?.toLocaleString()} / {mySubscription.billingCycle === "YEARLY" ? "year" : "month"}
          </p>
          {mySubscription.currentPeriodEnd && (
            <p className="text-xs text-patron-gray-400 mt-1">
              Access until {new Date(mySubscription.currentPeriodEnd).toLocaleDateString("en-NP", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}

          {!showCancelForm ? (
            <button
              onClick={() => setShowCancelForm(true)}
              className="mt-5 text-sm font-semibold text-red-600 hover:underline"
            >
              Cancel membership
            </button>
          ) : (
            <div className="mt-5 space-y-3 border-t border-patron-gray-100 pt-4">
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're leaving (optional)"
                className="w-full px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
              <label className="flex items-center gap-2 text-sm text-patron-gray-600">
                <input type="checkbox" checked={requestRefund} onChange={(e) => setRequestRefund(e.target.checked)} />
                Request a refund
              </label>

              {requestRefund && (
                <div className="space-y-3 bg-patron-gray-50 border border-patron-gray-100 rounded-xl p-3">
                  {refundPreview && (
                    <p className="text-xs text-patron-gray-600">
                      {refundPreview.daysRemaining} of {refundPreview.totalDays} days left in this period. A 25%
                      cancellation fee applies to the rest — estimated refund:{" "}
                      <span className="font-bold text-patron-black">
                        Rs {refundPreview.refundAmount} ({refundPreview.refundPercent}%)
                      </span>
                    </p>
                  )}
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={refundPhone}
                    onChange={(e) => setRefundPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Phone number for refund (10 digits) *"
                    maxLength={10}
                    className="w-full px-3 py-2 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                  />
                  <div>
                    <p className="text-xs font-medium text-patron-gray-500 mb-1.5 uppercase tracking-wider">
                      Refund via
                    </p>
                    <PaymentMethodPicker value={refundMethod} onChange={setRefundMethod} />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="flex-1 px-3 py-2 text-sm font-medium rounded-xl border border-patron-gray-200 hover:bg-patron-gray-50"
                >
                  Keep membership
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 px-3 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : loadingTiers ? (
        <div className="text-center text-patron-gray-400 text-sm py-10">Loading membership levels...</div>
      ) : tiers.length === 0 ? (
        <div className="text-center text-patron-gray-400 text-sm py-10">
          {creator?.displayName || username} hasn't published any membership levels yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.id}
              className="group relative bg-patron-white rounded-2xl border border-patron-gray-200/80 shadow-sm p-6 flex flex-col hover:border-patron-green-300 hover:shadow-md transition-all"
            >
              <button
                onClick={() => handleReportLevel(t.id)}
                title="Report this membership level"
                className="absolute top-3 right-3 p-1.5 rounded-lg text-patron-gray-300 opacity-0 group-hover:opacity-100 hover:text-patron-gray-500 transition-opacity"
              >
                <Flag size={13} />
              </button>
              {t.coverImageUrl && (
                <img src={t.coverImageUrl} alt="" className="w-full h-28 object-cover rounded-xl mb-3" />
              )}
              <h3 className="text-lg font-bold">{t.name}</h3>
              {t.description && <p className="text-sm text-patron-gray-500 mt-1">{t.description}</p>}
              <p className="mt-2">
                <span className="text-3xl font-bold">Rs {t.monthlyPrice}</span>
                <span className="text-patron-gray-400 text-sm"> / month</span>
              </p>

              <ul className="mt-5 space-y-2 flex-1">
                {(t.rewards || []).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-patron-gray-600">
                    <Check size={15} className="text-patron-green-600 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 rounded-xl w-full"
                onClick={() => handleJoinClick(t.id)}
                disabled={t.full}
              >
                {t.full ? "Full" : "Join"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {!loggedIn && (
        <p className="text-center text-sm text-patron-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/signin" state={{ from: `/${username}/membership` }} className="text-patron-green-700 hover:underline">
            Log in
          </Link>
          {" · "}
          <Link to="/signup" className="text-patron-green-700 hover:underline">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
};

export default CreatorMembership;
