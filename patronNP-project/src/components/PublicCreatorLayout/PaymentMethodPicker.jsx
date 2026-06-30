const EsewaLogo = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" aria-hidden="true">
    <circle cx="16" cy="16" r="16" fill="#60BB46" />
    <path
      d="M9 16.5c0-4.1 3.1-7 7.3-7 2.6 0 4.6 1 5.9 2.6l-2.3 2.1c-.8-1-1.9-1.6-3.5-1.6-2.3 0-3.9 1.7-3.9 3.9s1.6 3.9 3.9 3.9c1.7 0 2.9-.7 3.6-1.9l2.4 1.9c-1.3 1.9-3.4 3.1-6 3.1-4.2 0-7.4-2.9-7.4-7Z"
      fill="#fff"
    />
  </svg>
);

const KhaltiLogo = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" aria-hidden="true">
    <circle cx="16" cy="16" r="16" fill="#5C2D91" />
    <path d="M11 8h3v16h-3V8Zm3 8 5.5-6h3.7L17 16l6.2 8h-3.8L14 16Z" fill="#fff" />
  </svg>
);

const PaymentMethodPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => onChange("ESEWA")}
      className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border-2 font-semibold text-sm transition-all ${
        value === "ESEWA"
          ? "border-patron-green-600 bg-patron-green-50 text-patron-green-800 shadow-sm"
          : "border-patron-gray-200 hover:border-patron-green-300 text-patron-gray-600"
      }`}
    >
      <EsewaLogo />
      <span className="truncate">eSewa</span>
    </button>
    <button
      type="button"
      onClick={() => onChange("KHALTI")}
      className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border-2 font-semibold text-sm transition-all ${
        value === "KHALTI"
          ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
          : "border-patron-gray-200 hover:border-violet-300 text-patron-gray-600"
      }`}
    >
      <KhaltiLogo />
      <span className="truncate">Khalti</span>
    </button>
  </div>
);

export default PaymentMethodPicker;
