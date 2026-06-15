import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Share2,
  LogOut,
  X,
  LayoutDashboard,
  FileText,
  Crown,
  ShoppingBag,
  Home,
  Pencil,
  Users,
} from "lucide-react";
import { getAuthUser } from "../../utils/auth";
import { useCreatorPage } from "../../context/CreatorPageContext";
import SupportButton from "../creatorLayout/RightSidebar";
import CreateMenu from "./CreateMenu";

const Navbar = ({ username, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const authUser = getAuthUser();
  const token = localStorage.getItem("accessToken");

  const {
    displayCreator,
    loading,
    isOwner,
    setEditModalOpen,
  } = useCreatorPage();

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
      await navigator.share({ title: displayCreator?.displayName || username, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  const base = `/${username}`;
  const avatarUrl =
    displayCreator?.profilePictureUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayCreator?.displayName || username
    )}&background=16a34a&color=fff&size=64`;

  const navLinks = [
    { to: base, label: "Home", icon: Home, show: true, exact: true },
    { to: `${base}/posts`, label: "Posts", icon: FileText, show: true },
    { to: `${base}/membership`, label: "Membership", icon: Crown, show: true },
    { to: `${base}/shop`, label: "Shop", icon: ShoppingBag, show: true },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: userState === "creator",
    },
  ];

  const isActive = (to, exact) => {
    if (exact)
      return location.pathname === to || location.pathname === `/@${username}`;
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-patron-white/95 backdrop-blur-md border-b border-patron-gray-200">
      <div className="max-w-6xl mx-auto min-h-14 sm:min-h-16 flex flex-wrap sm:flex-nowrap items-center justify-between px-3 sm:px-6 gap-2 py-2 sm:py-0">
        {/* Left — creator identity from backend */}
        <Link
          to={base}
          className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none max-w-[55%] sm:max-w-none"
        >
          {!loading && (
            <img
              src={avatarUrl}
              alt=""
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-patron-green-200 shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base text-patron-black truncate">
              {loading ? username : displayCreator?.displayName || username}
            </p>
            <p className="text-[10px] sm:text-xs text-patron-gray-500 flex items-center gap-1 truncate">
              <Users size={10} />
              {displayCreator?.supporterCount ?? 0} supporters
            </p>
          </div>
        </Link>

        {/* Center — desktop */}
        <div className="hidden lg:flex items-center gap-1 order-3 lg:order-2">
          {navLinks
            .filter((l) => l.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.to, link.exact)
                    ? "bg-patron-green-100 text-patron-green-800"
                    : "text-patron-gray-600 hover:text-patron-green-700 hover:bg-patron-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 order-2 sm:order-3 shrink-0">
          {userState === "visitor" && (
            <Link
              to="/signin"
              className="hidden xs:inline-flex px-3 py-1.5 bg-patron-black text-patron-white text-xs sm:text-sm font-medium rounded-full hover:bg-patron-gray-800"
            >
              Log in
            </Link>
          )}

          {userState === "creator" && (
            <>
              <button
                onClick={() => setEditModalOpen(true)}
                className="hidden sm:flex items-center gap-1 border border-patron-gray-200 px-2.5 py-1.5 rounded-full text-xs sm:text-sm hover:bg-patron-gray-50 text-patron-gray-700"
              >
                <Pencil size={14} />
                Edit page
              </button>
              <CreateMenu username={username} />
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-patron-green-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-patron-green-700"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            </>
          )}

          {(userState === "logged-in" || userState === "visitor") && (
            <>
              <button
                onClick={handleShare}
                className="hidden sm:flex items-center gap-1 border border-patron-gray-200 px-2.5 py-1.5 rounded-full text-xs hover:bg-patron-gray-50"
              >
                <Share2 size={14} />
              </button>
              <SupportButton size="sm" />
            </>
          )}

          {userState === "creator" && (
            <button
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1 border border-patron-gray-200 px-2.5 py-1.5 rounded-full text-xs hover:bg-patron-gray-50"
            >
              <Share2 size={14} />
            </button>
          )}

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-patron-gray-100"
            aria-label="Menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-patron-gray-100"
            >
              <Menu size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-patron-white shadow-xl border border-patron-gray-200 rounded-xl py-1">
                {userState === "creator" && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setEditModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-patron-gray-50"
                  >
                    Edit page
                  </button>
                )}
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
                    className="block px-4 py-2.5 text-sm hover:bg-patron-gray-50"
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

      {mobileNavOpen && (
        <div className="lg:hidden border-t border-patron-gray-200 bg-patron-white px-3 py-2 grid grid-cols-2 sm:grid-cols-4 gap-1">
          {navLinks
            .filter((l) => l.show && !l.to.startsWith("/dashboard"))
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileNavOpen(false)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium ${
                  isActive(link.to, link.exact)
                    ? "bg-patron-green-100 text-patron-green-800"
                    : "text-patron-gray-600"
                }`}
              >
                {link.icon && <link.icon size={18} />}
                {link.label}
              </Link>
            ))}

          {userState === "creator" && (
            <button
              onClick={() => {
                setMobileNavOpen(false);
                setEditModalOpen(true);
              }}
              className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium text-patron-gray-600"
            >
              <Pencil size={18} />
              Edit page
            </button>
          )}

          <div className="col-span-2 sm:col-span-4 border-t border-patron-gray-100 pt-2 mt-1 flex gap-2">
            {userState === "visitor" && (
              <Link
                to="/signin"
                className="flex-1 text-center py-2 text-sm font-medium text-patron-green-700"
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
