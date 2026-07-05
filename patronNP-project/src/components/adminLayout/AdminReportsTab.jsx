import { useCallback, useEffect, useState } from "react";
import { Trash2, XCircle, Undo2 } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "DISMISSED", label: "Dismissed" },
];

const TYPE_FILTERS = [
  { id: "", label: "All types" },
  { id: "POST", label: "Posts" },
  { id: "COMMENT", label: "Comments" },
  { id: "PRODUCT", label: "Products" },
];

const STATUS_BADGE = {
  PENDING: "bg-patron-orange-50 text-patron-orange-700",
  RESOLVED: "bg-patron-black text-white",
  DISMISSED: "bg-patron-gray-200 text-patron-gray-600",
};

const AdminReportsTab = () => {
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [directType, setDirectType] = useState("POST");
  const [directId, setDirectId] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.searchReports(statusFilter, typeFilter, page, 20);
      setReports(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, page]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const removeContent = async (report) => {
    if (!window.confirm(`Remove this ${report.contentType.toLowerCase()} from the platform?`)) return;
    const note = window.prompt("Optional note (why this is being removed):") || "";
    try {
      await adminService.removeReportedContent(report.id, note);
      toast.success("Content removed");
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to remove content");
    }
  };

  const dismiss = async (report) => {
    const note = window.prompt("Optional note (why this report is being dismissed):") || "";
    try {
      await adminService.dismissReport(report.id, note);
      toast.success("Report dismissed");
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to dismiss report");
    }
  };

  const handleDirectAction = async (action) => {
    if (!directId.trim() || Number.isNaN(Number(directId))) {
      toast.error("Enter a valid content id");
      return;
    }
    if (
      action === "remove" &&
      !window.confirm(`Remove ${directType.toLowerCase()} #${directId} directly? This isn't tied to any report.`)
    )
      return;
    try {
      if (action === "remove") {
        await adminService.removeContent(directType, Number(directId));
        toast.success("Content removed");
      } else {
        await adminService.restoreContent(directType, Number(directId));
        toast.success("Content restored");
      }
      setDirectId("");
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Action failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-4 sm:p-5">
        <h2 className="font-bold text-patron-black text-sm mb-3">Direct moderation</h2>
        <p className="text-xs text-patron-gray-500 mb-3">
          Take content down (or restore it) without waiting for a report — useful when you spot something yourself.
          Comments can be removed but not restored once gone.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={directType}
            onChange={(e) => setDirectType(e.target.value)}
            className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          >
            <option value="POST">Post</option>
            <option value="COMMENT">Comment</option>
            <option value="PRODUCT">Product</option>
          </select>
          <input
            value={directId}
            onChange={(e) => setDirectId(e.target.value)}
            placeholder="Content id"
            className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 w-32"
          />
          <button
            onClick={() => handleDirectAction("remove")}
            className="px-3 py-2 text-sm font-medium rounded-xl bg-patron-black text-white hover:bg-patron-gray-800"
          >
            Remove
          </button>
          <button
            onClick={() => handleDirectAction("restore")}
            disabled={directType === "COMMENT"}
            className="px-3 py-2 text-sm font-medium rounded-xl border border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Restore
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
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

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
        >
          {TYPE_FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">No reports here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                  <th className="px-5 py-3 font-semibold">Content</th>
                  <th className="px-5 py-3 font-semibold">Reported by</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-patron-gray-100">
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 max-w-[240px]">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-patron-gray-100 text-patron-gray-500 mb-1">
                        {r.contentType}
                      </span>
                      <p className="text-patron-black truncate" title={r.contentPreview}>
                        {r.contentPreview}
                      </p>
                      {r.contentCreatorUsername && (
                        <p className="text-xs text-patron-gray-400">by {r.contentCreatorUsername}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-patron-gray-600">{r.reporterUsername}</td>
                    <td className="px-5 py-3 text-patron-gray-600 max-w-[200px] truncate" title={r.reason}>
                      {r.reason || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[r.status] || ""}`}>
                        {r.status}
                      </span>
                      {r.status !== "PENDING" && r.resolutionNote && (
                        <p className="text-xs text-patron-gray-400 mt-0.5">{r.resolutionNote}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {r.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => removeContent(r)}
                            title="Remove content"
                            className="p-1.5 rounded-lg text-white bg-patron-black hover:bg-patron-gray-800"
                          >
                            <Trash2 size={15} />
                          </button>
                          <button
                            onClick={() => dismiss(r)}
                            title="Dismiss report"
                            className="p-1.5 rounded-lg text-patron-gray-500 hover:bg-patron-gray-100"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      )}
                      {r.status === "RESOLVED" && r.contentType !== "COMMENT" && (
                        <button
                          onClick={async () => {
                            try {
                              await adminService.restoreContent(r.contentType, r.contentId);
                              toast.success("Content restored");
                              loadReports();
                            } catch (err) {
                              toast.error(err.response?.data?.message || err.response?.data || "Failed to restore");
                            }
                          }}
                          title="Restore content"
                          className="p-1.5 rounded-lg text-patron-green-700 hover:bg-patron-green-50 float-right"
                        >
                          <Undo2 size={15} />
                        </button>
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

export default AdminReportsTab;
