import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  Heart,
  Pencil,
  Save,
  X,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import PaymentMethodPicker from "../../components/PublicCreatorLayout/PaymentMethodPicker";
import { useCreatorPage } from "../../context/CreatorPageContext";
import userService from "../../services/userService";
import UserNotFound from "../CreatorPage/UserNotFound";

const DEFAULT_AMOUNTS = [50, 100, 200, 500, 1000];

const THEME_COLORS = [
  { id: "violet", value: "#7c3aed", label: "Violet" },
  { id: "rose", value: "#e11d48", label: "Rose" },
  { id: "amber", value: "#d97706", label: "Amber" },
  { id: "emerald", value: "#059669", label: "Emerald" },
  { id: "sky", value: "#0284c7", label: "Sky" },
];

const CreatorProfile = () => {
  const { username, creator, loading, notFound, isOwner, loggedIn } = useCreatorPage();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [donating, setDonating] = useState(false);

  const [editForm, setEditForm] = useState({
    displayName: "",
    bio: "",
    tagline: "",
    themeColor: "#7c3aed",
    welcomeMessage: "",
  });

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (creator) {
      const form = {
        displayName: creator.displayName || "",
        bio: creator.bio || "",
        tagline: creator.tagline || "",
        themeColor: creator.themeColor || "#7c3aed",
        welcomeMessage:
          creator.welcomeMessage || "Buy me a coffee and support my work! ☕",
      };
      setEditForm(form);
      setProfileData({ ...creator, ...form });
    }
  }, [creator]);

  const display = profileData || creator;

  const themeColor = isEditing
    ? editForm.themeColor
    : display?.themeColor || "#7c3aed";

  const finalAmount = customAmount
    ? parseInt(customAmount, 10)
    : selectedAmount;

  const handleDonate = async () => {
    if (!loggedIn) {
      toast.error("Please log in to support this creator");
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      toast.error("Minimum amount is Rs 10");
      return;
    }

    setDonating(true);
    try {
      // Payment redirect simulation — replace with real eSewa/Khalti integration
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(
        `Redirecting to ${paymentMethod === "ESEWA" ? "eSewa" : "Khalti"} for Rs ${finalAmount}...`
      );
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setDonating(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({
        displayName: editForm.displayName,
        bio: editForm.bio,
        tagline: editForm.tagline,
        themeColor: editForm.themeColor,
        welcomeMessage: editForm.welcomeMessage,
      });
      setProfileData((prev) => ({ ...prev, ...editForm }));
      toast.success("Page updated successfully!");
    } catch {
      setProfileData((prev) => ({ ...prev, ...editForm }));
      toast.success("Changes saved locally (preview mode)");
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading creator page...</p>
        </div>
      </div>
    );
  }

  if (notFound || !creator) {
    return <UserNotFound username={username} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Cover */}
      <div
        className="h-32 sm:h-48 lg:h-56 relative"
        style={{
          background: creator.coverImageUrl
            ? undefined
            : `linear-gradient(135deg, ${themeColor}cc, ${themeColor}55)`,
        }}
      >
        {creator.coverImageUrl && (
          <img
            src={creator.coverImageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 pb-12">
        {/* Profile card — Buy Me a Coffee style */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Avatar + info */}
          <div className="pt-6 sm:pt-8 pb-4 px-5 sm:px-8 text-center">
            <div className="relative inline-block">
              <img
                src={
                  creator.profilePictureUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    creator.displayName || username
                  )}&background=7c3aed&color=fff&size=128`
                }
                alt={creator.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-lg mx-auto"
              />
              {isOwner && (
                <span className="absolute -bottom-1 -right-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>

            <h1 className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">
              {isEditing ? editForm.displayName : display.displayName}
            </h1>
            <p className="text-slate-500 text-sm">@{creator.username}</p>

            {(isEditing ? editForm.tagline : display.tagline) && (
              <p className="mt-2 text-sm text-slate-600">
                {isEditing ? editForm.tagline : display.tagline}
              </p>
            )}

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {isEditing ? editForm.bio : display.bio}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
              <Users size={14} />
              {creator.supporterCount ?? 0} supporters
            </div>
          </div>

          {/* Owner: customize section */}
          {isOwner && (
            <div
              id="edit-section"
              className="border-t border-slate-100 px-5 sm:px-8 py-5 sm:py-6 bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-600" />
                  Customize your page
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      isLoading={saving}
                    >
                      <Save size={14} />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={editForm.displayName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, displayName: e.target.value })
                    }
                    placeholder="Display name"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  <input
                    value={editForm.tagline}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tagline: e.target.value })
                    }
                    placeholder="Tagline (e.g. Digital artist from Kathmandu)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    placeholder="Tell supporters about yourself..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                  />
                  <textarea
                    value={editForm.welcomeMessage}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        welcomeMessage: e.target.value,
                      })
                    }
                    placeholder="Welcome message for supporters"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                  />
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Theme color</p>
                    <div className="flex gap-2 flex-wrap">
                      {THEME_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() =>
                            setEditForm({ ...editForm, themeColor: c.value })
                          }
                          className={`w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all ${
                            editForm.themeColor === c.value
                              ? "ring-slate-800 scale-110"
                              : "ring-transparent"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 italic">
                    &ldquo;
                    {editForm.welcomeMessage ||
                      "Buy me a coffee and support my work! ☕"}
                    &rdquo;
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    This is how supporters see your page
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Supporter: donation section */}
          {!isOwner && (
            <div
              id="support-section"
              className="border-t border-slate-100 px-5 sm:px-8 py-5 sm:py-6"
            >
              <h2 className="font-semibold text-sm sm:text-base mb-1 flex items-center gap-2">
                <Coffee size={16} style={{ color: themeColor }} />
                Buy {creator.displayName?.split(" ")[0] || "them"} a coffee
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                Choose an amount and pay securely via eSewa or Khalti
              </p>

              {/* Amount presets */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                {DEFAULT_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedAmount === amt && !customAmount
                        ? "text-white shadow-md scale-[1.02]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    style={
                      selectedAmount === amt && !customAmount
                        ? { backgroundColor: themeColor }
                        : undefined
                    }
                  >
                    Rs {amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="10"
                placeholder="Custom amount (Rs)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice... (optional)"
                rows={2}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
              />

              {/* Payment methods */}
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                Pay with
              </p>
              <div className="mb-4">
                <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
              </div>

              {loggedIn ? (
                <Button
                  size="full"
                  onClick={handleDonate}
                  isLoading={donating}
                  className="rounded-xl py-3"
                  style={{ backgroundColor: themeColor }}
                >
                  <Heart size={18} />
                  Support Rs {finalAmount || "—"}
                </Button>
              ) : (
                <Link to="/signin" state={{ from: `/${username}` }}>
                  <Button size="full" className="rounded-xl py-3 w-full">
                    Log in to support
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer hint for owner */}
        {isOwner && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Share your page:{" "}
            <span className="font-mono text-slate-500">
              {window.location.origin}/{username}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
