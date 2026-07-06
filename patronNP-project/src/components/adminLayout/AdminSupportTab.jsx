import { useCallback, useEffect, useState } from "react";
import { Send, Megaphone } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "OPEN", label: "Open" },
  { id: "RESOLVED", label: "Resolved" },
];

const STATUS_BADGE = {
  OPEN: "bg-patron-orange-50 text-patron-orange-700",
  RESOLVED: "bg-patron-green-50 text-patron-green-700",
};

const AdminSupportTab = () => {
  // --- Broadcast ---
  const [audience, setAudience] = useState("CREATORS");
  const [emailsInput, setEmailsInput] = useState("");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    const emails = emailsInput
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (audience === "EMAILS" && emails.length === 0) {
      toast.error("Enter at least one email address");
      return;
    }
    if (!window.confirm(`Send "${broadcastSubject}" to ${audience === "CREATORS" ? "all active creators" : `${emails.length} email(s)`}?`))
      return;

    setSending(true);
    try {
      const res = await adminService.broadcast({
        audience,
        emails: audience === "EMAILS" ? emails : undefined,
        subject: broadcastSubject.trim(),
        message: broadcastMessage.trim(),
      });
      toast.success(`Sent to ${res.data.sent}/${res.data.recipientCount} recipients`);
      setBroadcastSubject("");
      setBroadcastMessage("");
      setEmailsInput("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  // --- Tickets ---
  const [statusFilter, setStatusFilter] = useState("OPEN");
  const [page, setPage] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.searchTickets(statusFilter, page, 20);
      setTickets(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const sendReply = async (ticket) => {
    if (!replyText.trim()) {
      toast.error("Reply can't be empty");
      return;
    }
    try {
      await adminService.replyToTicket(ticket.id, replyText.trim());
      toast.success("Reply sent");
      setReplyingId(null);
      setReplyText("");
      loadTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to send reply");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Megaphone size={18} className="text-patron-green-700" />
          <h2 className="font-bold text-patron-black">Broadcast</h2>
        </div>

        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
        >
          <option value="CREATORS">All active creators</option>
          <option value="EMAILS">Specific email addresses</option>
        </select>

        {audience === "EMAILS" && (
          <textarea
            value={emailsInput}
            onChange={(e) => setEmailsInput(e.target.value)}
            rows={2}
            placeholder="Comma or newline separated emails"
            className="w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 resize-none"
          />
        )}

        <input
          value={broadcastSubject}
          onChange={(e) => setBroadcastSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
        />
        <textarea
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          rows={4}
          placeholder="Message"
          className="w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 resize-none"
        />
        <button
          onClick={sendBroadcast}
          disabled={sending}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send broadcast"}
        </button>
      </div>

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
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-patron-gray-400 text-sm">No tickets here.</div>
          ) : (
            <div className="divide-y divide-patron-gray-100">
              {tickets.map((t) => (
                <div key={t.id} className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-patron-black">{t.subject}</p>
                      <p className="text-xs text-patron-gray-400">
                        {t.username} · {t.userEmail}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[t.status] || ""}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm text-patron-gray-600 mt-2">{t.message}</p>

                  {t.adminReply && (
                    <div className="mt-2 bg-patron-gray-100 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-patron-gray-600">Your reply</p>
                      <p className="text-xs text-patron-gray-600 mt-0.5">{t.adminReply}</p>
                    </div>
                  )}

                  {t.status === "OPEN" && (
                    <div className="mt-3">
                      {replyingId === t.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            autoFocus
                            placeholder="Write your reply..."
                            className="w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => sendReply(t)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white"
                            >
                              <Send size={14} />
                              Send reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingId(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1.5 text-sm font-medium rounded-xl border border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingId(t.id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-xl border border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
    </div>
  );
};

export default AdminSupportTab;
