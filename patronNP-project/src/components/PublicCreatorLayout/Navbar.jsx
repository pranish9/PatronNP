import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Share2,
  Plus,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { getAuthUser } from "../../utils/auth";

const Navbar = ({ username, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const authUser = getAuthUser(); // decoded JWT user
  const token = localStorage.getItem("accessToken");

  // -------------------------
  // USER STATE LOGIC
  // -------------------------

  let userState = "visitor";

  if (token && authUser) {
    if (authUser.username === username) {
      userState = "creator"; // owner
    } else {
      userState = "logged-in"; // supporter
    }
  }

  // close dropdown outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="w-full h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" className="w-8 h-8" />
        <span className="font-bold">{username}</span>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex gap-6 text-sm">

        <a href={`/${username}`} className="font-medium">
          Home
        </a>

        {userState === "creator" && (
          <>
            <a href="/dashboard">Dashboard</a>
            <a href="/posts">Posts</a>
            <a href="/analytics">Analytics</a>
          </>
        )}

        {userState === "logged-in" && (
          <>
            <a href="/explore">Explore</a>
            <a href="/support">Support</a>
          </>
        )}

        {userState === "visitor" && (
          <>
            <a href="/explore">Explore</a>
            <a href="/login">Login</a>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* VISITOR */}
        {userState === "visitor" && (
          <button className="px-4 py-2 bg-black text-white rounded-full">
            Login
          </button>
        )}

        {/* LOGGED IN SUPPORTER */}
        {userState === "logged-in" && (
          <>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-full">
              <Share2 size={16} />
              Share
            </button>

            <button className="px-4 py-2 bg-pink-600 text-white rounded-full">
              Support
            </button>
          </>
        )}

        {/* CREATOR OWNER */}
        {userState === "creator" && (
          <>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-full">
              <Share2 size={16} />
              Share
            </button>

            <button className="border px-4 py-2 rounded-full">
              Edit Page
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-1">
              <Plus size={16} />
              Create
            </button>
          </>
        )}

        {/* MENU */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen(!open)}>
            <Menu />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-xl">

              {userState === "creator" && (
                <>
                  <a className="block px-4 py-2 hover:bg-gray-100" href="/dashboard">
                    Dashboard
                  </a>
                  <a className="block px-4 py-2 hover:bg-gray-100" href={`/${username}/edit`}>
                    Edit Page
                  </a>
                </>
              )}

              {userState !== "visitor" && (
                <>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}

              {userState === "visitor" && (
                <a className="block px-4 py-2 hover:bg-gray-100" href="/login">
                  Login
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;