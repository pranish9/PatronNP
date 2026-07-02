import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import toast from "react-hot-toast";

import purchaseService from "../../services/purchaseService";
import { openProductContent } from "../../services/productService";

const PaymentsTab = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseService
      .getMyPurchases(0, 20)
      .then((res) => setPurchases(res.data?.content || []))
      .catch(() => toast.error("Failed to load purchases"))
      .finally(() => setLoading(false));
  }, []);

  const handleViewContent = (purchase) => {
    if (purchase.digitalFileUrl) {
      openProductContent(purchase.digitalFileUrl);
    } else {
      navigate(`/${purchase.creatorUsername}/shop/${purchase.productId}`);
    }
  };

  return (
    <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
      <h2 className="text-lg font-bold text-patron-black mb-4">Shop</h2>

      {loading ? (
        <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
      ) : purchases.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-patron-gray-100 flex items-center justify-center mx-auto mb-3 text-patron-gray-400">
            <Package size={20} />
          </div>
          <h3 className="font-bold text-patron-black">No purchases yet</h3>
          <p className="text-sm text-patron-gray-500 mt-1">
            Anything you buy from a creator's shop will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase, i) => (
            <div
              key={`${purchase.productId}-${purchase.createdAt}-${i}`}
              className="flex items-center gap-4 border border-patron-gray-200 rounded-xl p-3"
            >
              <div className="w-14 h-14 rounded-lg bg-patron-gray-100 overflow-hidden shrink-0">
                {purchase.productImageUrl && (
                  <img
                    src={purchase.productImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/${purchase.creatorUsername}/shop/${purchase.productId}`}
                  className="text-sm font-semibold text-patron-black truncate hover:underline block"
                >
                  {purchase.productName}
                </Link>
                <p className="text-xs text-patron-gray-500 mt-0.5">
                  {purchase.creatorDisplayName || purchase.creatorUsername}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleViewContent(purchase)}
                    className="px-4 py-1.5 bg-patron-orange-500 hover:bg-patron-orange-600 text-white text-xs font-bold rounded-full"
                  >
                    View Content
                  </button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-patron-black">
                  Rs {purchase.amount?.toLocaleString()}
                </p>
                <p className="text-xs text-patron-gray-400 mt-0.5">
                  {new Date(purchase.createdAt).toLocaleDateString("en-NP", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;
