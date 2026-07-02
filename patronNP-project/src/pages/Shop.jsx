import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, KeyRound, Video, Ticket, Search } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/creatorLayout/Layout";
import ProductRow from "../components/shop/ProductRow";
import ShopOrders from "../components/shop/ShopOrders";
import ShopDiscounts from "../components/shop/ShopDiscounts";
import productService from "../services/productService";

const TEMPLATES = [
  { type: null, label: "+ Start from scratch", icon: Plus, bg: "bg-patron-gray-100" },
  { type: "DIGITAL_PRODUCT", label: "Digital product", icon: FileText, bg: "bg-patron-green-50" },
  { type: "INSTAGRAM_CLOSE_FRIENDS", label: "Instagram close friends access", icon: KeyRound, bg: "bg-patron-orange-50" },
  { type: "ZOOM_CALL", label: "1-on-1 Zoom call", icon: Video, bg: "bg-patron-green-50" },
  { type: "EVENT_TICKET", label: "Ticket for an event", icon: Ticket, bg: "bg-patron-orange-50" },
];

const STATUS_TABS = [
  { id: "ACTIVE", label: "Active" },
  { id: "DRAFT", label: "Draft" },
  { id: "DEACTIVATED", label: "Deactivated" },
];

const SUB_NAV = ["Products", "Orders", "Discounts"];

const Shop = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const [subTab, setSubTab] = useState("Products");
  const [statusTab, setStatusTab] = useState("ACTIVE");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts(statusTab);
      setProducts(res.data || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [statusTab]);

  useEffect(() => {
    if (subTab === "Products") loadProducts();
  }, [subTab, loadProducts]);

  const handleDuplicate = async (product) => {
    try {
      await productService.duplicateProduct(product.id);
      toast.success("Product duplicated to Draft");
      if (statusTab === "DRAFT") loadProducts();
    } catch {
      toast.error("Failed to duplicate product");
    }
  };

  const handleDelete = async (product) => {
    try {
      await productService.deleteProduct(product.id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleActivate = async (product) => {
    try {
      await productService.activateProduct(product.id);
      toast.success("Product activated");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      toast.error("Failed to activate product");
    }
  };

  const handleDeactivate = async (product) => {
    try {
      await productService.deactivateProduct(product.id);
      toast.success("Product deactivated");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      toast.error("Failed to deactivate product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-patron-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-patron-black">Shop</h1>

          {/* Sub nav */}
          <div className="flex gap-6 border-b border-patron-gray-200">
            {SUB_NAV.map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  subTab === tab
                    ? "text-patron-black border-patron-black"
                    : "text-patron-gray-400 border-transparent hover:text-patron-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {subTab === "Orders" ? (
            <ShopOrders />
          ) : subTab === "Discounts" ? (
            <ShopDiscounts />
          ) : (
            <>
              {/* Templates */}
              <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      onClick={() =>
                        navigate(tpl.type ? `/shop/new?type=${tpl.type}` : "/shop/new")
                      }
                      className={`flex items-center gap-2 rounded-xl p-4 text-left text-sm font-medium text-patron-black hover:brightness-95 transition ${tpl.bg}`}
                    >
                      <tpl.icon size={18} />
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* My Products */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-patron-black">My Products</h2>
                  <div className="flex items-center gap-2 bg-patron-white border border-patron-gray-200 rounded-full px-3 py-1.5">
                    <Search size={15} className="text-patron-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search"
                      className="text-sm outline-none w-32 bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-1 bg-patron-gray-200/60 rounded-full p-1 w-fit">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusTab(tab.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        statusTab === tab.id
                          ? "bg-patron-white text-patron-black shadow-sm"
                          : "text-patron-gray-500 hover:text-patron-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 divide-y divide-patron-gray-100 px-4">
                  {loading ? (
                    <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="py-8 text-center text-patron-gray-400 text-sm">
                      No {STATUS_TABS.find((t) => t.id === statusTab)?.label.toLowerCase()} products yet.
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        username={username}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
