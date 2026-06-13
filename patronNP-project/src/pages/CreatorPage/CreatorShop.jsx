import { Link } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import { getCreatorShopItems } from "../../data/creatorMockData";
import useCartStore from "../../stores/cartStore";

const CreatorShop = () => {
  const { username, creator, loading, notFound } = useCreatorPage();
  const items = getCreatorShopItems(username);
  const addItem = useCartStore((s) => s.addItem);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, username);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="text-violet-600" size={28} />
          Shop
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Products from {creator?.displayName || username}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/${username}/shop/${item.id}`}
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => handleAddToCart(e, item)}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg"
              >
                <Plus size={14} />
                Add to cart
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
              <p className="text-violet-700 font-bold mt-1">Rs {item.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CreatorShop;
