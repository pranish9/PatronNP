import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Home, LayoutDashboard, Search, Heart, Lock, ShoppingBag,
  PenTool, ChevronDown, ChevronUp, FileText, Image,
  Code, Settings as SettingsIcon, Menu, X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'View page', icon: LayoutDashboard, path: '/view-page' },
    { name: 'Explore creators', icon: Search, path: '/explore-creator' },
  ];

  const monetizeItems = [
    { name: 'Supporters', icon: Heart, path: '/supporters' },
    { name: 'Memberships', icon: Lock, path: '/memberships' },
    { name: 'Shop', icon: ShoppingBag, path: '/shop' },
  ];

  const publishItems = [
    { name: 'Posts', icon: FileText, path: '/posts' },
    { name: 'Gallery', icon: Image, path: '/gallery' },
  ];

  const settingsItems = [
    { name: 'Integrations', icon: Code, path: '/integrations' },
    { name: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  const NavItem = ({ item }) => {
    const isActive = activePath === item.path;

    return (
      <div
        onClick={() => {
          navigate(item.path);
          setIsMobileOpen(false);
        }}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
          isActive
            ? 'text-green-600 bg-green-50'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <item.icon size={20} />
        <span className="font-medium">{item.name}</span>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2.5 bg-white rounded-xl shadow-md border border-slate-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <div className="p-4 flex flex-col gap-6">

          {/* LOGO */}
          <div className="flex items-center gap-3 px-2">
            <img
              src="/android-chrome-192x192.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-lg text-gray-800">
              PatronNP
            </span>
          </div>

          {/* Main Nav */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Monetize */}
          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
              Monetize
            </h2>

            <div className="flex flex-col gap-1">
              {monetizeItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}

              {/* Publish */}
              <div
                onClick={() => setIsPublishOpen(!isPublishOpen)}
                className="flex items-center justify-between px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PenTool size={20} />
                  <span>Publish</span>
                </div>
                {isPublishOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>

              {isPublishOpen && (
                <div className="pl-8 flex flex-col gap-1 mt-1">
                  {publishItems.map((item) => (
                    <NavItem key={item.path} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
              Settings
            </h2>

            {settingsItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;