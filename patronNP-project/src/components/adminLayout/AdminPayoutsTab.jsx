import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "REQUESTED", label: "Requested" },
  { id: "PAID", label: "Paid" },
  { id: "REJECTED", label: "Rejected" },
];

const STATUS_BADGE = {
  REQUESTED: "bg-patron-orange-50 text-patron-orange-700",
  PAID: "bg-patron-green-50 text-patron-green-700",
  REJECTED: "bg-patron-gray-200 text-patron-gray-600",
};

const fmt = (n) => `Rs ${Math.round(n || 0).toLocaleString()}`;

const AdminPayoutsTab = () => {
  const [statusFilter, setStatusFilter] = useState("REQUESTED");
  const [page, setPage] = useState(0);
  const [payouts, setPayouts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.searchPayouts(statusFilter, page, 20);
      setPayouts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const markPaid = async (payout) => {
    const reference = window.prompt(
      `Enter the eSewa/Khalti transaction reference for sending ${fmt(payout.amount)} to ${payout.payoutPhone}:`
    );
    if (reference === null) return;
    if (!reference.trim()) {
      toast.error("A reference is required");
      return;
    }
    try {
      await adminService.markPayoutPaid(payout.id, reference.trim());
      toast.success(`Marked ${payout.creatorUsername}'s payout as paid`);
      loadPayouts();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to mark payout as paid");
    }
  };

  const reject = async (payout) => {
    const reason = window.prompt(`Reason for rejecting ${payout.creatorUsername}'s payout request (optional):`);
    if (reason === null) return;
    try {
      await adminService.rejectPayout(payout.id, reason.trim());
      toast.success(`Rejected ${payout.creatorUsername}'s payout request`);
      loadPayouts();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to reject payout");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-patron-gray-200/60 rounded-full p-1 w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setStatusFilter(f.id);
              setPage(0);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.id
                ? "bg-patron-white text-patron-black shadow-sm"
                : "text-patron-gray-500 hover:text-patron-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">Loading...</div>
        ) : payouts.length === 0 ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">No payouts here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                  <th className="px-5 py-3 font-semibold">Creator</th>
                  <th className="px-5 py-3 font-semibold text-right">Amount</th>
                  <th className="px-5 py-3 font-semibold">Payout to</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Requested</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-patron-gray-100">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-medium text-patron-black">{p.creatorUsername}</td>
                    <td className="px-5 py-3 text-right font-semibold text-patron-black">{fmt(p.amount)}</td>
                    <td className="px-5 py-3 text-patron-gray-600">
                      {p.provider === "KHALTI" ? "Khalti" : "eSewa"} · {p.payoutPhone}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[p.status] || ""}`}>
                        {p.status}
                      </span>
                      {p.status === "PAID" && p.reference && (
                        <p className="text-xs text-patron-gray-400 mt-0.5">Ref: {p.reference}</p>
                      )}
                      {p.status === "REJECTED" && p.rejectionReason && (
                        <p className="text-xs text-patron-gray-400 mt-0.5">{p.rejectionReason}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-patron-gray-500 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      {p.status === "REQUESTED" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => markPaid(p)}
                            title="Mark paid"
                            className="p-1.5 rounded-lg text-patron-green-700 hover:bg-patron-green-50"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            onClick={() => reject(p)}
                            title="Reject"
                            className="p-1.5 rounded-lg text-patron-orange-700 hover:bg-patron-orange-50"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-patron-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-sm font-medium text-patron-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs text-patron-gray-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-sm font-medium text-patron-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayoutsTab;
