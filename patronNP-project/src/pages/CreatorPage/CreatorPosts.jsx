import { Link } from "react-router-dom";
import { FileText, Lock, Globe, Calendar, ChevronRight } from "lucide-react";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import { getCreatorPosts } from "../../data/creatorMockData";

const CreatorPosts = () => {
  const { username, creator, loading, notFound, isOwner } = useCreatorPage();
  const posts = getCreatorPosts(username);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  const publicPosts = posts.filter((p) => p.category === "public");
  const memberPosts = posts.filter((p) => p.category === "membership");

  const PostRow = ({ post }) => (
    <Link
      to={`/${username}/posts/${post.id}`}
      className="flex items-start gap-4 p-4 sm:p-5 hover:bg-patron-green-50/50 transition-colors group"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          post.category === "membership"
            ? "bg-patron-orange-100 text-patron-orange-700"
            : "bg-patron-green-100 text-patron-green-700"
        }`}
      >
        {post.category === "membership" ? <Lock size={18} /> : <Globe size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              post.category === "membership"
                ? "bg-patron-orange-100 text-patron-orange-700"
                : "bg-patron-green-100 text-patron-green-700"
            }`}
          >
            {post.category === "membership" ? "Members only" : "Public"}
          </span>
          {post.audioUrl && (
            <span className="text-[10px] text-patron-green-700 font-medium">Audio</span>
          )}
        </div>
        <h3 className="font-semibold text-patron-black group-hover:text-patron-green-800 transition-colors truncate">
          {post.title}
        </h3>
        <p className="text-sm text-patron-gray-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
        <p className="text-xs text-patron-gray-400 mt-1.5 flex items-center gap-1">
          <Calendar size={12} />
          {new Date(post.date).toLocaleDateString("en-NP", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <ChevronRight size={18} className="text-patron-gray-300 group-hover:text-patron-green-600 shrink-0 mt-2" />
    </Link>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-patron-black flex items-center gap-2">
          <FileText className="text-patron-green-600" size={28} />
          Posts
        </h1>
        <p className="text-patron-gray-500 text-sm sm:text-base mt-1">
          {isOwner
            ? "All your published posts"
            : `Posts by ${creator?.displayName || username}`}
        </p>
      </div>

      {publicPosts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-patron-gray-400 px-4 mb-2">
            Public
          </h2>
          <div className="bg-patron-white rounded-2xl border border-patron-gray-200/80 shadow-sm divide-y divide-patron-gray-100 overflow-hidden">
            {publicPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {memberPosts.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-patron-gray-400 px-4 mb-2">
            Paid membership
          </h2>
          <div className="bg-patron-white rounded-2xl border border-patron-gray-200/80 shadow-sm divide-y divide-patron-gray-100 overflow-hidden">
            {memberPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
          {!isOwner && (
            <p className="text-xs text-patron-gray-400 text-center mt-3">
              <Link to={`/${username}/membership`} className="text-patron-green-700 hover:underline">
                Become a member
              </Link>{" "}
              to unlock exclusive posts
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default CreatorPosts;
