const PaymentMethodPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => onChange("ESEWA")}
      className={`flex items-center justify-center py-3 px-3 rounded-xl border-2 transition-all ${
        value === "ESEWA"
          ? "border-patron-green-600 bg-patron-green-50 shadow-sm"
          : "border-patron-gray-200 hover:border-patron-green-300"
      }`}
    >
      <img src="/esewa-logo.webp" alt="eSewa" className="h-6 sm:h-7 w-auto" />
    </button>
    <button
      type="button"
      onClick={() => onChange("KHALTI")}
      className={`flex items-center justify-center py-3 px-3 rounded-xl border-2 transition-all ${
        value === "KHALTI"
          ? "border-violet-600 bg-violet-50 shadow-sm"
          : "border-patron-gray-200 hover:border-violet-300"
      }`}
    >
      <img src="/khalti-logo.jpg" alt="Khalti" className="h-6 sm:h-7 w-auto" />
    </button>
  </div>
);

export default PaymentMethodPicker;
