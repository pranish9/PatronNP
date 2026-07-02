import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import postService from "../../services/postService";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
];

const GRADIENTS = [
  "from-patron-green-400 to-patron-green-600",
  "from-patron-orange-400 to-patron-orange-600",
  "from-patron-green-500 to-patron-orange-400",
  "from-patron-orange-500 to-patron-green-500",
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const PostCard = ({ post, username }) => {
  const gradient = GRADIENTS[post.id % GRADIENTS.length];
  const thumbnail = post.images?.[0];

  return (
    <Link
      to={`/${username}/posts/${post.id}`}
      className="rounded-2xl overflow-hidden border border-patron-gray-200 hover:shadow-md transition-shadow bg-patron-white"
    >
      {thumbnail ? (
        <img src={thumbnail} alt="" className="w-full aspect-square object-cover" />
      ) : (
        <div className={`w-full aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center p-4`}>
          <span className="text-white font-semibold text-center line-clamp-3">{post.title}</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-patron-black truncate">{post.title || "Untitled"}</h3>
        <p className="text-xs text-patron-gray-400 mt-0.5">{formatDate(post.createdAt)}</p>
      </div>
    </Link>
  );
};

const CreatorPosts = () => {
  const { username, loading, notFound } = useCreatorPage();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!username) return;
    postService
      .getPublicPosts(username, filter)
      .then(({ data }) => setPosts(data))
      .catch(() => setPosts([]));
  }, [username, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  const filtered = posts.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-patron-black">Posts</h1>
        <div className="flex items-center gap-2">
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
            className="w-9 h-9 rounded-full bg-patron-gray-100 flex items-center justify-center text-patron-gray-500 hover:text-patron-black"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-patron-green-600 text-white"
                : "bg-patron-gray-100 text-patron-gray-600 hover:bg-patron-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-patron-white rounded-2xl border border-patron-gray-200 py-16 text-center text-patron-gray-400 text-sm">
          No posts yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} username={username} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorPosts;
