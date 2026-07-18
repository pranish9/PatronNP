import { Link } from "react-router-dom";
import { Moon, Sun, Globe, UserCircle, Wallet, ChevronRight } from "lucide-react";

import Layout from "../components/creatorLayout/Layout";
import useThemeStore from "../stores/themeStore";
import { useLanguage } from "../hooks/useLanguage";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ne", label: "नेपाली" },
  { code: "hi", label: "हिन्दी" },
];

const Settings = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <Layout>
      <div className="bg-patron-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-patron-black">Settings</h1>

          {/* Appearance */}
          <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
            <h2 className="font-bold text-patron-black mb-1">Appearance</h2>
            <p className="text-sm text-patron-gray-500 mb-4">Choose how PatronNP looks on this device.</p>
            <div className="flex gap-3">
              <button
                onClick={() => isDark && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  !isDark
                    ? "border-patron-black bg-patron-gray-50 text-patron-black"
                    : "border-patron-gray-200 text-patron-gray-500 hover:border-patron-gray-300"
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => !isDark && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? "border-patron-black bg-patron-gray-50 text-patron-black"
                    : "border-patron-gray-200 text-patron-gray-500 hover:border-patron-gray-300"
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
            <h2 className="font-bold text-patron-black mb-1 flex items-center gap-2">
              <Globe size={16} />
              Language
            </h2>
            <p className="text-sm text-patron-gray-500 mb-4">Applies across your dashboard and creator page.</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLanguage(l.code)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                    currentLanguage === l.code
                      ? "bg-patron-green-600 border-patron-green-600 text-white"
                      : "bg-patron-white border-patron-gray-200 text-patron-gray-700 hover:border-patron-gray-300"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Account shortcuts */}
          <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 overflow-hidden divide-y divide-patron-gray-100">
            <Link to="/account" className="flex items-center gap-3 px-5 py-4 hover:bg-patron-gray-50 transition-colors">
              <UserCircle size={18} className="text-patron-gray-500 shrink-0" />
              <span className="flex-1 text-sm font-semibold text-patron-black">Profile, password &amp; account</span>
              <ChevronRight size={16} className="text-patron-gray-400" />
            </Link>
            <Link to="/supporters" className="flex items-center gap-3 px-5 py-4 hover:bg-patron-gray-50 transition-colors">
              <Wallet size={18} className="text-patron-gray-500 shrink-0" />
              <span className="flex-1 text-sm font-semibold text-patron-black">Support page settings</span>
              <ChevronRight size={16} className="text-patron-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
