import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Share2,
  LogOut,
  X,
  Coffee,
  LayoutDashboard,
  FileText,
  Crown,
  ShoppingBag,
} from "lucide-react";
import { getAuthUser } from "../../utils/auth";

const Navbar = ({ username, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const authUser = getAuthUser();
  const token = localStorage.getItem("accessToken");

  let userState = "visitor";
  if (token && authUser) {
    userState = authUser.username === username ? "creator" : "logged-in";
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [username, location.pathname]);

  const handleShare = async () => {
    const url = `${window.location.origin}/${username}`;
    if (navigator.share) {
      await navigator.share({ title: `@${username}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const base = `/${username}`;

  const navLinks = [
    { to: base, label: "Home", icon: Coffee, show: true, exact: true },
    { to: `${base}/posts`, label: "Posts", icon: FileText, show: true },
    { to: `${base}/membership`, label: "Membership", icon: Crown, show: true },
    { to: `${base}/shop`, label: "Shop", icon: ShoppingBag, show: true },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: userState === "creator" },
    { to: "/explore-creator", label: "Explore", icon: null, show: userState !== "creator" },
  ];

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to || location.pathname === `/@${username}`;
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 gap-2">
        {/* Left */}
        <Link to={base} className="flex items-center gap-2 min-w-0 shrink">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Coffee size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
            @{username}
          </span>
        </Link>

        {/* Center — tablet & desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks
            .filter((l) => l.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to, link.exact)
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-600 hover:text-violet-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {userState === "visitor" && (
            <Link
              to="/signin"
              className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-slate-800 transition-colors"
            >
              Log in
            </Link>
          )}

          {userState === "logged-in" && (
            <>
              <button
                onClick={handleShare}
                className="hidden sm:flex items-center gap-1 border border-slate-200 px-2.5 py-1.5 rounded-full text-xs sm:text-sm hover:bg-slate-50"
              >
                <Share2 size={14} />
                Share
              </button>
              <Link
                to={`${base}/membership`}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs sm:text-sm font-medium rounded-full hover:opacity-90"
              >
                Support
              </Link>
            </>
          )}

          {userState === "creator" && (
            <>
              <button
                onClick={handleShare}
                className="hidden sm:flex items-center gap-1 border border-slate-200 px-2.5 py-1.5 rounded-full text-xs sm:text-sm hover:bg-slate-50"
              >
                <Share2 size={14} />
                Share
              </button>
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-violet-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-violet-700"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            aria-label="Menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl border border-slate-200 rounded-xl py-1">
                {userState !== "visitor" ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="block px-4 py-2.5 text-sm hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / tablet nav */}
      {mobileNavOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-3 py-2 grid grid-cols-2 sm:grid-cols-4 gap-1">
          {navLinks
            .filter((l) => l.show && l.to.startsWith("/"))
            .slice(0, 4)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileNavOpen(false)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium ${
                  isActive(link.to, link.exact)
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-600"
                }`}
              >
                {link.icon && <link.icon size={18} />}
                {link.label}
              </Link>
            ))}

          <div className="col-span-2 sm:col-span-4 border-t border-slate-100 pt-2 mt-1 flex gap-2">
            {userState === "visitor" && (
              <Link
                to="/signin"
                className="flex-1 text-center py-2 text-sm font-medium text-violet-600"
                onClick={() => setMobileNavOpen(false)}
              >
                Log in
              </Link>
            )}
            {userState !== "visitor" && (
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onLogout?.();
                }}
                className="flex-1 text-center py-2 text-sm font-medium text-red-600"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
