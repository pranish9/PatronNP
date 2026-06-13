import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, ShoppingCart, Users } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import { getShopItemById } from "../../data/creatorMockData";
import useCartStore from "../../stores/cartStore";

const CreatorShopItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { username, creator, loading, notFound } = useCreatorPage();
  const item = getShopItemById(username, itemId);
  const addItem = useCartStore((s) => s.addItem);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Item not found</h1>
        <Link to={`/${username}/shop`} className="text-violet-600 text-sm mt-2 inline-block">
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
      <button
        onClick={() => navigate(`/${username}/shop`)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-6"
      >
        <ArrowLeft size={16} />
        Back to shop
      </button>

      {/* Owner header */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={
            creator?.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(creator?.displayName || username)}&background=7c3aed&color=fff`
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{creator?.displayName || username}</p>
          <p className="text-xs text-slate-400">@{username}</p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 rounded-full text-sm hover:bg-slate-50"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm aspect-square md:aspect-auto md:min-h-[400px]">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{item.name}</h1>
          <p className="text-2xl sm:text-3xl font-bold text-violet-700 mt-2">
            Rs {item.price.toLocaleString()}
          </p>

          <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-3">
            <Users size={14} />
            {item.purchasedCount} people bought this
          </p>

          <p className="text-slate-600 leading-relaxed mt-5 flex-1">{item.description}</p>

          <Button
            size="full"
            onClick={handleAddToCart}
            className="mt-6 rounded-xl py-3.5"
          >
            <ShoppingCart size={18} />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorShopItem;
