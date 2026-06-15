import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Play,
  FileText,
  Headphones,
  Image as ImageIcon,
  ExternalLink,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import PaymentMethodPicker from "../../components/PublicCreatorLayout/PaymentMethodPicker";
import SupportButton from "../../components/creatorLayout/RightSidebar";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "../CreatorPage/UserNotFound";
import {
  getCreatorPosts,
  getPublicSupporters,
} from "../../data/creatorMockData";

const CreatorProfile = () => {
  const {
    username,
    displayCreator,
    loading,
    notFound,
    isOwner,
    loggedIn,
    setSupportModalOpen,
    setEditModalOpen,
  } = useCreatorPage();

  const [showVideo, setShowVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [donating, setDonating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !displayCreator) {
    return <UserNotFound username={username} />;
  }

  const c = displayCreator;
  const unitPrice = c.supportUnitPrice || c.defaultSupportAmount || 100;
  const unitLabel = c.supportUnitLabel || "tea";
  const totalAmount = customAmount
    ? parseInt(customAmount, 10)
    : unitPrice * quantity;

  const supporters = getPublicSupporters(username);
  const recentPosts = getCreatorPosts(username).slice(0, 3);

  const videoUrl = c.featuredVideoUrl || c.introVideoUrl;
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleDonate = async () => {
    if (!loggedIn) {
      toast.error("Please log in to support");
      return;
    }
    if (!totalAmount || totalAmount < 10) {
      toast.error("Minimum amount is NPR 10");
      return;
    }
    setDonating(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(
        `Redirecting to ${paymentMethod === "ESEWA" ? "eSewa" : "Khalti"}...`
      );
    } catch {
      toast.error("Payment failed");
    } finally {
      setDonating(false);
    }
  };

  const socials = [
    { key: "instagram", label: "Instagram", url: c.instagram },
    { key: "twitter", label: "Twitter", url: c.twitter },
    { key: "facebook", label: "Facebook", url: c.facebook },
    { key: "youtube", label: "YouTube", url: c.youtube },
  ].filter((s) => s.url);

  return (
    <div className="w-full overflow-x-hidden pb-24 sm:pb-12">
      {/* Hero */}
      <section className="relative">
        <div className="h-36 sm:h-48 md:h-56 lg:h-64 w-full relative overflow-hidden">
          {c.coverImageUrl ? (
            <img
              src={c.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-patron-green-700 via-patron-green-600 to-patron-orange-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-patron-black/40 to-transparent" />
          {isOwner && (
            <button
              onClick={() => setEditModalOpen(true)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-3 py-1.5 bg-patron-white/90 text-patron-black text-xs sm:text-sm font-medium rounded-full hover:bg-patron-white shadow"
            >
              <Pencil size={14} />
              Change cover
            </button>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 sm:-mt-16 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <img
              src={
                c.profilePictureUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  c.displayName || username
                )}&background=16a34a&color=fff&size=128`
              }
              alt={c.displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-patron-white shadow-xl shrink-0"
            />
            <div className="text-center sm:text-left flex-1 min-w-0 pb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-patron-black truncate">
                {c.displayName}
              </h1>
              <p className="text-patron-gray-500 text-sm mt-0.5">@{c.username || username}</p>
              {(c.tagline || c.creatingWhat) && (
                <p className="text-patron-gray-600 text-sm sm:text-base mt-2 max-w-xl">
                  {c.tagline || c.creatingWhat}
                </p>
              )}
              <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-patron-gray-500 mt-2">
                <Users size={14} className="text-patron-green-600" />
                {c.supporterCount ?? 0} supporters
              </p>
            </div>
            {!isOwner && (
              <div className="pb-2 shrink-0">
                <SupportButton showLabel size="md" />
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="mt-6">
              {!showVideo ? (
                <button
                  onClick={() => setShowVideo(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-patron-black text-patron-white rounded-xl text-sm font-medium hover:bg-patron-gray-800 transition-colors"
                >
                  <Play size={16} />
                  Watch intro video
                </button>
              ) : (
                <div className="aspect-video rounded-2xl overflow-hidden border border-patron-gray-200 shadow-lg bg-patron-black">
                  <iframe
                    src={getYoutubeEmbed(videoUrl)}
                    title="Intro video"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* About */}
          <section className="bg-patron-white rounded-2xl border border-patron-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-patron-black mb-4">About</h2>
            <h3 className="font-semibold text-patron-green-800">{c.displayName}</h3>
            {c.bio && (
              <p className="text-patron-gray-600 text-sm sm:text-base mt-3 leading-relaxed whitespace-pre-wrap">
                {c.bio}
              </p>
            )}
            {(c.pageDescription || c.welcomeMessage) && (
              <div className="mt-4 p-4 bg-patron-green-50 rounded-xl border border-patron-green-100">
                <p className="text-xs font-bold uppercase tracking-wider text-patron-green-700 mb-1">
                  What this page does
                </p>
                <p className="text-sm text-patron-gray-700">
                  {c.pageDescription || c.welcomeMessage}
                </p>
              </div>
            )}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-patron-gray-100 text-patron-gray-700 rounded-full hover:bg-patron-green-100 hover:text-patron-green-800"
                  >
                    {s.label}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* Recent supporters */}
          <section className="bg-patron-white rounded-2xl border border-patron-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-patron-black mb-4 flex items-center gap-2">
              <Heart className="text-patron-orange-500" size={20} />
              Recent supporters
            </h2>
            {supporters.length === 0 ? (
              <p className="text-patron-gray-500 text-sm text-center py-6">
                Be the first one to support{" "}
                <span className="font-semibold text-patron-black">{c.displayName}</span>
              </p>
            ) : (
              <div className="space-y-3">
                {supporters.map((s) => (
                  <div
                    key={s.id}
                    className="flex gap-3 p-3 rounded-xl bg-patron-gray-50 border border-patron-gray-100"
                  >
                    <div className="w-9 h-9 rounded-full bg-patron-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-patron-black">
                          {s.name}
                        </span>
                        <span className="text-xs font-bold text-patron-orange-600">
                          NPR {s.amount}
                        </span>
                      </div>
                      <p className="text-sm text-patron-gray-600 line-clamp-2 mt-0.5">
                        {s.message}
                      </p>
                      <p className="text-[10px] text-patron-gray-400 mt-1">
                        {new Date(s.timestamp).toLocaleDateString("en-NP", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent posts */}
          <section className="bg-patron-white rounded-2xl border border-patron-gray-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-patron-black">Recent posts</h2>
              <Link
                to={`/${username}/posts`}
                className="text-sm text-patron-green-700 hover:underline font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/${username}/posts/${post.id}`}
                  className="flex gap-3 p-3 rounded-xl hover:bg-patron-green-50 border border-transparent hover:border-patron-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-patron-green-100 text-patron-green-700 flex items-center justify-center shrink-0">
                    {post.type === "audio" ? (
                      <Headphones size={18} />
                    ) : post.type === "photo" ? (
                      <ImageIcon size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-patron-black group-hover:text-patron-green-800 truncate">
                      {post.title}
                    </h3>
                    <p className="text-xs text-patron-gray-500 mt-0.5">
                      {new Date(post.date).toLocaleDateString("en-NP", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Support widget sidebar */}
        {!isOwner && (
          <aside className="lg:col-span-1">
            <div
              id="support-section"
              className="bg-patron-white rounded-2xl border border-patron-gray-200 p-5 sm:p-6 shadow-sm sticky top-20"
            >
              <h2 className="font-bold text-patron-black mb-1">
                Buy a {unitLabel}
              </h2>
              <p className="text-sm text-patron-gray-500 mb-4">
                NPR {unitPrice} each · Support {c.displayName?.split(" ")[0]}
              </p>

              <div className="flex gap-2 mb-3">
                {[1, 3, 5].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuantity(q);
                      setCustomAmount("");
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                      quantity === q && !customAmount
                        ? "bg-patron-green-600 text-white"
                        : "bg-patron-gray-100 text-patron-gray-700 hover:bg-patron-green-100"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="10"
                placeholder="Custom NPR"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />

              <PaymentMethodPicker
                value={paymentMethod}
                onChange={setPaymentMethod}
              />

              <div className="mt-4 space-y-2">
                {loggedIn ? (
                  <Button
                    variant="accent"
                    size="full"
                    onClick={handleDonate}
                    isLoading={donating}
                    className="rounded-xl py-3"
                  >
                    Support NPR {totalAmount?.toLocaleString() || "—"}
                  </Button>
                ) : (
                  <Link to="/signin" state={{ from: `/${username}` }}>
                    <Button size="full" className="rounded-xl w-full">
                      Log in to support
                    </Button>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setSupportModalOpen(true)}
                  className="w-full text-center text-xs text-patron-green-700 hover:underline py-1"
                >
                  Full support form (photo, video, private)
                </button>
              </div>
            </div>
          </aside>
        )}

        {isOwner && (
          <aside className="lg:col-span-1">
            <div className="bg-patron-green-50 rounded-2xl border border-patron-green-200 p-5 sm:p-6 sticky top-20">
              <p className="text-sm text-patron-green-800 font-medium">
                This is your public page preview
              </p>
              <p className="text-xs text-patron-gray-600 mt-2">
                Share:{" "}
                <span className="font-mono break-all">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/${username}`
                    : `/${username}`}
                </span>
              </p>
              <Button
                className="mt-4 w-full rounded-xl"
                onClick={() => setEditModalOpen(true)}
              >
                <Pencil size={14} />
                Edit page
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
