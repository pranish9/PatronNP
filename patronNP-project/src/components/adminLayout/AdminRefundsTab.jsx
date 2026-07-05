import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "REQUESTED", label: "Requested" },
  { id: "APPROVED", label: "Approved" },
  { id: "DENIED", label: "Denied" },
  { id: "REFUNDED", label: "Refunded" },
];

const STATUS_BADGE = {
  REQUESTED: "bg-patron-orange-50 text-patron-orange-700",
  APPROVED: "bg-patron-green-50 text-patron-green-700",
  DENIED: "bg-patron-gray-200 text-patron-gray-600",
  REFUNDED: "bg-patron-black text-white",
};

const fmt = (n) => `Rs ${Math.round(n || 0).toLocaleString()}`;

const AdminRefundsTab = () => {
  const [statusFilter, setStatusFilter] = useState("REQUESTED");
  const [page, setPage] = useState(0);
  const [refunds, setRefunds] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRefunds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.searchRefunds(statusFilter, page, 20);
      setRefunds(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  const decide = async (r, approve) => {
    const verb = approve ? "approve" : "deny";
    if (!window.confirm(`${approve ? "Approve" : "Deny"} the refund request from ${r.memberDisplayName}?`)) return;
    const reason = window.prompt(`Optional note to include in the email (${verb} reason):`) || "";
    try {
      await adminService.resolveRefund(r.subscriptionId, approve, reason);
      toast.success(`Refund ${approve ? "approved" : "denied"}`);
      loadRefunds();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to resolve refund");
    }
  };

  const markPaid = async (r) => {
    const reference = window.prompt(
      `Enter the eSewa/Khalti transaction reference for the ${fmt(r.refundAmount)} refund sent to ${r.refundPhone}:`
    );
    if (reference === null) return;
    if (!reference.trim()) {
      toast.error("A reference is required");
      return;
    }
    try {
      await adminService.confirmRefundPayment(r.subscriptionId, reference.trim(), r.refundMethod);
      toast.success("Refund marked as paid");
      loadRefunds();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to confirm refund payment");
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
        ) : refunds.length === 0 ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">No refund requests here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                  <th className="px-5 py-3 font-semibold">Creator</th>
                  <th className="px-5 py-3 font-semibold">Member</th>
                  <th className="px-5 py-3 font-semibold text-right">Refund</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-patron-gray-100">
                {refunds.map((r) => (
                  <tr key={r.subscriptionId}>
                    <td className="px-5 py-3 font-medium text-patron-black">{r.creatorUsername}</td>
                    <td className="px-5 py-3">
                      <p className="text-patron-black">{r.memberDisplayName}</p>
                      <p className="text-xs text-patron-gray-400">{r.levelName}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <p className="font-semibold text-patron-black">{fmt(r.refundAmount)}</p>
                      {r.refundPhone && (
                        <p className="text-xs text-patron-gray-400">
                          {r.refundMethod === "KHALTI" ? "Khalti" : "eSewa"} · {r.refundPhone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-patron-gray-600 max-w-[220px] truncate" title={r.cancelReason}>
                      {r.cancelReason || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[r.refundStatus] || ""}`}>
                        {r.refundStatus}
                      </span>
                      {r.refundStatus === "REFUNDED" && r.refundReference && (
                        <p className="text-xs text-patron-gray-400 mt-0.5">Ref: {r.refundReference}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.refundStatus === "REQUESTED" && (
                          <>
                            <button
                              onClick={() => decide(r, true)}
                              title="Approve"
                              className="p-1.5 rounded-lg text-patron-green-700 hover:bg-patron-green-50"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={() => decide(r, false)}
                              title="Deny"
                              className="p-1.5 rounded-lg text-patron-orange-700 hover:bg-patron-orange-50"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {r.refundStatus === "APPROVED" && (
                          <button
                            onClick={() => markPaid(r)}
                            title="Mark paid"
                            className="p-1.5 rounded-lg text-patron-green-700 hover:bg-patron-green-50"
                          >
                            <BadgeCheck size={16} />
                          </button>
                        )}
                      </div>
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

export default AdminRefundsTab;
