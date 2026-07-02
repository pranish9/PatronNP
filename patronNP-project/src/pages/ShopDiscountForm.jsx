import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import discountService from "../services/discountService";
import productService from "../services/productService";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateCode = () =>
  Array.from({ length: 8 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

const ShopDiscountForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState(generateCode());
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [limitQuantity, setLimitQuantity] = useState(false);
  const [maxUses, setMaxUses] = useState("");
  const [limitValidityPeriod, setLimitValidityPeriod] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    productService
      .getProducts("ACTIVE")
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  const toggleProduct = (id) =>
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Give your discount a name");
      return;
    }
    if (!value || Number(value) <= 0) {
      toast.error("Enter a discount value");
      return;
    }

    setSaving(true);
    try {
      await discountService.createDiscount({
        name,
        code,
        type,
        value: Number(value),
        productIds: selectedProductIds,
        limitQuantity,
        maxUses: limitQuantity && maxUses ? Number(maxUses) : null,
        limitValidityPeriod,
        startDate: limitValidityPeriod && startDate ? new Date(startDate).toISOString() : null,
        endDate: limitValidityPeriod && endDate ? new Date(endDate).toISOString() : null,
      });
      toast.success("Discount created");
      navigate("/shop");
    } catch {
      toast.error("Failed to create discount");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-patron-gray-100">
      <div className="sticky top-0 bg-patron-gray-100/95 backdrop-blur z-10 border-b border-patron-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/shop")}
            className="p-2 rounded-lg bg-patron-white border border-patron-gray-200 text-patron-gray-600"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-patron-black">Create discount</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/shop")}
              className="px-4 py-2 bg-patron-white border border-patron-gray-200 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-patron-orange-500 hover:bg-patron-orange-600 text-white text-sm font-bold rounded-xl disabled:opacity-50"
            >
              Add discount
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-patron-black">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Black friday"
              className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Discount code</label>
            <div className="mt-1.5 flex items-center gap-2 bg-patron-gray-100 rounded-2xl px-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 py-3 text-sm bg-transparent border-none focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={() => setCode(generateCode())}
                className="p-1.5 text-patron-gray-500 hover:text-patron-black"
                aria-label="Regenerate code"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Apply discount to</label>
            <div className="mt-1.5 border border-patron-gray-200 rounded-2xl p-3 max-h-40 overflow-y-auto space-y-1">
              {products.length === 0 ? (
                <p className="text-sm text-patron-gray-400 px-1 py-1">No active products yet.</p>
              ) : (
                products.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 px-1 py-1.5 text-sm text-patron-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                    {p.name}
                  </label>
                ))
              )}
            </div>
            <p className="mt-1.5 text-xs text-patron-gray-400">
              Leave everything unchecked to apply this discount to all products.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-sm text-patron-gray-700 cursor-pointer">
                <input
                  type="radio"
                  checked={type === "PERCENTAGE"}
                  onChange={() => setType("PERCENTAGE")}
                />
                Discount percentage
              </label>
              <label className="flex items-center gap-2 text-sm text-patron-gray-700 cursor-pointer">
                <input
                  type="radio"
                  checked={type === "FIXED_AMOUNT"}
                  onChange={() => setType("FIXED_AMOUNT")}
                />
                Fixed amount
              </label>
            </div>
            <div className="mt-2 flex items-center bg-patron-gray-100 rounded-2xl px-4">
              {type === "FIXED_AMOUNT" && <span className="text-patron-gray-500 text-sm">Rs</span>}
              <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === "PERCENTAGE" ? "25" : "100"}
                className="flex-1 px-2 py-3 text-sm bg-transparent border-none focus:outline-none"
              />
              {type === "PERCENTAGE" && <span className="text-patron-gray-500 text-sm">%</span>}
            </div>
          </div>
        </div>

        <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-patron-black">Advanced settings</h2>

          <ToggleRow label="Limit quantity" checked={limitQuantity} onChange={setLimitQuantity}>
            {limitQuantity && (
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Number of uses"
                className="mt-2 w-full px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            )}
          </ToggleRow>

          <ToggleRow label="Limit validity period" checked={limitValidityPeriod} onChange={setLimitValidityPeriod}>
            {limitValidityPeriod && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
              </div>
            )}
          </ToggleRow>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange, children }) => (
  <div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-patron-gray-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? "bg-patron-green-600" : "bg-patron-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
    {children}
  </div>
);

export default ShopDiscountForm;
