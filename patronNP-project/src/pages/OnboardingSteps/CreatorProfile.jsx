import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Play,
  FileText,
  Headphones,
  Image as ImageIcon,
  ExternalLink,
  Pencil,
  Coffee,
  X,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import PaymentMethodPicker from "../../components/PublicCreatorLayout/PaymentMethodPicker";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "../CreatorPage/UserNotFound";
import postService from "../../services/postService";
import { initiateEsewaTip, redirectToEsewa } from "../../services/esewaService";
import { initiateKhaltiTip, redirectToKhalti } from "../../services/khaltiService";
import { getRecentSupporters } from "../../services/supporterService";

// Album posts carry images[]; a rich-text post only has inline <img> tags in its
// HTML content, so pull the first one out to use as a thumbnail (mirrors CreatorPosts.jsx).
const firstContentImage = (html) => html?.match(/<img[^>]+src="([^"]+)"/)?.[1] || null;

const CreatorProfile = () => {
  const {
    username,
    displayCreator,
    loading,
    notFound,
    isOwner,
    setSupportModalOpen,
    setEditModalOpen,
  } = useCreatorPage();

  const [showVideo, setShowVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [donating, setDonating] = useState(false);
  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [supporters, setSupporters] = useState([]);
  const [supportersPage, setSupportersPage] = useState(0);
  const [hasMoreSupporters, setHasMoreSupporters] = useState(false);
  const [loadingMoreSupporters, setLoadingMoreSupporters] = useState(false);
  const SUPPORTERS_PAGE_SIZE = 4;
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    if (!username) return;
    getRecentSupporters(username, 0, SUPPORTERS_PAGE_SIZE)
      .then((data) => {
        setSupporters(data.content || []);
        setSupportersPage(0);
        setHasMoreSupporters(!data.last);
      })
      .catch(() => setSupporters([]));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    postService
      .getPublicPosts(username, "all")
      .then(({ data }) => setRecentPosts((data || []).slice(0, 3)))
      .catch(() => setRecentPosts([]));
  }, [username]);

  const handleLoadMoreSupporters = async () => {
    const nextPage = supportersPage + 1;
    setLoadingMoreSupporters(true);
    try {
      const data = await getRecentSupporters(username, nextPage, SUPPORTERS_PAGE_SIZE);
      setSupporters((prev) => [...prev, ...(data.content || [])]);
      setSupportersPage(nextPage);
      setHasMoreSupporters(!data.last);
    } catch {
      setHasMoreSupporters(false);
    } finally {
      setLoadingMoreSupporters(false);
    }
  };

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
  const unitLabel = c.supportUnitLabel || "coffee";
  const unitEmoji = c.supportUnitEmoji || "☕";
  const buttonWording = c.buttonWording || "Support";
  const isSuggestedLayout = c.layoutType === "SUGGESTED";
  const totalAmount = customAmount
    ? parseInt(customAmount, 10)
    : unitPrice * quantity;

  const videoUrl = c.featuredVideoUrl || c.introVideoUrl;
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleSupportClick = () => {
    if (!totalAmount || totalAmount < 10) {
      toast.error("Minimum amount is NPR 10");
      return;
    }
    setPaymentPopupOpen(true);
  };

  const handleConfirmPayment = async () => {
    setDonating(true);
    try {
      if (paymentMethod === "ESEWA") {
        const { formUrl, fields } = await initiateEsewaTip({
          creatorUsername: username,
          amount: totalAmount,
          supporterName,
          message: supportMessage,
        });
        redirectToEsewa({ formUrl, fields });
      } else {
        const { paymentUrl } = await initiateKhaltiTip({
          creatorUsername: username,
          amount: totalAmount,
          supporterName,
          message: supportMessage,
        });
        redirectToKhalti(paymentUrl);
      }
    } catch {
      toast.error("Payment failed");
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
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-patron-black truncate"
                style={{
                  textShadow:
                    "0 1px 2px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.7)",
                }}
              >
                {c.displayName}
              </h1>
              <p className="text-patron-gray-500 text-sm mt-0.5">@{c.username || username}</p>
              {(c.tagline || c.whycreating) && (
                <p className="text-patron-gray-600 text-sm sm:text-base mt-2 max-w-xl">
                  {c.tagline || c.whycreating}
                </p>
              )}
            </div>
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
            <h2 className="text-lg font-bold text-patron-black mb-1 flex items-center gap-2">
              <Heart className="text-patron-orange-500" size={20} />
              Recent supporters
            </h2>
            <p className="text-sm text-patron-gray-500 mb-4">
              {c.supporterCount ?? supporters.length} people have bought{" "}
              {c.displayName?.split(" ")[0]} a {unitLabel}
            </p>
            {supporters.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-patron-orange-50 text-patron-orange-500 flex items-center justify-center mx-auto mb-3">
                  <Coffee size={22} />
                </div>
                <p className="text-patron-gray-500 text-sm">
                  Be the first one to support{" "}
                  <span className="font-semibold text-patron-black">{c.displayName}</span>
                </p>
              </div>
            ) : (
              <div className="divide-y divide-patron-gray-100">
                {supporters.map((s, i) => (
                  <div key={`${s.supporterName}-${s.createdAt}-${i}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-patron-orange-50 text-patron-orange-600 flex items-center justify-center shrink-0">
                      <Coffee size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-patron-black">
                        <span className="font-semibold">{s.supporterName}</span>{" "}
                        <span className="text-patron-gray-500">
                          {s.category === "SHOP" ? "bought something" : `sent a ${unitLabel}`}
                        </span>
                      </p>
                      {s.message && (
                        <p className="text-sm text-patron-gray-600 mt-1 italic leading-relaxed">
                          "{s.message}"
                        </p>
                      )}
                      <p className="text-[11px] text-patron-gray-400 mt-1.5">
                        {new Date(s.createdAt).toLocaleDateString("en-NP", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-patron-orange-600 shrink-0">
                      NPR {s.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {hasMoreSupporters && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleLoadMoreSupporters}
                  disabled={loadingMoreSupporters}
                  className="px-4 py-2 text-sm font-medium text-patron-green-700 border border-patron-green-200 rounded-xl hover:bg-patron-green-50 disabled:opacity-50"
                >
                  {loadingMoreSupporters ? "Loading..." : "Load more"}
                </button>
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
            {recentPosts.length === 0 ? (
              <p className="text-sm text-patron-gray-400 text-center py-6">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => {
                  const thumbnail = post.images?.[0] || firstContentImage(post.content);
                  return (
                  <Link
                    key={post.id}
                    to={`/${username}/posts/${post.id}`}
                    className="flex gap-3 p-3 rounded-xl hover:bg-patron-green-50 border border-transparent hover:border-patron-green-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-patron-green-100 text-patron-green-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {thumbnail ? (
                        <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : post.postType === "AUDIO" ? (
                        <Headphones size={18} />
                      ) : post.postType === "ALBUM" ? (
                        <ImageIcon size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-patron-black group-hover:text-patron-green-800 truncate">
                        {post.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-patron-gray-500 mt-0.5">
                        {new Date(post.createdAt).toLocaleDateString("en-NP", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Support widget sidebar */}
        {!isOwner && (
          <aside className="lg:col-span-1">
            <div
              id="support-section"
              className="bg-patron-white rounded-3xl border border-patron-gray-200 p-5 sm:p-6 shadow-sm sticky top-20"
            >
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-lg font-bold text-patron-black">
                  Buy {c.displayName?.split(" ")[0]} a {unitLabel}
                </h2>
                <HelpCircle
                  size={16}
                  className="text-patron-gray-400 shrink-0"
                  title={`It's a friendly gesture — each ${unitLabel} is NPR ${unitPrice}, buy as many as you like.`}
                />
              </div>

              {!isSuggestedLayout ? (
                /* Standard view: quantity picker */
                <div className="flex items-center gap-3 mb-4 p-3 bg-patron-orange-50/60 rounded-2xl border border-patron-orange-100">
                  <span className="w-11 h-11 rounded-full bg-patron-white shadow-sm flex items-center justify-center text-xl shrink-0">
                    {unitEmoji}
                  </span>
                  <span className="text-patron-gray-400 font-bold shrink-0">×</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 3, 5, 10].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setQuantity(q);
                          setCustomAmount("");
                        }}
                        className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center border-2 transition-colors ${
                          quantity === q && !customAmount
                            ? "bg-patron-orange-500 border-patron-orange-500 text-patron-white"
                            : "bg-patron-white border-patron-orange-200 text-patron-orange-500 hover:border-patron-orange-400"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Suggested amounts view */
                <div className="mb-4">
                  <div className="flex items-center gap-2 p-3 bg-patron-gray-100 rounded-2xl mb-2">
                    <span className="text-patron-gray-500 font-semibold shrink-0">NPR</span>
                    <input
                      type="number"
                      min="10"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="flex-1 bg-transparent text-sm font-semibold text-patron-black focus:outline-none placeholder:text-patron-gray-400 placeholder:font-normal"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {[50, 100, 250].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() =>
                          setCustomAmount((prev) => String((parseInt(prev, 10) || 0) + inc))
                        }
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-patron-white border border-patron-gray-200 text-patron-gray-600 hover:border-patron-orange-300 hover:text-patron-orange-600"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder="Name or @yoursocial"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl mb-3 focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 placeholder:text-patron-gray-400"
              />

              <textarea
                placeholder="Say something nice..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 placeholder:text-patron-gray-400"
              />

              {!isSuggestedLayout && (
                <input
                  type="number"
                  min="10"
                  placeholder="Or enter a custom NPR amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 placeholder:text-patron-gray-400"
                />
              )}

              <Button
                variant="accent"
                size="full"
                onClick={handleSupportClick}
                className={`rounded-full py-3.5 text-base font-bold shadow-md hover:shadow-lg ${isSuggestedLayout ? "mt-1" : ""}`}
              >
                {buttonWording} NPR {totalAmount?.toLocaleString() || "—"}
              </Button>
              <button
                type="button"
                onClick={() => setSupportModalOpen(true)}
                className="w-full text-center text-xs text-patron-green-700 hover:underline py-2.5 mt-1"
              >
                Full support form (photo, video, private)
              </button>
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
            </div>
          </aside>
        )}
      </div>

      {/* Payment method popup - opens only after Support is clicked */}
      {paymentPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-patron-black/50 px-4">
          <div className="bg-patron-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              type="button"
              onClick={() => setPaymentPopupOpen(false)}
              className="absolute top-4 right-4 text-patron-gray-400 hover:text-patron-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-patron-green-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                {c.displayName?.charAt(0) || "?"}
              </div>
              <h3 className="text-lg font-bold text-patron-black">
                Support {c.displayName}
              </h3>
              <p className="text-sm text-patron-gray-500 mt-1">
                You'll be charged NPR {totalAmount?.toLocaleString() || "—"}
              </p>
            </div>

            <PaymentMethodPicker
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            <Button
              variant="accent"
              size="full"
              onClick={handleConfirmPayment}
              isLoading={donating}
              className="rounded-xl py-3 mt-4 w-full"
            >
              Pay NPR {totalAmount?.toLocaleString() || "—"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;