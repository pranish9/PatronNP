import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

const CreatorFooter = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <footer className="border-t border-patron-gray-200 bg-patron-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-patron-gray-500">Language:</span>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                currentLanguage === "en"
                  ? "bg-patron-green-600 text-white"
                  : "bg-patron-gray-100 text-patron-gray-700 hover:bg-patron-green-100"
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("ne")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                currentLanguage === "ne"
                  ? "bg-patron-green-600 text-white"
                  : "bg-patron-gray-100 text-patron-gray-700 hover:bg-patron-green-100"
              }`}
            >
              नेपाली
            </button>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-patron-gray-600 hover:text-patron-green-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-patron-gray-600 hover:text-patron-green-700 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/report"
              className="text-patron-gray-600 hover:text-patron-orange-600 transition-colors"
            >
              Report
            </Link>
          </nav>
        </div>

        <p className="text-center text-xs text-patron-gray-400 mt-4">
          © {new Date().getFullYear()} PatronNP — Support creators in Nepal
        </p>
      </div>
    </footer>
  );
};

export default CreatorFooter;
