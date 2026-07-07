import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Pin, Images, Music, BarChart2, Crown, Users } from "lucide-react";

import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import { SkeletonProfile } from "../../components/Skeleton";
import postService from "../../services/postService";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

// Album posts have their own images[]; a rich-text "post" only has inline <img> tags
// buried in its HTML content, so pull the first one out to use as the card thumbnail.
const firstContentImage = (html) => html?.match(/<img[^>]+src="([^"]+)"/)?.[1] || null;

const TYPE_TAGS = {
  ALBUM: { label: "Album", icon: Images },
  AUDIO: { label: "Audio", icon: Music },
  POLL: { label: "Poll", icon: BarChart2 },
};

const VISIBILITY_TAGS = {
  FOLLOWERS: { label: "Followers", icon: Users },
  MEMBERS: { label: "Members", icon: Crown },
};

const PostCard = ({ post, username, creatorAvatar }) => {
  const thumbnail = post.images?.[0] || firstContentImage(post.content) || creatorAvatar;
  const typeTag = TYPE_TAGS[post.postType];
  const visibilityTag = VISIBILITY_TAGS[post.visibility];

  return (
    <Link
      to={`/${username}/posts/${post.id}`}
      className="relative rounded-2xl overflow-hidden border border-patron-gray-200 hover:shadow-md transition-shadow bg-patron-white"
    >
      {post.pinned && (
        <span className="absolute top-2 left-2 z-10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
          <Pin size={10} />
          Pinned
        </span>
      )}
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
        {typeTag && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <typeTag.icon size={10} />
            {typeTag.label}
          </span>
        )}
        {visibilityTag && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-patron-green-700/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <visibilityTag.icon size={10} />
            {visibilityTag.label}
          </span>
        )}
      </div>
      <div className="relative w-full aspect-square">
        <img src={thumbnail} alt="" className="w-full h-full object-cover" />
        {post.locked && <div className="absolute inset-0 bg-patron-black/40" />}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-patron-black truncate">{post.title || "Untitled"}</h3>
        <p className="text-xs text-patron-gray-400 mt-0.5">{formatDate(post.createdAt)}</p>
      </div>
    </Link>
  );
};

const CreatorPosts = () => {
  const { username, displayCreator, loading, notFound } = useCreatorPage();
  const creatorAvatar =
    displayCreator?.profilePictureUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayCreator?.displayName || username)}&background=16a34a&color=fff&size=256`;
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
    return <SkeletonProfile />;
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
            <PostCard key={post.id} post={post} username={username} creatorAvatar={creatorAvatar} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorPosts;
