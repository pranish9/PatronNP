import { useEffect, useState } from "react";
import { X, QrCode, Copy, Check } from "lucide-react";
import { FaXTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";

import { openModal, closeModal } from "../../utils/jqueryModal";

const OVERLAY_ID = "post-live-modal-overlay";
const PANEL_ID = "post-live-modal-panel";

const PostLiveModal = ({ isOpen, onClose, url, title }) => {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) openModal(OVERLAY_ID, PANEL_ID);
    else closeModal(OVERLAY_ID, PANEL_ID);
    if (!isOpen) {
      setShowQr(false);
      setCopied(false);
    }
  }, [isOpen]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

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

  const shareOptions = [
    {
      key: "facebook",
      label: "Facebook",
      icon: <FaFacebook size={16} className="text-[#1877F2]" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <FaWhatsapp size={16} className="text-[#25D366]" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      key: "x",
      label: "X",
      icon: <FaXTwitter size={16} />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  return (
    <div
      id={OVERLAY_ID}
      className="patron-modal-overlay fixed inset-0 z-[200] hidden items-center justify-center bg-black/50 p-3 sm:p-4"
    >
      <div
        id={PANEL_ID}
        className="patron-modal-panel bg-patron-white w-full max-w-md rounded-2xl shadow-2xl"
      >
        <div className="px-4 sm:px-6 pt-5 pb-2 relative text-center">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 rounded-lg hover:bg-patron-gray-100"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-patron-black">Your post is live!</h2>
          <p className="text-sm text-patron-gray-500 mt-2">
            Share this post wherever your followers are.
            <br />
            Posts are the best way to make new supporters.
          </p>
        </div>

        <div className="px-4 sm:px-6 pb-5 pt-3 space-y-4">
          {showQr && (
            <div className="flex justify-center py-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUrl}`}
                alt="QR code"
                width={220}
                height={220}
                className="rounded-lg border border-patron-gray-200"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={url}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 border border-patron-gray-200 rounded-full px-4 py-2.5 text-sm bg-patron-gray-50 text-patron-gray-700 truncate"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 bg-patron-gray-100 text-patron-black px-4 py-2.5 rounded-full text-sm font-medium hover:bg-patron-gray-200"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-1">
            {shareOptions.map((opt) => (
              <a
                key={opt.key}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 text-xs font-medium text-patron-gray-600"
              >
                <span className="w-11 h-11 rounded-full bg-patron-gray-100 flex items-center justify-center">
                  {opt.icon}
                </span>
                {opt.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              className="flex flex-col items-center gap-1.5 text-xs font-medium text-patron-gray-600"
            >
              <span
                className={`w-11 h-11 rounded-full bg-patron-gray-100 flex items-center justify-center ${
                  showQr ? "ring-2 ring-patron-black" : ""
                }`}
              >
                <QrCode size={16} />
              </span>
              QR code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLiveModal;
