import React from "react";
import { Menu, Share2, Plus, LogOut } from "lucide-react";

const Navbar = ({
  username,
  viewerRole = "VISITOR",
  onLogout,
  onShare,
  onEdit,
}) => {
  const isOwner = viewerRole === "OWNER";
  const isSupporter = viewerRole === "SUPPORTER";

  return (
    <nav className="h-16 flex justify-between items-center px-6 border-b bg-white">

      {/* LEFT */}
      <div className="font-bold text-lg">
        @{username}
      </div>

      {/* CENTER */}
      <div className="hidden md:flex gap-6 text-sm">

        <a href={`/${username}`}>Home</a>

        {!isOwner && (
          <a href="#support">Support</a>
        )}

        {isOwner && (
          <>
            <a href="/dashboard">Dashboard</a>
            <a href="/posts">Posts</a>
          </>
        )}

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* VISITOR */}
        {!isSupporter && !isOwner && (
          <button>Login</button>
        )}

        {/* SUPPORTER */}
        {isSupporter && (
          <>
            <button onClick={onShare}>
              <Share2 size={16} />
            </button>

            <button onClick={onLogout}>
              <LogOut size={16} />
            </button>
          </>
        )}

        {/* OWNER */}
        {isOwner && (
          <>
            <button onClick={onShare}>
              <Share2 size={16} /> Share
            </button>

            <button onClick={onEdit}>
              Edit Page
            </button>

            <button className="bg-green-500 text-white px-3 py-1 rounded">
              <Plus size={16} /> Create
            </button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;