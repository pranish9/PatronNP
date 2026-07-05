import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Heart, Users } from "lucide-react";
import toast from "react-hot-toast";

import purchaseService from "../../services/purchaseService";
import { openProductContent } from "../../services/productService";

const PAGE_SIZE = 5;

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const PaymentsTab = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);
  const [membershipVisibleCount, setMembershipVisibleCount] = useState(PAGE_SIZE);

  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(true);
  const [tipVisibleCount, setTipVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    purchaseService
      .getMyPurchases(0, 20)
      .then((res) => setPurchases(res.data?.content || []))
      .catch(() => toast.error("Failed to load purchases"))
      .finally(() => setLoading(false));

    purchaseService
      .getMyMembershipPayments(0, 20)
      .then((res) => setMemberships(res.data?.content || []))
      .catch(() => toast.error("Failed to load membership payments"))
      .finally(() => setLoadingMemberships(false));

    purchaseService
      .getMyTipPayments(0, 20)
      .then((res) => setTips(res.data?.content || []))
      .catch(() => toast.error("Failed to load tip payments"))
      .finally(() => setLoadingTips(false));
  }, []);

  const handleViewContent = (purchase) => {
    if (purchase.digitalFileUrl) {
      openProductContent(purchase.digitalFileUrl);
    } else {
      navigate(`/${purchase.creatorUsername}/shop/${purchase.productId}`);
    }
  };

  return (
    <div className="space-y-6">
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
          {purchases.slice(0, visibleCount).map((purchase, i) => (
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

          {visibleCount < purchases.length && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-4 py-2 text-sm font-medium text-patron-green-700 border border-patron-green-200 rounded-xl hover:bg-patron-green-50"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>

    <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
      <h2 className="text-lg font-bold text-patron-black mb-4">Memberships</h2>

      {loadingMemberships ? (
        <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
      ) : memberships.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-patron-gray-100 flex items-center justify-center mx-auto mb-3 text-patron-gray-400">
            <Users size={20} />
          </div>
          <h3 className="font-bold text-patron-black">No membership payments yet</h3>
          <p className="text-sm text-patron-gray-500 mt-1">
            Payments for memberships you join will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {memberships.slice(0, membershipVisibleCount).map((m, i) => (
            <div
              key={`${m.creatorUsername}-${m.createdAt}-${i}`}
              className="flex items-center gap-4 border border-patron-gray-200 rounded-xl p-3"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/${m.creatorUsername}/membership`}
                  className="text-sm font-semibold text-patron-black truncate hover:underline block"
                >
                  {m.creatorDisplayName || m.creatorUsername}
                </Link>
                <p className="text-xs text-patron-gray-500 mt-0.5">
                  {m.levelName} · {m.billingCycle === "YEARLY" ? "Yearly" : "Monthly"}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-patron-black">Rs {m.amount?.toLocaleString()}</p>
                <p className="text-xs text-patron-gray-400 mt-0.5">{formatDateTime(m.createdAt)}</p>
              </div>
            </div>
          ))}

          {membershipVisibleCount < memberships.length && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMembershipVisibleCount((c) => c + PAGE_SIZE)}
                className="px-4 py-2 text-sm font-medium text-patron-green-700 border border-patron-green-200 rounded-xl hover:bg-patron-green-50"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>

    <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
      <h2 className="text-lg font-bold text-patron-black mb-4">Tips</h2>

      {loadingTips ? (
        <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
      ) : tips.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-patron-gray-100 flex items-center justify-center mx-auto mb-3 text-patron-gray-400">
            <Heart size={20} />
          </div>
          <h3 className="font-bold text-patron-black">No tips sent yet</h3>
          <p className="text-sm text-patron-gray-500 mt-1">
            Tips you send with this account's email will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tips.slice(0, tipVisibleCount).map((t, i) => (
            <div
              key={`${t.creatorUsername}-${t.createdAt}-${i}`}
              className="flex items-center gap-4 border border-patron-gray-200 rounded-xl p-3"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/${t.creatorUsername}`}
                  className="text-sm font-semibold text-patron-black truncate hover:underline block"
                >
                  {t.creatorDisplayName || t.creatorUsername}
                </Link>
                {t.message && (
                  <p className="text-xs text-patron-gray-500 mt-0.5 truncate italic">"{t.message}"</p>
                )}
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-patron-black">Rs {t.amount?.toLocaleString()}</p>
                <p className="text-xs text-patron-gray-400 mt-0.5">{formatDateTime(t.createdAt)}</p>
              </div>
            </div>
          ))}

          {tipVisibleCount < tips.length && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setTipVisibleCount((c) => c + PAGE_SIZE)}
                className="px-4 py-2 text-sm font-medium text-patron-green-700 border border-patron-green-200 rounded-xl hover:bg-patron-green-50"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default PaymentsTab;
