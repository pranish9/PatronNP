import { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Percent,
  CreditCard,
  Users,
  ShoppingBag,
  LayoutDashboard,
  UserPlus,
  Receipt,
  UserCheck,
  UserMinus,
  UserCog,
  Banknote,
  Undo2,
  ShieldAlert,
  Settings,
  ScrollText,
  Headset,
  Download,
  MessageSquareWarning,
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import toast from "react-hot-toast";

import AdminLayout from "../components/adminLayout/AdminLayout";
import AdminUsersTab from "../components/adminLayout/AdminUsersTab";
import AdminPayoutsTab from "../components/adminLayout/AdminPayoutsTab";
import AdminRefundsTab from "../components/adminLayout/AdminRefundsTab";
import AdminReportsTab from "../components/adminLayout/AdminReportsTab";
import AdminSettingsTab from "../components/adminLayout/AdminSettingsTab";
import AdminAuditLogTab from "../components/adminLayout/AdminAuditLogTab";
import AdminSupportTab from "../components/adminLayout/AdminSupportTab";
import adminService from "../services/adminService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "revenue", label: "Revenue Trends", icon: TrendingUp },
  { id: "growth", label: "Growth", icon: UserPlus },
  { id: "users", label: "Users", icon: UserCog },
  { id: "payouts", label: "Payouts", icon: Banknote },
  { id: "refunds", label: "Refunds", icon: Undo2 },
  { id: "reports", label: "Reports", icon: ShieldAlert },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "support", label: "Support", icon: Headset },
  { id: "audit-log", label: "Audit Log", icon: ScrollText },
  { id: "settings", label: "Settings", icon: Settings },
];

const DAY_RANGES = [
  { id: 7, label: "7d" },
  { id: 30, label: "30d" },
  { id: 90, label: "90d" },
];

const fmtDay = (d) => new Date(d).toLocaleDateString("en-NP", { month: "short", day: "numeric" });

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
  const [rates, setRates] = useState(null);
  const [attention, setAttention] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const [overviewRes, statsRes, settingsRes, attentionRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getCommissionStats(),
        adminService.getSettings(),
        adminService.getNeedsAttention(),
      ]);
      setOverview(overviewRes.data);
      setStats(statsRes.data);
      setRates(settingsRes.data);
      setAttention(attentionRes.data);
    } catch {
      toast.error("Failed to load commission stats");
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "overview") loadOverview();
  }, [activeTab, loadOverview]);

  const [trendDays, setTrendDays] = useState(30);
  const [trendData, setTrendData] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(true);

  const loadTrend = useCallback(async () => {
    setLoadingTrend(true);
    try {
      const res = await adminService.getRevenueTrend(trendDays);
      setTrendData(res.data || []);
    } catch {
      toast.error("Failed to load revenue trend");
    } finally {
      setLoadingTrend(false);
    }
  }, [trendDays]);

  useEffect(() => {
    if (activeTab === "revenue") loadTrend();
  }, [activeTab, loadTrend]);

  const [growthDays, setGrowthDays] = useState(30);
  const [growth, setGrowth] = useState(null);
  const [loadingGrowth, setLoadingGrowth] = useState(true);

  const loadGrowth = useCallback(async () => {
    setLoadingGrowth(true);
    try {
      const res = await adminService.getGrowth(growthDays);
      setGrowth(res.data);
    } catch {
      toast.error("Failed to load growth metrics");
    } finally {
      setLoadingGrowth(false);
    }
  }, [growthDays]);

  useEffect(() => {
    if (activeTab === "growth") loadGrowth();
  }, [activeTab, loadGrowth]);

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
    <AdminLayout tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-patron-black">
          {TABS.find((t) => t.id === activeTab)?.label}
        </h1>

        {activeTab === "overview" &&
          (loadingOverview || !stats ? (
            <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Needs attention */}
              {attention && (
                <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                  <h2 className="font-bold text-patron-black mb-4">Needs attention</h2>
                  {attention.pendingPayouts + attention.pendingRefunds + attention.pendingReports + attention.openTickets === 0 ? (
                    <p className="text-sm text-patron-gray-400">All caught up — nothing pending right now.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <AttentionCard
                        icon={Banknote}
                        label="Payouts"
                        count={attention.pendingPayouts}
                        onClick={() => setActiveTab("payouts")}
                      />
                      <AttentionCard
                        icon={Undo2}
                        label="Refunds"
                        count={attention.pendingRefunds}
                        onClick={() => setActiveTab("refunds")}
                      />
                      <AttentionCard
                        icon={ShieldAlert}
                        label="Reports"
                        count={attention.pendingReports}
                        onClick={() => setActiveTab("reports")}
                      />
                      <AttentionCard
                        icon={MessageSquareWarning}
                        label="Tickets"
                        count={attention.openTickets}
                        onClick={() => setActiveTab("support")}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Revenue cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Wallet} label="Total platform revenue" value={fmt(stats.totalPlatformRevenue)} accent="green" />
                <StatCard
                  icon={Percent}
                  label={`Commission earned${rates ? ` (${(rates.commissionRate * 100).toFixed(1)}%)` : ""}`}
                  value={fmt(stats.totalCommission)}
                  accent="orange"
                />
                <StatCard
                  icon={CreditCard}
                  label={`eSewa gateway fees${rates ? ` (${(rates.esewaGatewayFeeRate * 100).toFixed(1)}%)` : ""}`}
                  value={fmt(stats.totalGatewayFees)}
                  accent="orange"
                />
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

        {activeTab === "revenue" && (
          <div className="space-y-4">
            <DayRangePicker value={trendDays} onChange={setTrendDays} />

            <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
              {loadingTrend ? (
                <div className="h-64 flex items-center justify-center text-sm text-patron-gray-400">Loading...</div>
              ) : trendData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-sm text-patron-gray-400">No revenue yet.</div>
              ) : (
                <div className="h-72">
                  <Line
                    data={{
                      labels: trendData.map((p) => fmtDay(p.date)),
                      datasets: [
                        {
                          label: "Commission",
                          data: trendData.map((p) => p.commissionAmount),
                          borderColor: "#16a34a",
                          backgroundColor: "rgba(22,163,74,0.12)",
                          fill: true,
                          tension: 0.4,
                          borderWidth: 2,
                          pointRadius: 0,
                          pointHoverRadius: 4,
                        },
                        {
                          label: "Gateway fee",
                          data: trendData.map((p) => p.gatewayFeeAmount),
                          borderColor: "#f97316",
                          backgroundColor: "rgba(249,115,22,0.12)",
                          fill: true,
                          tension: 0.4,
                          borderWidth: 2,
                          pointRadius: 0,
                          pointHoverRadius: 4,
                        },
                        {
                          label: "Gross",
                          data: trendData.map((p) => p.grossAmount),
                          borderColor: "#a3a3a3",
                          backgroundColor: "transparent",
                          borderDash: [4, 4],
                          fill: false,
                          tension: 0.4,
                          borderWidth: 1.5,
                          pointRadius: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
                      interaction: { mode: "index", intersect: false },
                      scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "growth" &&
          (loadingGrowth || !growth ? (
            <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="space-y-4">
              <DayRangePicker value={growthDays} onChange={setGrowthDays} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Percent} label="Churn rate" value={`${growth.churnRatePercent.toFixed(1)}%`} accent="orange" />
                <StatCard icon={UserCheck} label="Active creators" value={growth.activeCreators} accent="green" />
                <StatCard icon={UserMinus} label="Dormant creators" value={growth.dormantCreators} accent="orange" />
                <StatCard icon={Users} label="Total creators" value={growth.totalCreators} accent="green" />
              </div>

              <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                <h2 className="font-bold text-patron-black mb-4">New signups</h2>
                {growth.signups.every((p) => p.count === 0) ? (
                  <div className="h-56 flex items-center justify-center text-sm text-patron-gray-400">
                    No signups in this range.
                  </div>
                ) : (
                  <div className="h-56">
                    <Bar
                      data={{
                        labels: growth.signups.map((p) => fmtDay(p.date)),
                        datasets: [
                          {
                            label: "New signups",
                            data: growth.signups.map((p) => p.count),
                            backgroundColor: "#16a34a",
                            borderRadius: 4,
                            maxBarThickness: 24,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

        {activeTab === "users" && <AdminUsersTab />}

        {activeTab === "payouts" && <AdminPayoutsTab />}

        {activeTab === "refunds" && <AdminRefundsTab />}

        {activeTab === "reports" && <AdminReportsTab />}

        {activeTab === "transactions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
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

            <button
              onClick={() => adminService.exportTransactions(categoryFilter)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50"
            >
              <Download size={15} />
              Export CSV
            </button>
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

        {activeTab === "support" && <AdminSupportTab />}

        {activeTab === "audit-log" && <AdminAuditLogTab />}

        {activeTab === "settings" && <AdminSettingsTab />}
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

const AttentionCard = ({ icon: Icon, label, count, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left rounded-xl p-3.5 border transition-colors ${
      count > 0
        ? "border-patron-orange-200 bg-patron-orange-50 hover:bg-patron-orange-100"
        : "border-patron-gray-200 bg-patron-gray-100 hover:bg-patron-gray-200/60"
    }`}
  >
    <div className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${count > 0 ? "text-patron-orange-700" : "text-patron-gray-500"}`}>
      <Icon size={14} />
      {label}
    </div>
    <p className={`text-2xl font-bold ${count > 0 ? "text-patron-orange-800" : "text-patron-gray-400"}`}>{count}</p>
  </button>
);

const DayRangePicker = ({ value, onChange }) => (
  <div className="flex gap-1 bg-patron-gray-200/60 rounded-full p-1 w-fit">
    {DAY_RANGES.map((r) => (
      <button
        key={r.id}
        onClick={() => onChange(r.id)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          value === r.id ? "bg-patron-white text-patron-black shadow-sm" : "text-patron-gray-500 hover:text-patron-gray-700"
        }`}
      >
        {r.label}
      </button>
    ))}
  </div>
);

export default AdminDashboard;
