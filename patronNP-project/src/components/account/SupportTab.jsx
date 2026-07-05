import { useEffect, useState } from "react";
import { LifeBuoy } from "lucide-react";
import toast from "react-hot-toast";

import { submitTicket, getMyTickets } from "../../services/ticketService";

const STATUS_STYLE = {
  OPEN: "text-amber-600 bg-amber-50",
  RESOLVED: "text-emerald-600 bg-emerald-50",
};

const SupportTab = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getMyTickets(0, 20)
      .then((data) => setTickets(data.content || []))
      .catch(() => toast.error("Failed to load your tickets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSubmitting(true);
    try {
      await submitTicket(subject.trim(), message.trim());
      toast.success("Ticket submitted — we'll email you a reply");
      setSubject("");
      setMessage("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <LifeBuoy size={18} className="text-patron-green-700" />
          <h2 className="font-bold text-patron-black">Contact support</h2>
        </div>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-3 py-2.5 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Describe your issue..."
          className="w-full px-3 py-2.5 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit ticket"}
        </button>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h2 className="font-bold text-patron-black mb-3">Your tickets</h2>
        {loading ? (
          <div className="py-6 text-center text-sm text-patron-gray-400">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="py-6 text-center text-sm text-patron-gray-400">No support tickets yet.</div>
        ) : (
          <div className="divide-y divide-patron-gray-100">
            {tickets.map((t) => (
              <div key={t.id} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-patron-black">{t.subject}</p>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[t.status] || ""}`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-patron-gray-500 mt-1">{t.message}</p>
                {t.adminReply && (
                  <div className="mt-2 bg-patron-gray-100 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-patron-gray-600">Support reply</p>
                    <p className="text-xs text-patron-gray-600 mt-0.5">{t.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTab;
