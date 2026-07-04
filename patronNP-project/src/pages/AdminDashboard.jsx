import { useCallback, useEffect, useState } from "react";
import { Wallet, TrendingUp, Percent, CreditCard, Users, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "../components/adminLayout/AdminLayout";
import adminService from "../services/adminService";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Transactions" },
];

const CATEGORY_LABELS = {
  TIP: "Tips",
  SHOP: "Shop",
  MEMBERSHIP: "Membership",
};

const CATEGORY_FILTERS = [
  { id: "", label: "All" },
  { id: "TIP", label: "Tips" },
  { id: "SHOP", label: "Shop" },
  { id: "MEMBERSHIP", label: "Membership" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [overview, setOverview] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const [overviewRes, statsRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getCommissionStats(),
      ]);
      setOverview(overviewRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error("Failed to load commission stats");
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "overview") loadOverview();
  }, [activeTab, loadOverview]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [txnPage, setTxnPage] = useState(0);
  const [txnTotalPages, setTxnTotalPages] = useState(0);
  const [loadingTxns, setLoadingTxns] = useState(true);

  const loadTransactions = useCallback(async () => {
    setLoadingTxns(true);
    try {
      const res = await adminService.getTransactions(categoryFilter, txnPage, 20);
      setTransactions(res.data.content || []);
      setTxnTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoadingTxns(false);
    }
  }, [categoryFilter, txnPage]);

  useEffect(() => {
    if (activeTab === "transactions") loadTransactions();
  }, [activeTab, loadTransactions]);

  const fmt = (n) => `Rs ${Math.round(n || 0).toLocaleString()}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-patron-black">Commission Dashboard</h1>

        <div className="flex gap-6 border-b border-patron-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "text-patron-black border-patron-black"
                  : "text-patron-gray-400 border-transparent hover:text-patron-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" &&
          (loadingOverview || !stats ? (
            <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Revenue cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Wallet} label="Total platform revenue" value={fmt(stats.totalPlatformRevenue)} accent="green" />
                <StatCard icon={Percent} label="Commission earned (10%)" value={fmt(stats.totalCommission)} accent="orange" />
                <StatCard icon={CreditCard} label="eSewa gateway fees (2.5%)" value={fmt(stats.totalGatewayFees)} accent="orange" />
                <StatCard icon={TrendingUp} label="Last 30 days" value={fmt(stats.last30DaysRevenue)} accent="green" />
              </div>

              {/* Platform overview */}
              {overview && (
                <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                  <h2 className="font-bold text-patron-black mb-4">Platform</h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-patron-black">{overview.totalUsers}</p>
                      <p className="flex items-center justify-center gap-1 text-xs text-patron-gray-500 mt-1">
                        <Users size={12} /> Total users
                      </p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-patron-black">{overview.totalCreators}</p>
                      <p className="flex items-center justify-center gap-1 text-xs text-patron-gray-500 mt-1">
                        <ShoppingBag size={12} /> Creators
                      </p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-patron-black">{overview.totalTransactions}</p>
                      <p className="flex items-center justify-center gap-1 text-xs text-patron-gray-500 mt-1">
                        <CreditCard size={12} /> Transactions
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden">
                <h2 className="font-bold text-patron-black p-5 sm:p-6 pb-0">Commission by category</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mt-4">
                    <thead>
                      <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                        <th className="px-5 py-2 font-semibold">Category</th>
                        <th className="px-5 py-2 font-semibold text-right">Count</th>
                        <th className="px-5 py-2 font-semibold text-right">Gross</th>
                        <th className="px-5 py-2 font-semibold text-right">Commission</th>
                        <th className="px-5 py-2 font-semibold text-right">Gateway fee</th>
                        <th className="px-5 py-2 font-semibold text-right">Net to creators</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-patron-gray-100">
                      {stats.categories.map((c) => (
                        <tr key={c.category}>
                          <td className="px-5 py-3 font-semibold text-patron-black">
                            {CATEGORY_LABELS[c.category] || c.category}
                          </td>
                          <td className="px-5 py-3 text-right text-patron-gray-600">{c.transactionCount}</td>
                          <td className="px-5 py-3 text-right text-patron-gray-600">{fmt(c.grossAmount)}</td>
                          <td className="px-5 py-3 text-right text-patron-green-700 font-semibold">{fmt(c.commissionAmount)}</td>
                          <td className="px-5 py-3 text-right text-patron-orange-700">{fmt(c.gatewayFeeAmount)}</td>
                          <td className="px-5 py-3 text-right text-patron-gray-600">{fmt(c.netToCreators)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "transactions" && (
          <div className="space-y-4">
            <div className="flex gap-1 bg-patron-gray-200/60 rounded-full p-1 w-fit">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setCategoryFilter(f.id);
                    setTxnPage(0);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categoryFilter === f.id
                      ? "bg-patron-white text-patron-black shadow-sm"
                      : "text-patron-gray-500 hover:text-patron-gray-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden">
              {loadingTxns ? (
                <div className="p-8 text-center text-patron-gray-400 text-sm">Loading...</div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-patron-gray-400 text-sm">No transactions yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                        <th className="px-5 py-3 font-semibold">Date</th>
                        <th className="px-5 py-3 font-semibold">Creator</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        <th className="px-5 py-3 font-semibold">Provider</th>
                        <th className="px-5 py-3 font-semibold text-right">Amount</th>
                        <th className="px-5 py-3 font-semibold text-right">Commission</th>
                        <th className="px-5 py-3 font-semibold text-right">Gateway fee</th>
                        <th className="px-5 py-3 font-semibold text-right">Net to creator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-patron-gray-100">
                      {transactions.map((t) => (
                        <tr key={t.id}>
                          <td className="px-5 py-3 text-patron-gray-500 whitespace-nowrap">
                            {new Date(t.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })}
                          </td>
                          <td className="px-5 py-3 font-medium text-patron-black">{t.creatorUsername}</td>
                          <td className="px-5 py-3 text-patron-gray-600">{CATEGORY_LABELS[t.category] || t.category}</td>
                          <td className="px-5 py-3 text-patron-gray-600">{t.provider === "KHALTI" ? "Khalti" : "eSewa"}</td>
                          <td className="px-5 py-3 text-right text-patron-black">{fmt(t.amount)}</td>
                          <td className="px-5 py-3 text-right text-patron-green-700">{fmt(t.commissionAmount)}</td>
                          <td className="px-5 py-3 text-right text-patron-orange-700">{fmt(t.gatewayFeeAmount)}</td>
                          <td className="px-5 py-3 text-right text-patron-gray-600">{fmt(t.creatorNetAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {txnTotalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-patron-gray-100">
                  <button
                    onClick={() => setTxnPage((p) => Math.max(0, p - 1))}
                    disabled={txnPage === 0}
                    className="text-sm font-medium text-patron-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-patron-gray-400">
                    Page {txnPage + 1} of {txnTotalPages}
                  </span>
                  <button
                    onClick={() => setTxnPage((p) => Math.min(txnTotalPages - 1, p + 1))}
                    disabled={txnPage >= txnTotalPages - 1}
                    className="text-sm font-medium text-patron-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5">
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
        accent === "green" ? "bg-patron-green-50 text-patron-green-700" : "bg-patron-orange-50 text-patron-orange-700"
      }`}
    >
      <Icon size={17} />
    </div>
    <p className="text-xl font-bold text-patron-black">{value}</p>
    <p className="text-xs text-patron-gray-500 mt-1">{label}</p>
  </div>
);

export default AdminDashboard;
