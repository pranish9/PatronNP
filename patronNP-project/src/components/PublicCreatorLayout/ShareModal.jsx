import { useEffect, useState } from "react";
import { X, Mail, QrCode, Copy, Check } from "lucide-react";
import { FaXTwitter, FaFacebook } from "react-icons/fa6";
import toast from "react-hot-toast";

import { openModal, closeModal } from "../../utils/jqueryModal";

const OVERLAY_ID = "share-page-modal-overlay";
const PANEL_ID = "share-page-modal-panel";

const ShareModal = ({ isOpen, onClose, url, title }) => {
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
      key: "twitter",
      label: "Twitter",
      icon: <FaXTwitter size={16} />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <FaFacebook size={16} className="text-[#1877F2]" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "email",
      label: "Email",
      icon: <Mail size={16} />,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
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
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-patron-black">Share {title}'s page</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-patron-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((opt) => (
              <a
                key={opt.key}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-patron-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-patron-gray-50"
              >
                {opt.icon}
                {opt.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium hover:bg-patron-gray-50 ${
                showQr ? "border-2 border-patron-black" : "border border-patron-gray-200"
              }`}
            >
              <QrCode size={16} />
              QR code
            </button>
          </div>

          {showQr && (
            <div className="flex justify-center py-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}`}
                alt="QR code"
                width={180}
                height={180}
                className="rounded-lg border border-patron-gray-200"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-patron-gray-500 mb-2">Share page link</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={url}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 border border-patron-green-200 rounded-full px-4 py-2 text-sm bg-patron-green-50 text-patron-gray-700 truncate"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 bg-patron-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-patron-green-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
