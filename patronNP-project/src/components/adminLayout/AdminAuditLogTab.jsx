import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";
import useDebounce from "../../utils/useDebounce";

const AdminAuditLogTab = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const debouncedAdmin = useDebounce(adminUsername, 350);
  const [action, setAction] = useState("");
  const debouncedAction = useDebounce(action, 350);
  const [page, setPage] = useState(0);
  const [entries, setEntries] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.searchAuditLog(debouncedAdmin, debouncedAction, page, 25);
      setEntries(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }, [debouncedAdmin, debouncedAction, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [debouncedAdmin, debouncedAction]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={adminUsername}
          onChange={(e) => setAdminUsername(e.target.value)}
          placeholder="Filter by admin username"
          className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 w-56"
        />
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Filter by action, e.g. USER_STATUS_CHANGED"
          className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 w-72"
        />
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">No matching audit log entries.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                  <th className="px-5 py-3 font-semibold">When</th>
                  <th className="px-5 py-3 font-semibold">Admin</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-patron-gray-100">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3 text-patron-gray-500 whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString("en-NP", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-patron-black">{e.adminUsername}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-patron-gray-100 text-patron-gray-600">
                        {e.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-patron-gray-600">{e.details}</td>
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

export default AdminAuditLogTab;
