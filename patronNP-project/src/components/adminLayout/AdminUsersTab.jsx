import { useCallback, useEffect, useState } from "react";
import { Search, Eye, Ban, PauseCircle, PlayCircle } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";
import useDebounce from "../../utils/useDebounce";
import CreatorDetailModal from "./CreatorDetailModal";

const STATUS_BADGE = {
  ACTIVE: "bg-patron-green-50 text-patron-green-700",
  SUSPENDED: "bg-patron-orange-50 text-patron-orange-700",
  BANNED: "bg-patron-black text-white",
  DELETED: "bg-patron-gray-200 text-patron-gray-600",
};

const AdminUsersTab = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [joinedAfter, setJoinedAfter] = useState("");
  const [joinedBefore, setJoinedBefore] = useState("");

  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailUserId, setDetailUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.searchUsers({
        search: debouncedSearch,
        role,
        status,
        joinedAfter,
        joinedBefore,
        page,
        size: 20,
      });
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, role, status, joinedAfter, joinedBefore, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, role, status, joinedAfter, joinedBefore]);

  const changeStatus = async (user, newStatus, confirmMessage) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    try {
      const res = await adminService.updateUserStatus(user.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
      toast.success(`${user.username} is now ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-patron-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username or email"
            className="pl-8 pr-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 w-56"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
        >
          <option value="">All roles</option>
          <option value="CREATOR">Creator</option>
          <option value="ADMIN">Admin</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>

        <div className="flex items-center gap-1.5 text-sm text-patron-gray-500">
          Joined
          <input
            type="date"
            value={joinedAfter}
            onChange={(e) => setJoinedAfter(e.target.value)}
            className="px-2.5 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
          to
          <input
            type="date"
            value={joinedBefore}
            onChange={(e) => setJoinedBefore(e.target.value)}
            className="px-2.5 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
        </div>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-patron-gray-400 text-sm">No accounts match these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-patron-gray-400 uppercase border-b border-patron-gray-100">
                  <th className="px-5 py-3 font-semibold">Account</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-patron-gray-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-patron-black">{u.username}</p>
                      <p className="text-xs text-patron-gray-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 text-patron-gray-600">{u.role}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[u.status] || ""}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-patron-gray-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.role === "CREATOR" && (
                          <button
                            onClick={() => setDetailUserId(u.id)}
                            title="View details"
                            className="p-1.5 rounded-lg text-patron-gray-500 hover:bg-patron-gray-100"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        {u.role !== "ADMIN" && (
                          <>
                            {u.status !== "ACTIVE" && (
                              <button
                                onClick={() => changeStatus(u, "ACTIVE")}
                                title="Reactivate"
                                className="p-1.5 rounded-lg text-patron-green-700 hover:bg-patron-green-50"
                              >
                                <PlayCircle size={15} />
                              </button>
                            )}
                            {u.status !== "SUSPENDED" && u.status !== "BANNED" && (
                              <button
                                onClick={() => changeStatus(u, "SUSPENDED", `Suspend ${u.username}?`)}
                                title="Suspend"
                                className="p-1.5 rounded-lg text-patron-orange-700 hover:bg-patron-orange-50"
                              >
                                <PauseCircle size={15} />
                              </button>
                            )}
                            {u.status !== "BANNED" && (
                              <button
                                onClick={() => changeStatus(u, "BANNED", `Ban ${u.username}? This blocks them from logging in.`)}
                                title="Ban"
                                className="p-1.5 rounded-lg text-white bg-patron-black hover:bg-patron-gray-800"
                              >
                                <Ban size={15} />
                              </button>
                            )}
                          </>
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

      <CreatorDetailModal userId={detailUserId} onClose={() => setDetailUserId(null)} />
    </div>
  );
};

export default AdminUsersTab;
