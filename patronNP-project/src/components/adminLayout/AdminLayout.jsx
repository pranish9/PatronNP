import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";

import useAuthStore from "../../stores/authStore";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-patron-gray-100">
      <nav className="sticky top-0 z-10 bg-patron-black text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-patron-green-400" />
            <span className="font-bold">PatronNP Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-patron-gray-300 hover:text-white"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
