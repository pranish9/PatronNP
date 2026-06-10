import React, { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navigate = useNavigate();
  // const { logout } = useAuth();

  const handleLogout = () => {
    // logout(); // if using Auth Context

    localStorage.clear();
    sessionStorage.clear();

    navigate("/signin", { replace: true });
  };

  const notifications = [
    { id: 1, text: "New payment received!" },
    { id: 2, text: "Your profile is live." },
  ];

  const menuItems = [
    {
      name: "View my page",
      action: () => navigate("/profile"),
    },
    {
      name: "Dashboard",
      action: () => navigate("/dashboard"),
    },
    {
      name: "My account",
      action: () => navigate("/account"),
    },
    {
      name: "Logout",
      className: "text-rose-500",
      action: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1">
        <header className="sticky top-0 z-50 h-16 flex items-center justify-end px-4 gap-3 bg-gray-100">
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Bell size={20} />
            </button>

            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setIsNotificationsOpen(false)}
                />

                <div className="absolute top-14 right-0 w-72 bg-gray-100 rounded-xl shadow-lg border border-slate-200 z-[100] py-2">
                  <div className="px-5 py-2 text-xs font-semibold text-slate-400 uppercase">
                    Notifications
                  </div>

                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {notification.text}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 bg-slate-900 text-white rounded-full pl-1.5 pr-4 py-1.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                JD
              </div>

              <Menu size={18} className="text-slate-300" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] py-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsMenuOpen(false);
                        item.action?.();
                      }}
                      className={`w-full text-left px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${
                        item.className || "text-slate-700"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;