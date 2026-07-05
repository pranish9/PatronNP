import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";

import useAuthStore from "../../stores/authStore";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-patron-gray-100 flex">
      {tabs && <AdminSidebar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />}

      <div className="flex-1 min-w-0">
        <nav className="sticky top-0 z-10 bg-patron-black text-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-2.5 lg:hidden">
              <ShieldCheck size={20} className="text-patron-green-400" />
              <span className="font-bold">PatronNP Admin</span>
            </div>
            <div className="hidden lg:block" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-patron-gray-300 hover:text-white"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>

          {tabs && (
            <div className="lg:hidden flex gap-1 overflow-x-auto px-4 sm:px-6 pb-3 -mt-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-patron-green-400 text-patron-black"
                      : "bg-white/10 text-patron-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
