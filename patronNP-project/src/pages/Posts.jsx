import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Image, Headphones, Vote, Search, MoreHorizontal, Eye, Pencil, Pin, PinOff, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/creatorLayout/Layout";
import postService from "../services/postService";
import { VISIBILITY_OPTIONS } from "../components/posts/PostSidebar";

const CREATE_OPTIONS = [
  { type: "post", label: "Post", icon: FileText },
  { type: "album", label: "Album", icon: Image },
  { type: "audio", label: "Audio", icon: Headphones },
  { type: "poll", label: "Poll", icon: Vote },
];

const TABS = [
  { id: "PUBLISHED", label: "Published" },
  { id: "DRAFT", label: "Drafted" },
  { id: "SCHEDULED", label: "Scheduled" },
];

const TYPE_TAGS = {
  ALBUM: { label: "Album", icon: Image },
  AUDIO: { label: "Audio", icon: Headphones },
  POLL: { label: "Poll", icon: Vote },
};

const formatDate = (iso) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} at ${time}`;
};

const postTimestampLabel = (post) => {
  if (post.status === "SCHEDULED" && post.publishAt) return `Scheduled for ${formatDate(post.publishAt)}`;
  if (post.status === "DRAFT") return `Last saved ${formatDate(post.createdAt)}`;
  return `Posted at ${formatDate(post.createdAt)}`;
};

const PostRow = ({ post, onView, onEdit, onPin, onUnpin, onUnpublish, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const visibility = VISIBILITY_OPTIONS.find((v) => v.value === post.visibility) || VISIBILITY_OPTIONS[0];
  const viewable = post.status === "PUBLISHED";
  const typeTag = TYPE_TAGS[post.postType];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItem = (icon, label, onClick, danger) => (
    <button
      onClick={() => {
        setMenuOpen(false);
        onClick(post);
      }}
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-patron-gray-50 ${
        danger ? "text-red-600 hover:bg-red-50" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      onClick={() => viewable && onView(post)}
      className={`bg-patron-white rounded-2xl border border-patron-gray-200 p-5 ${
        viewable ? "cursor-pointer hover:border-patron-green-300 hover:shadow-sm transition-all" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-patron-gray-400 flex items-center gap-1.5">
          {postTimestampLabel(post)}
          {post.pinned && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-patron-green-700 bg-patron-green-100 px-1.5 py-0.5 rounded-full">
              <Pin size={10} />
              Pinned
            </span>
          )}
        </p>
        <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-patron-gray-100 text-patron-gray-500"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-patron-white border border-patron-gray-200 rounded-xl shadow-xl py-1 z-10">
              {viewable && menuItem(<Eye size={14} />, "View post", onView)}
              {menuItem(<Pencil size={14} />, "Edit", onEdit)}
              {viewable &&
                (post.pinned
                  ? menuItem(<PinOff size={14} />, "Unpin this post", onUnpin)
                  : menuItem(<Pin size={14} />, "Pin this post", onPin))}
              {viewable && menuItem(<EyeOff size={14} />, "Unpublish", onUnpublish)}
              {menuItem(<Trash2 size={14} />, "Delete", onDelete, true)}
            </div>
          )}
        </div>
      </div>

      <h3 className="font-bold text-patron-black mt-1 flex items-center gap-2">
        {post.title || "Untitled"}
        {typeTag && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-patron-gray-600 bg-patron-gray-100 px-1.5 py-0.5 rounded-full">
            <typeTag.icon size={10} />
            {typeTag.label}
          </span>
        )}
      </h3>

      <div className="border-t border-patron-gray-100 mt-4 pt-3 flex items-center justify-between text-sm text-patron-gray-500">
        <span className="flex items-center gap-1.5">
          <visibility.icon size={15} />
          {visibility.label}
        </span>
        <span className="flex items-center gap-4">
          <span>{post.likeCount || 0} Like{post.likeCount === 1 ? "" : "s"}</span>
          <span>{post.commentCount || 0} Comment{post.commentCount === 1 ? "" : "s"}</span>
        </span>
      </div>
    </div>
  );
};

const Posts = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  const [postsByStatus, setPostsByStatus] = useState({ PUBLISHED: [], DRAFT: [], SCHEDULED: [] });
  const [activeTab, setActiveTab] = useState("PUBLISHED");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const fetchAll = () => {
    Promise.all([
      postService.listPosts("PUBLISHED"),
      postService.listPosts("DRAFT"),
      postService.listPosts("SCHEDULED"),
    ])
      .then(([pub, draft, sched]) =>
        setPostsByStatus({ PUBLISHED: pub.data, DRAFT: draft.data, SCHEDULED: sched.data })
      )
      .catch(() => toast.error("Failed to load posts"));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const counts = {
    PUBLISHED: postsByStatus.PUBLISHED.length,
    DRAFT: postsByStatus.DRAFT.length,
    SCHEDULED: postsByStatus.SCHEDULED.length,
  };

  const filtered = postsByStatus[activeTab].filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (post) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await postService.deletePost(post.id);
      toast.success("Post deleted");
      fetchAll();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handlePin = async (post) => {
    try {
      await postService.pinPost(post.id);
      toast.success("Post pinned");
      fetchAll();
    } catch {
      toast.error("Failed to pin post");
    }
  };

  const handleUnpin = async (post) => {
    try {
      await postService.unpinPost(post.id);
      toast.success("Post unpinned");
      fetchAll();
    } catch {
      toast.error("Failed to unpin post");
    }
  };

  const handleUnpublish = async (post) => {
    if (!window.confirm("Unpublish this post? It will move back to Drafts.")) return;
    try {
      await postService.unpublishPost(post.id);
      toast.success("Post unpublished");
      fetchAll();
    } catch {
      toast.error("Failed to unpublish post");
    }
  };

  return (
    <Layout>
      <div className="bg-patron-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-patron-black">Create a new post</h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CREATE_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => navigate(`/posts/new/${opt.type}`)}
                className="flex flex-col items-center justify-center gap-2 bg-patron-white border border-patron-gray-200 rounded-2xl py-6 hover:shadow-md hover:border-patron-green-300 transition-all"
              >
                <opt.icon size={22} className="text-patron-black" />
                <span className="text-sm font-semibold text-patron-black">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-b border-patron-gray-200">
            <div className="flex gap-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "text-patron-black border-patron-black"
                      : "text-patron-gray-400 border-transparent hover:text-patron-gray-600"
                  }`}
                >
                  {tab.label}
                  {counts[tab.id] > 0 && <span className="text-xs">{counts[tab.id]}</span>}
                </button>
              ))}
            </div>
            <div className="pb-3 flex items-center gap-2">
              {searchOpen && (
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => !search && setSearchOpen(false)}
                  placeholder="Search posts"
                  className="text-sm outline-none border-b border-patron-gray-200 px-1 py-0.5 w-32 sm:w-48"
                />
              )}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="text-patron-gray-500 hover:text-patron-black"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-patron-white rounded-2xl border border-patron-gray-200 py-12 text-center text-patron-gray-400 text-sm">
                No {TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} posts yet.
              </div>
            ) : (
              filtered.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onView={(p) => navigate(`/${username}/posts/${p.id}`)}
                  onEdit={(p) => navigate(`/posts/edit/${p.id}`)}
                  onPin={handlePin}
                  onUnpin={handleUnpin}
                  onUnpublish={handleUnpublish}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Posts;
