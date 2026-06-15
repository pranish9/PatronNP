import { Link, useParams } from "react-router-dom";
import { ShoppingCart, ChevronRight } from "lucide-react";
import useCartStore from "../../stores/cartStore";

const CartBar = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.itemCount());
  const cartCreator = useCartStore((s) => s.creatorUsername);

  if (!count || cartCreator !== username) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <Link
        to={`/${username}/checkout`}
        className="flex items-center justify-between gap-3 bg-patron-black text-patron-white px-5 py-3.5 rounded-2xl shadow-2xl hover:bg-patron-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-patron-orange-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">View cart</p>
            <p className="text-xs text-slate-400">{count} item{count !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">Rs {total.toLocaleString()}</span>
          <ChevronRight size={18} />
        </div>
      </Link>
    </div>
  );
};

export default CartBar;
