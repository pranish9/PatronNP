import { useEffect, useState } from "react";
import { X } from "lucide-react";

const PromptModal = ({
  isOpen,
  title,
  label,
  placeholder,
  initialValue = "",
  confirmLabel = "Insert",
  onConfirm,
  onClose,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setValue(initialValue);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-patron-white w-full max-w-sm rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-patron-black">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-patron-gray-100">
            <X size={18} />
          </button>
        </div>

        <div>
          {label && <label className="text-xs font-medium text-patron-gray-500">{label}</label>}
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={placeholder}
            className="mt-1 w-full px-3 py-2.5 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-xl border border-patron-gray-200 hover:bg-patron-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-xl bg-patron-green-600 text-white hover:bg-patron-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
