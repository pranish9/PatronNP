import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Image, Headphones, Vote, MoreHorizontal } from "lucide-react";
import $ from "jquery";

const CreateMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      $("#create-menu-dropdown").stop().slideDown(200);
    } else {
      $("#create-menu-dropdown").stop().slideUp(200);
    }
  }, [open]);

  const options = [
    { label: "Post", icon: FileText, href: "/posts/new/post" },
    { label: "Album", icon: Image, href: "/posts/new/album" },
    { label: "Audio", icon: Headphones, href: "/posts/new/audio" },
    { label: "Poll", icon: Vote, href: "/posts/new/poll" },
    { label: "Manage posts", icon: MoreHorizontal, href: "/posts" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 sm:py-2 bg-patron-green-600 hover:bg-patron-green-700 text-white text-xs sm:text-sm font-medium rounded-full transition-colors"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Create</span>
      </button>

      <div
        id="create-menu-dropdown"
        className="hidden absolute right-0 mt-2 w-48 bg-patron-white border border-patron-gray-200 rounded-xl shadow-xl py-1 z-50"
      >
        {options.map((opt) => (
          <Link
            key={opt.label}
            to={opt.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-patron-gray-700 hover:bg-patron-green-50 hover:text-patron-green-800"
          >
            <opt.icon size={16} />
            {opt.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CreateMenu;
