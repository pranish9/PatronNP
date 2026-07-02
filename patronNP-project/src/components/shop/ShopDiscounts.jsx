import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import discountService from "../../services/discountService";

const formatValue = (discount) =>
  discount.type === "PERCENTAGE" ? `${discount.value}% off` : `NRs ${discount.value} off`;

const ShopDiscounts = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDiscounts = () => {
    setLoading(true);
    discountService
      .getDiscounts()
      .then((res) => setDiscounts(res.data || []))
      .catch(() => toast.error("Failed to load discounts"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const handleDelete = async (discount) => {
    if (!window.confirm(`Delete discount "${discount.name}"?`)) return;
    try {
      await discountService.deleteDiscount(discount.id);
      toast.success("Discount deleted");
      setDiscounts((prev) => prev.filter((d) => d.id !== discount.id));
    } catch {
      toast.error("Failed to delete discount");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-patron-black">Discounts</h2>
        <button
          onClick={() => navigate("/shop/discounts/new")}
          className="px-4 py-2 bg-patron-black text-patron-white text-sm font-semibold rounded-full hover:bg-patron-gray-800"
        >
          New discount
        </button>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200">
        {loading ? (
          <div className="py-12 text-center text-patron-gray-400 text-sm">Loading...</div>
        ) : discounts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-patron-gray-100 flex items-center justify-center mx-auto mb-3 text-patron-gray-400">
              <Tag size={20} />
            </div>
            <h3 className="font-bold text-patron-black">No discounts yet</h3>
            <p className="text-sm text-patron-gray-500 mt-1">Offer discounts to your true fans.</p>
          </div>
        ) : (
          <div className="divide-y divide-patron-gray-100 px-5">
            {discounts.map((discount) => (
              <div key={discount.id} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-patron-black truncate">{discount.name}</p>
                  <p className="text-xs text-patron-gray-500 mt-0.5">
                    <span className="font-mono bg-patron-gray-100 px-1.5 py-0.5 rounded">{discount.code}</span>
                    {" · "}
                    {formatValue(discount)}
                    {" · "}
                    {discount.usedCount || 0} used
                    {discount.limitQuantity && discount.maxUses ? ` / ${discount.maxUses}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(discount)}
                  className="p-2 rounded-lg text-patron-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                  aria-label="Delete discount"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDiscounts;
