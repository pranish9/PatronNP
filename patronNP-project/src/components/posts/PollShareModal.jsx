import { useEffect, useState } from "react";
import { X, Copy, Check as CheckIcon } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";

import { openModal, closeModal } from "../../utils/jqueryModal";

const OVERLAY_ID = "poll-share-modal-overlay";
const PANEL_ID = "poll-share-modal-panel";

const PollShareModal = ({ isOpen, onClose, url, question, options, voteCounts, totalVotes, myVote }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) openModal(OVERLAY_ID, PANEL_ID);
    else closeModal(OVERLAY_ID, PANEL_ID);
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(question)}`;

  return (
    <div
      id={OVERLAY_ID}
      className="patron-modal-overlay fixed inset-0 z-[200] hidden items-center justify-center bg-black/50 p-3 sm:p-4"
    >
      <div
        id={PANEL_ID}
        className="patron-modal-panel bg-patron-white w-full max-w-sm rounded-2xl shadow-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-patron-black">Share with your friends 🎉</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-patron-gray-100 shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="bg-purple-100 rounded-2xl p-5 space-y-3">
          <p className="font-bold text-patron-black text-center">{question}</p>
          <div className="space-y-2">
            {(options || []).map((opt, i) => {
              const count = voteCounts?.[i] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const selected = myVote === i;
              return (
                <div key={i} className="relative flex items-center gap-2 bg-white/70 rounded-full overflow-hidden h-8">
                  <div
                    className="absolute inset-y-0 left-0 bg-purple-400/70"
                    style={{ width: `${Math.max(pct, 6)}%` }}
                  />
                  <span
                    className={`relative ml-1.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      selected ? "bg-purple-600 border-purple-600" : "border-purple-300 bg-white"
                    }`}
                  >
                    {selected && <CheckIcon size={10} className="text-white" />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 bg-patron-gray-100 text-patron-black px-4 py-2.5 rounded-full text-sm font-medium hover:bg-patron-gray-200"
          >
            {copied ? <CheckIcon size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={tweetHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-patron-black text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-patron-gray-800"
          >
            <FaXTwitter size={14} />
            Tweet this
          </a>
        </div>
      </div>
    </div>
  );
};

export default PollShareModal;
