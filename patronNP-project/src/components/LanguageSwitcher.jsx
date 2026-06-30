import { Globe } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

const LanguageSwitcher = ({ className = "" }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const isNepali = currentLanguage === "ne";

  return (
    <button
      type="button"
      onClick={() => changeLanguage(isNepali ? "en" : "ne")}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-medium rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0 ${className}`}
      aria-label="Toggle language"
    >
      <Globe size={14} />
      {isNepali ? "EN" : "नेपाली"}
    </button>
  );
};

export default LanguageSwitcher;
