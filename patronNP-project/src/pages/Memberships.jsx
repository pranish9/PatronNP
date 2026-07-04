import { useCallback, useEffect, useState } from "react";
import { Lock, Calendar, Wallet, Users, Pencil, Trash2, EyeOff, Eye, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import Layout from "../components/creatorLayout/Layout";
import LevelFormModal from "../components/membership/LevelFormModal";
import PaymentMethodPicker from "../components/PublicCreatorLayout/PaymentMethodPicker";
import membershipService from "../services/membershipService";
import { getMyTransactions } from "../services/transactionService";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const TABS = [
  { id: "members", label: "Members" },
  { id: "levels", label: "Levels" },
  { id: "recovery", label: "Recovery" },
  { id: "settings", label: "Settings" },
];

const Memberships = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");

  // Members tab
  const [stats, setStats] = useState({ memberCount: 0, monthlyRevenue: 0, allTimeRevenue: 0 });
  const [members, setMembers] = useState([]);
  const [chartDays, setChartDays] = useState([]);
  const [chartAmounts, setChartAmounts] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const [statsRes, membersRes, txnRes] = await Promise.all([
        membershipService.getStats(),
        membershipService.getMembers(),
        getMyTransactions(0, 100).catch(() => ({ transactions: { content: [] } })),
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data || []);

      const membershipTxns = (txnRes.transactions?.content || []).filter(
        (t) => t.category === "MEMBERSHIP" && t.status === "SUCCESS"
      );
      const byDay = membershipTxns.reduce((acc, t) => {
        const day = new Date(t.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" });
        acc[day] = (acc[day] || 0) + (t.amount || 0);
        return acc;
      }, {});
      const days = Object.keys(byDay).sort((a, b) => new Date(a) - new Date(b));
      setChartDays(days);
      setChartAmounts(days.map((d) => byDay[d]));
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "members") loadMembers();
  }, [activeTab, loadMembers]);

  // Levels tab
  const [levels, setLevels] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);

  const loadLevels = useCallback(async () => {
    setLoadingLevels(true);
    try {
      const res = await membershipService.getLevels();
      setLevels(res.data || []);
    } catch {
      toast.error("Failed to load levels");
    } finally {
      setLoadingLevels(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "levels") loadLevels();
  }, [activeTab, loadLevels]);

  const openCreateModal = () => {
    setEditingLevel(null);
    setModalOpen(true);
  };

  const openEditModal = (level) => {
    setEditingLevel(level);
    setModalOpen(true);
  };

  const handleSaveLevel = async (form, { coverImage, publish }) => {
    try {
      if (editingLevel) {
        await membershipService.updateLevel(editingLevel.id, form, { coverImage, publish });
        toast.success("Level updated");
      } else {
        await membershipService.createLevel(form, { coverImage, publish });
        toast.success(publish ? "Level created and published" : "Level saved as draft");
      }
      setModalOpen(false);
      loadLevels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save level");
    }
  };

  const handleTogglePublish = async (level) => {
    try {
      if (level.published) {
        await membershipService.unpublishLevel(level.id);
        toast.success("Level unpublished");
      } else {
        await membershipService.publishLevel(level.id);
        toast.success("Level published");
      }
      loadLevels();
    } catch {
      toast.error("Failed to update level");
    }
  };

  const handleDeleteLevel = async (level) => {
    try {
      await membershipService.deleteLevel(level.id);
      toast.success("Level deleted");
      setLevels((prev) => prev.filter((l) => l.id !== level.id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Can't delete a level with active members");
    }
  };

  // Recovery tab
  const [recovery, setRecovery] = useState([]);
  const [loadingRecovery, setLoadingRecovery] = useState(true);

  const loadRecovery = useCallback(async () => {
    setLoadingRecovery(true);
    try {
      const res = await membershipService.getRecovery();
      setRecovery(res.data || []);
    } catch {
      toast.error("Failed to load recovery");
    } finally {
      setLoadingRecovery(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "recovery") loadRecovery();
  }, [activeTab, loadRecovery]);

  const handleResolveRefund = async (item, approve) => {
    try {
      await membershipService.resolveRefund(item.subscriptionId, approve);
      toast.success(approve ? "Refund marked as approved" : "Refund denied");
      loadRecovery();
    } catch {
      toast.error("Failed to update refund");
    }
  };

  const [payingRefundFor, setPayingRefundFor] = useState(null);
  const [refundPayMethod, setRefundPayMethod] = useState("ESEWA");
  const [refundPayReference, setRefundPayReference] = useState("");
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const openConfirmPaymentModal = (item) => {
    setPayingRefundFor(item);
    setRefundPayMethod(item.refundMethod === "KHALTI" ? "KHALTI" : "ESEWA");
    setRefundPayReference("");
  };

  const handleConfirmRefundPayment = async () => {
    if (!payingRefundFor) return;
    if (!refundPayReference.trim()) {
      toast.error("Enter the transaction reference for this payout");
      return;
    }
    setConfirmingPayment(true);
    try {
      await membershipService.confirmRefundPayment(
        payingRefundFor.subscriptionId,
        refundPayReference.trim(),
        refundPayMethod
      );
      toast.success(`Refund marked as paid via ${refundPayMethod === "KHALTI" ? "Khalti" : "eSewa"}`);
      setPayingRefundFor(null);
      loadRecovery();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm refund payment");
    } finally {
      setConfirmingPayment(false);
    }
  };

  const hasPublishedLevel = levels.some((l) => l.published);

  const chartData = {
    labels: chartDays,
    datasets: [
      {
        fill: true,
        data: chartAmounts,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.12)",
        pointBackgroundColor: "#16a34a",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartMax = Math.max(...chartAmounts, 200);
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
    scales: {
      y: { min: 0, max: chartMax * 1.2, ticks: { callback: (v) => `Rs ${v}` } },
      x: { grid: { display: false } },
    },
  };

  return (
    <Layout>
      <div className="bg-patron-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-patron-black">Memberships</h1>

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

          {/* MEMBERS */}
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-patron-white rounded-2xl shadow-sm p-5">
                  <p className="text-2xl font-bold text-patron-black">
                    {loadingMembers ? "—" : stats.memberCount}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-patron-gray-500 mt-1">
                    <Lock size={13} /> Member
                  </p>
                </div>
                <div className="bg-patron-white rounded-2xl shadow-sm p-5">
                  <p className="text-2xl font-bold text-patron-black">
                    {loadingMembers ? "—" : `Rs ${Math.round(stats.monthlyRevenue).toLocaleString()}`}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-patron-gray-500 mt-1">
                    <Calendar size={13} /> Per month
                  </p>
                </div>
                <div className="bg-patron-white rounded-2xl shadow-sm p-5">
                  <p className="text-2xl font-bold text-patron-black">
                    {loadingMembers ? "—" : `Rs ${Math.round(stats.allTimeRevenue).toLocaleString()}`}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-patron-gray-500 mt-1">
                    <Wallet size={13} /> All-time
                  </p>
                </div>
              </div>

              <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-3">
                <h3 className="font-bold text-patron-black">Earnings</h3>
                <div className="h-48">
                  {chartDays.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-patron-gray-400">
                      No membership earnings yet
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-6 sm:p-8">
                {loadingMembers ? (
                  <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
                ) : members.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-patron-gray-100 text-patron-gray-500 flex items-center justify-center mx-auto mb-4">
                      <Users size={20} />
                    </div>
                    <h3 className="font-bold text-patron-black">You don't have any members yet.</h3>
                    <p className="text-sm text-patron-gray-500 mt-1">
                      Share your page with your audience or customize your rewards to get the ball rolling.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-patron-gray-100">
                    {members.map((m) => (
                      <div key={m.subscriptionId} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                        <img
                          src={
                            m.memberAvatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.memberDisplayName)}&background=16a34a&color=fff`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-patron-black truncate">{m.memberDisplayName}</p>
                          <p className="text-xs text-patron-gray-500">
                            {m.levelName} · {m.billingCycle === "YEARLY" ? "Yearly" : "Monthly"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-patron-black">Rs {m.amount?.toLocaleString()}</p>
                          <p className="text-xs text-patron-gray-400">
                            /{m.billingCycle === "YEARLY" ? "yr" : "mo"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LEVELS */}
          {activeTab === "levels" && (
            <div className="space-y-4">
              {levels.length > 0 && !hasPublishedLevel && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-patron-orange-50 border border-patron-orange-200 rounded-2xl px-5 py-4">
                  <p className="text-sm text-patron-black">
                    Your memberships are currently unpublished. Connect your payout method now.
                  </p>
                  <button
                    onClick={() => navigate("/payment-setup")}
                    className="px-4 py-2 bg-patron-black text-white text-sm font-semibold rounded-full shrink-0"
                  >
                    Set up
                  </button>
                </div>
              )}

              {loadingLevels ? (
                <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
                  Loading...
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {levels.map((level) => (
                    <div key={level.id} className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 flex flex-col">
                      {level.coverImageUrl && (
                        <img src={level.coverImageUrl} alt="" className="w-full h-28 object-cover rounded-xl mb-3" />
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-patron-black">{level.name}</h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            level.published
                              ? "bg-patron-green-50 text-patron-green-700"
                              : "bg-patron-gray-100 text-patron-gray-500"
                          }`}
                        >
                          {level.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-sm text-patron-gray-500 mt-1">
                        Rs {level.monthlyPrice} / month
                        {level.yearlyPrice ? ` · Rs ${level.yearlyPrice} / year` : ""}
                      </p>
                      {level.description && (
                        <p className="text-sm text-patron-gray-600 mt-2 line-clamp-2">{level.description}</p>
                      )}
                      {level.rewards?.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {level.rewards.slice(0, 3).map((r) => (
                            <li key={r} className="text-xs text-patron-gray-600">
                              · {r}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-xs text-patron-gray-400 mt-3">{level.memberCount} member(s)</p>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => openEditModal(level)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border border-patron-gray-200 hover:bg-patron-gray-50"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(level)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border border-patron-gray-200 hover:bg-patron-gray-50"
                        >
                          {level.published ? <EyeOff size={13} /> : <Eye size={13} />}
                          {level.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDeleteLevel(level)}
                          className="px-3 py-2 text-xs font-semibold rounded-full border border-patron-gray-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-patron-gray-300 p-5 text-sm font-semibold text-patron-gray-500 hover:border-patron-green-400 hover:text-patron-green-700 min-h-[10rem]"
                  >
                    <Plus size={16} /> Add another level
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RECOVERY */}
          {activeTab === "recovery" && (
            <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-6 sm:p-8">
              {loadingRecovery ? (
                <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
              ) : recovery.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-patron-gray-100 text-patron-gray-500 flex items-center justify-center mx-auto mb-4">
                    <Users size={20} />
                  </div>
                  <h3 className="font-bold text-patron-black">Nothing to recover right now.</h3>
                  <p className="text-sm text-patron-gray-500 mt-1">
                    Cancelled memberships and refund requests will show up here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-patron-gray-100">
                  {recovery.map((item) => (
                    <div key={item.subscriptionId} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-patron-black truncate">{item.memberDisplayName}</p>
                          <p className="text-xs text-patron-gray-500">
                            {item.levelName} · Rs {item.amount?.toLocaleString()} ·{" "}
                            {item.cancelledAt && new Date(item.cancelledAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })}
                          </p>
                          {item.cancelReason && (
                            <p className="text-xs text-patron-gray-500 mt-1 italic">"{item.cancelReason}"</p>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            item.refundStatus === "REQUESTED"
                              ? "bg-patron-orange-50 text-patron-orange-700"
                              : item.refundStatus === "APPROVED"
                              ? "bg-patron-green-50 text-patron-green-700"
                              : item.refundStatus === "REFUNDED"
                              ? "bg-patron-green-600 text-white"
                              : item.refundStatus === "DENIED"
                              ? "bg-red-50 text-red-600"
                              : "bg-patron-gray-100 text-patron-gray-500"
                          }`}
                        >
                          {item.refundStatus === "REQUESTED"
                            ? "Refund requested"
                            : item.refundStatus === "REFUNDED"
                            ? "Refund paid"
                            : item.refundStatus === "NONE"
                            ? "Cancelled"
                            : item.refundStatus}
                        </span>
                      </div>
                      {item.refundAmount != null && (
                        <p className="text-xs text-patron-gray-600 mt-2">
                          Refund: <span className="font-bold text-patron-black">Rs {item.refundAmount.toLocaleString()}</span> via{" "}
                          {item.refundMethod === "KHALTI" ? "Khalti" : "eSewa"}
                          {item.refundPhone && ` · ${item.refundPhone}`}
                        </p>
                      )}
                      {item.refundStatus === "REFUNDED" && (
                        <p className="text-xs text-patron-gray-500 mt-1">
                          Paid {item.refundPaidAt && new Date(item.refundPaidAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })}
                          {item.refundReference && ` · Ref: ${item.refundReference}`}
                        </p>
                      )}
                      {item.refundStatus === "REQUESTED" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleResolveRefund(item, true)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-patron-green-600 text-white hover:bg-patron-green-700"
                          >
                            Approve refund
                          </button>
                          <button
                            onClick={() => handleResolveRefund(item, false)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-full border border-patron-gray-200 text-patron-gray-700 hover:bg-patron-gray-50"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                      {item.refundStatus === "APPROVED" && (
                        <div className="mt-3">
                          <button
                            onClick={() => openConfirmPaymentModal(item)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-patron-black text-white hover:bg-patron-gray-800"
                          >
                            Mark refund as paid
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                <h2 className="font-bold text-patron-black mb-1">Payout method</h2>
                <p className="text-sm text-patron-gray-500 mb-3">
                  Members can only join published levels once a payout method is connected.
                </p>
                <button
                  onClick={() => navigate("/payment-setup")}
                  className="px-5 py-2 bg-patron-black text-patron-white text-sm font-semibold rounded-xl hover:bg-patron-gray-800"
                >
                  Manage payout method
                </button>
              </div>

              <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                <h2 className="font-bold text-patron-black mb-1">How billing works</h2>
                <p className="text-sm text-patron-gray-500">
                  Members pay eSewa or Khalti directly for each billing period. Since there's no automatic
                  recurring charge, a membership stays active until its period ends or the member cancels —
                  there's nothing to "auto-renew" behind the scenes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <LevelFormModal
        isOpen={modalOpen}
        level={editingLevel}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLevel}
      />

      {payingRefundFor && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setPayingRefundFor(null)}
        >
          <div className="bg-patron-white w-full max-w-sm rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-patron-black">Mark refund as paid</h2>
              <button
                onClick={() => setPayingRefundFor(null)}
                className="p-1.5 rounded-lg hover:bg-patron-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-patron-gray-500">
              Confirm you sent Rs {payingRefundFor.refundAmount?.toLocaleString()} to{" "}
              {payingRefundFor.memberDisplayName}
              {payingRefundFor.refundPhone && ` (${payingRefundFor.refundPhone})`}.
            </p>

            <div>
              <p className="text-xs font-medium text-patron-gray-500 mb-2 uppercase tracking-wider">
                Sent via
              </p>
              <PaymentMethodPicker value={refundPayMethod} onChange={setRefundPayMethod} />
            </div>

            <div>
              <label className="text-xs font-medium text-patron-gray-500">
                {refundPayMethod === "KHALTI" ? "Khalti" : "eSewa"} transaction reference
              </label>
              <input
                autoFocus
                value={refundPayReference}
                onChange={(e) => setRefundPayReference(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirmRefundPayment()}
                placeholder="e.g. 000AWEO"
                className="mt-1 w-full px-3 py-2.5 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPayingRefundFor(null)}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-xl border border-patron-gray-200 hover:bg-patron-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefundPayment}
                disabled={!refundPayReference.trim() || confirmingPayment}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-xl bg-patron-green-600 text-white hover:bg-patron-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as paid
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Memberships;
