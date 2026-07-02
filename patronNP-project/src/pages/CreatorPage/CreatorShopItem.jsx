import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, ShoppingCart, Users, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import productService, { openProductContent } from "../../services/productService";
import ratingService from "../../services/ratingService";
import useCartStore from "../../stores/cartStore";
import StarRating from "../../components/shop/StarRating";

const CreatorShopItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { username, creator, loading, notFound } = useCreatorPage();
  const [item, setItem] = useState(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!username || !itemId) return;
    setItemLoading(true);
    productService
      .getPublicProduct(username, itemId)
      .then((res) => setItem({ ...res.data, image: res.data.featuredImageUrl }))
      .catch(() => setItem(null))
      .finally(() => setItemLoading(false));
  }, [username, itemId]);

  if (loading || itemLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Item not found</h1>
        <Link to={`/${username}/shop`} className="text-patron-green-700 text-sm mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: item.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const handleAddToCart = () => {
    addItem(item, username);
    toast.success("Added to cart");
  };

  const handleRate = async (stars) => {
    setSubmittingRating(true);
    try {
      await ratingService.submitRating(item.id, stars);
      setItem((prev) => ({ ...prev, myRating: stars }));
      toast.success("Thanks for your rating!");
    } catch {
      toast.error("Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleViewContent = () => {
    if (item.digitalFileUrl) {
      openProductContent(item.digitalFileUrl);
    } else {
      toast("Check your confirmation email for access details");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
      <button
        onClick={() => navigate(`/${username}/shop`)}
        className="flex items-center gap-1.5 text-sm text-patron-gray-500 hover:text-patron-green-700 mb-6"
      >
        <ArrowLeft size={16} />
        Back to shop
      </button>

      {/* Owner header */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={
            creator?.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(creator?.displayName || username)}&background=16a34a&color=fff`
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-patron-black">{creator?.displayName || username}</p>
          <p className="text-xs text-patron-gray-400">@{username}</p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 border border-patron-gray-200 px-3 py-1.5 rounded-full text-sm hover:bg-patron-gray-50"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-2xl overflow-hidden border border-patron-gray-200 shadow-sm aspect-square md:aspect-auto md:min-h-[400px]">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          {item.purchasedByCurrentUser && (
            <div className="flex items-center gap-2 text-sm text-patron-green-700 bg-patron-green-50 rounded-xl px-4 py-2.5 mb-4">
              <CheckCircle size={16} />
              You've purchased this on{" "}
              {new Date(item.purchasedAt).toLocaleDateString("en-NP", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-patron-black">{item.name}</h1>

          {!item.purchasedByCurrentUser && (
            <p className="text-2xl sm:text-3xl font-bold text-patron-green-700 mt-2">
              Rs {item.price.toLocaleString()}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {item.soldCount > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-patron-gray-500">
                <Users size={14} />
                {item.soldCount} sold
              </p>
            )}
            {item.ratingCount > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating value={item.averageRating} readOnly size={14} />
                <span className="text-sm text-patron-gray-500">
                  {item.averageRating.toFixed(1)} ({item.ratingCount})
                </span>
              </div>
            )}
          </div>

          {item.purchasedByCurrentUser && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-patron-black mb-1.5">
                {item.myRating ? "Your rating" : "Liked it? Give it a rating"}
              </p>
              <StarRating
                value={item.myRating || 0}
                onChange={submittingRating ? undefined : handleRate}
                size={22}
              />
            </div>
          )}

          <p className="text-patron-gray-600 leading-relaxed mt-5 flex-1">{item.description}</p>

          {item.purchasedByCurrentUser ? (
            <>
              <Button size="full" variant="accent" onClick={handleViewContent} className="mt-6 rounded-xl py-3.5">
                View content
              </Button>

              <div className="mt-8 pt-6 border-t border-patron-gray-100">
                <h2 className="font-bold text-patron-black mb-3">How it works</h2>
                <ol className="space-y-2 text-sm text-patron-gray-600 list-decimal list-inside">
                  <li>Payment confirmation: once your payment succeeds, you'll get a confirmation email.</li>
                  <li>That email contains a direct link to your content.</li>
                  <li>Click "View content" here, or the link in the email, any time.</li>
                </ol>
              </div>
            </>
          ) : (
            <Button size="full" variant="accent" onClick={handleAddToCart} className="mt-6 rounded-xl py-3.5">
              <ShoppingCart size={18} />
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorShopItem;
