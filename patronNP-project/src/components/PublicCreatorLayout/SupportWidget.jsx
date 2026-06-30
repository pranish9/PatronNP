import { useEffect, useState, useRef } from "react";
import {
  Heart,
  ImagePlus,
  Video,
  Lock,
  RefreshCw,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../Button";
import PaymentMethodPicker from "./PaymentMethodPicker";
import { openModal, closeModal } from "../../utils/jqueryModal";
import { useCreatorPage } from "../../context/CreatorPageContext";
import { initiateEsewaTip, redirectToEsewa } from "../../services/esewaService";
import { initiateKhaltiTip, redirectToKhalti } from "../../services/khaltiService";

const OVERLAY_ID = "support-modal-overlay";
const PANEL_ID = "support-modal-panel";

const SupportWidget = ({ isOpen, onClose }) => {
  const { username, displayCreator } = useCreatorPage();

  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [paying, setPaying] = useState(false);

  const photoRef = useRef(null);
  const videoRef = useRef(null);

  const unitPrice =
    displayCreator?.supportUnitPrice ||
    displayCreator?.defaultSupportAmount ||
    100;
  const unitLabel =
    displayCreator?.supportUnitLabel || displayCreator?.welcomeMessage || "tea";

  const totalAmount = customAmount
    ? parseInt(customAmount, 10)
    : unitPrice * quantity;

  useEffect(() => {
    if (isOpen) {
      openModal(OVERLAY_ID, PANEL_ID);
    } else {
      closeModal(OVERLAY_ID, PANEL_ID);
    }
  }, [isOpen]);

  const handlePay = async () => {
    if (!totalAmount || totalAmount < 10) {
      toast.error("Minimum amount is NPR 10");
      return;
    }

    setPaying(true);
    try {
      if (paymentMethod === "ESEWA") {
        const { formUrl, fields } = await initiateEsewaTip({
          creatorUsername: username,
          amount: totalAmount,
          supporterName,
          message,
          isPrivate,
          isMonthly,
        });
        redirectToEsewa({ formUrl, fields });
      } else {
        const { paymentUrl } = await initiateKhaltiTip({
          creatorUsername: username,
          amount: totalAmount,
          supporterName,
          message,
          isPrivate,
          isMonthly,
        });
        redirectToKhalti(paymentUrl);
      }
    } catch {
      toast.error("Payment failed. Please try again.");
      setPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id={OVERLAY_ID}
      className="patron-modal-overlay fixed inset-0 z-[200] hidden items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
    >
      <div
        id={PANEL_ID}
        className="patron-modal-panel bg-patron-white w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 bg-patron-white border-b border-patron-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-patron-black text-base sm:text-lg flex items-center gap-2">
            <Heart className="text-patron-orange-500" size={20} />
            Support {displayCreator?.displayName || username}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-patron-gray-100 data-close-modal"
            data-close-modal
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-sm text-patron-gray-600">
            Buy a {unitLabel} — NPR {unitPrice} each
          </p>

          <div className="flex gap-2">
            {[1, 3, 5].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuantity(q);
                  setCustomAmount("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  quantity === q && !customAmount
                    ? "bg-patron-green-600 text-white"
                    : "bg-patron-gray-100 text-patron-gray-700 hover:bg-patron-green-100"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <input
            type="number"
            min="10"
            placeholder="Custom amount (NPR)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />

          <input
            type="text"
            placeholder="Your name or @username (optional)"
            value={supporterName}
            onChange={(e) => setSupporterName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-patron-gray-200 rounded-full hover:bg-patron-gray-50"
            >
              <ImagePlus size={14} />
              Add a photo
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
            <button
              type="button"
              onClick={() => videoRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-patron-gray-200 rounded-full hover:bg-patron-gray-50"
            >
              <Video size={14} />
              Add video message
            </button>
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
          </div>

          {(photoFile || videoFile) && (
            <p className="text-xs text-patron-green-700">
              Attached: {[photoFile?.name, videoFile?.name].filter(Boolean).join(", ")}
            </p>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 accent-patron-green-600"
            />
            <span className="text-sm text-patron-gray-700 flex items-center gap-1">
              <Lock size={14} />
              Make this message private (creator only)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isMonthly}
              onChange={(e) => setIsMonthly(e.target.checked)}
              className="w-4 h-4 accent-patron-orange-500"
            />
            <span className="text-sm text-patron-gray-700 flex items-center gap-1">
              <RefreshCw size={14} />
              Make this monthly (recurring pledge)
            </span>
          </label>

          <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />

          <Button
            variant="accent"
            size="full"
            onClick={handlePay}
            isLoading={paying}
            className="rounded-xl py-3.5"
          >
            Pay NPR {totalAmount?.toLocaleString() || "—"}
            {isMonthly ? "/mo" : ""}
          </Button>
          <p className="text-xs text-center text-patron-gray-400">
            No account needed — pay securely with {paymentMethod === "ESEWA" ? "eSewa" : "Khalti"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportWidget;
