const PaymentMethodPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => onChange("ESEWA")}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
        value === "ESEWA"
          ? "border-patron-green-600 bg-patron-green-50 text-patron-green-800"
          : "border-patron-gray-200 hover:border-patron-green-300 text-patron-gray-600"
      }`}
    >
      <span className="w-7 h-7 rounded-full bg-patron-green-600 text-white text-xs flex items-center justify-center font-bold">
        e
      </span>
      Support with eSewa
    </button>
    <button
      type="button"
      onClick={() => onChange("KHALTI")}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
        value === "KHALTI"
          ? "border-patron-orange-500 bg-patron-orange-50 text-patron-orange-800"
          : "border-patron-gray-200 hover:border-patron-orange-300 text-patron-gray-600"
      }`}
    >
      <span className="w-7 h-7 rounded-full bg-patron-orange-500 text-white text-xs flex items-center justify-center font-bold">
        K
      </span>
      Support with Khalti
    </button>
  </div>
);

export default PaymentMethodPicker;
