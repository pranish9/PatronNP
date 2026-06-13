const PaymentMethodPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => onChange("ESEWA")}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
        value === "ESEWA"
          ? "border-green-500 bg-green-50 text-green-700"
          : "border-slate-200 hover:border-slate-300 text-slate-600"
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center font-bold">
        e
      </span>
      eSewa
    </button>
    <button
      type="button"
      onClick={() => onChange("KHALTI")}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
        value === "KHALTI"
          ? "border-purple-500 bg-purple-50 text-purple-700"
          : "border-slate-200 hover:border-slate-300 text-slate-600"
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
        K
      </span>
      Khalti
    </button>
  </div>
);

export default PaymentMethodPicker;
