import { Heart } from "lucide-react";
import { useCreatorPage } from "../../context/CreatorPageContext";

/**
 * Reusable Support button — import into PublicCreatorLayout navbar.
 * Originally based on RightSidebar concept; opens SupportWidget modal.
 */
const SupportButton = ({ className = "", showLabel = true, size = "md" }) => {
  const { setSupportModalOpen, isOwner } = useCreatorPage();

  if (isOwner) return null;

  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-1.5 text-xs"
      : "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm";

  return (
    <button
      type="button"
      onClick={() => setSupportModalOpen(true)}
      className={`flex items-center gap-1.5 bg-patron-orange-500 hover:bg-patron-orange-600 text-white font-medium rounded-full transition-colors shadow-sm ${sizeClasses} ${className}`}
    >
      <Heart size={size === "sm" ? 14 : 16} fill="currentColor" />
      {showLabel && <span>Support</span>}
    </button>
  );
};

export default SupportButton;
export { SupportButton };
