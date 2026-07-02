import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ claimsCount: 0, last30Days: 0, allTime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders(0, 20)
      .then((res) => {
        setOrders(res.data?.orders?.content || []);
        setStats({
          claimsCount: res.data?.claimsCount || 0,
          last30Days: res.data?.last30Days || 0,
          allTime: res.data?.allTime || 0,
        });
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-patron-white rounded-2xl shadow-sm p-5">
          <p className="text-2xl font-bold text-patron-black">{stats.claimsCount}</p>
          <p className="text-sm text-patron-gray-500 mt-1">Claims</p>
        </div>
        <div className="bg-patron-white rounded-2xl shadow-sm p-5">
          <p className="text-2xl font-bold text-patron-black">NRs {stats.last30Days.toLocaleString()}</p>
          <p className="text-sm text-patron-gray-500 mt-1">Last 30 days</p>
        </div>
        <div className="bg-patron-white rounded-2xl shadow-sm p-5">
          <p className="text-2xl font-bold text-patron-black">NRs {stats.allTime.toLocaleString()}</p>
          <p className="text-sm text-patron-gray-500 mt-1">All-time</p>
        </div>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200">
        {loading ? (
          <div className="py-12 text-center text-patron-gray-400 text-sm">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-patron-gray-100 flex items-center justify-center mx-auto mb-3 text-patron-gray-400">
              <Gift size={20} />
            </div>
            <h3 className="font-bold text-patron-black">You don't have any claims yet</h3>
            <p className="text-sm text-patron-gray-500 mt-1">Share your page or add more extras! 🎁</p>
          </div>
        ) : (
          <div className="divide-y divide-patron-gray-100 px-5">
            {orders.map((order) => (
              <div key={order.transactionUuid} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-patron-black truncate">
                      {order.buyerName || "Anonymous"}
                    </p>
                    <p className="text-xs text-patron-gray-500 truncate">{order.buyerEmail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-patron-black">NRs {order.amount?.toLocaleString()}</p>
                    <p className="text-xs text-patron-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-patron-gray-500 mt-1.5">
                  {order.items?.map((i) => `${i.productName} × ${i.quantity}`).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrders;
