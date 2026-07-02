import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import productService from "../../services/productService";
import useCartStore from "../../stores/cartStore";
import StarRating from "../../components/shop/StarRating";

const CreatorShop = () => {
  const { username, creator, loading, notFound } = useCreatorPage();
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!username) return;
    setItemsLoading(true);
    productService
      .getPublicProducts(username)
      .then((res) => setItems((res.data || []).map((p) => ({ ...p, image: p.featuredImageUrl }))))
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, [username]);

  const categories = useMemo(
    () => [...new Set(items.flatMap((item) => item.categories || []))],
    [items]
  );

  const visibleItems = activeCategory
    ? items.filter((item) => item.categories?.includes(activeCategory))
    : items;

  if (loading || itemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
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
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-2">
          <ShoppingBag className="text-patron-green-600" size={28} />
          Shop
        </h1>
        <p className="text-patron-gray-500 text-sm sm:text-base mt-1">
          Products from {creator?.displayName || username}
        </p>
        {creator?.shopSalesCount > 0 && (
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-patron-gray-500">
            <ShoppingBag size={14} />
            {creator.shopSalesCount} sales
            {creator.shopAverageRating > 0 && (
              <>
                <span className="text-patron-gray-300">|</span>
                <StarRating value={creator.shopAverageRating} readOnly size={14} />
              </>
            )}
          </div>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === null
                ? "bg-patron-black text-white border-patron-black"
                : "border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === category
                  ? "bg-patron-black text-white border-patron-black"
                  : "border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visibleItems.map((item) => (
          <Link
            key={item.id}
            to={`/${username}/shop/${item.id}`}
            className="group bg-patron-white rounded-2xl border border-patron-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-patron-green-200 transition-all"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => handleAddToCart(e, item)}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5 bg-patron-orange-500 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg"
              >
                <Plus size={14} />
                Add to cart
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm sm:text-base truncate text-patron-black">{item.name}</h3>
              <p className="text-patron-green-700 font-bold mt-1">Rs {item.price.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {item.soldCount > 0 && (
                  <p className="text-patron-gray-400 text-xs">{item.soldCount} sold</p>
                )}
                {item.ratingCount > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating value={item.averageRating} readOnly size={11} />
                    <span className="text-patron-gray-400 text-xs">({item.ratingCount})</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CreatorShop;
