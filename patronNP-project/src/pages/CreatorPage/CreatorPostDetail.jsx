import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Lock,
  Globe,
  Pencil,
  Save,
  X,
  Headphones,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import { getPostById } from "../../data/creatorMockData";

const CreatorPostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { username, creator, loading, notFound, isOwner, loggedIn } = useCreatorPage();

  const initialPost = getPostById(username, postId);
  const [post, setPost] = useState(initialPost);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialPost?.likes ?? 0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialPost?.comments ?? []);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: initialPost?.title ?? "",
    content: initialPost?.content ?? "",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Post not found</h1>
        <Link to={`/${username}/posts`} className="text-violet-600 text-sm mt-2 inline-block">
          Back to posts
        </Link>
      </div>
    );
  }

  const isLocked = post.category === "membership" && !isOwner;

  const handleLike = () => {
    if (!loggedIn) {
      toast.error("Log in to like this post");
      return;
    }
    setLiked(!liked);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  const handleComment = () => {
    if (!loggedIn) {
      toast.error("Log in to comment");
      return;
    }
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        user: "you",
        text: comment.trim(),
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setComment("");
    toast.success("Comment added");
  };

  const handleSaveEdit = () => {
    setPost({ ...post, title: editForm.title, content: editForm.content });
    setIsEditing(false);
    toast.success("Post updated");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <button
        onClick={() => navigate(`/${username}/posts`)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to posts
      </button>

      <article className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                post.category === "membership"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {post.category === "membership" ? (
                <><Lock size={10} /> Members only</>
              ) : (
                <><Globe size={10} /> Public</>
              )}
            </span>

            {isOwner && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}

            {isOwner && isEditing && (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={16} />
                </button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Save size={14} />
                  Save
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full text-xl sm:text-2xl font-bold border border-slate-200 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{post.title}</h1>
          )}

          <p className="text-xs text-slate-400 mt-2">
            {new Date(post.date).toLocaleDateString("en-NP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {creator?.displayName || username}
          </p>
        </div>

        {isLocked ? (
          <div className="mx-5 sm:mx-8 mb-6 p-8 sm:p-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-center text-white">
            <Lock className="mx-auto mb-3 opacity-80" size={32} />
            <p className="font-semibold text-lg">Members-only content</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">
              Join {creator?.displayName}&apos;s membership to read this post
            </p>
            <Link to={`/${username}/membership`}>
              <Button className="rounded-full">Become a member</Button>
            </Link>
          </div>
        ) : (
          <div className="px-5 sm:px-8 pb-6">
            {isEditing ? (
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                rows={6}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            )}

            {post.audioUrl && (
              <div className="mt-6 p-4 bg-violet-50 rounded-2xl border border-violet-100">
                <div className="flex items-center gap-2 mb-3 text-violet-700 font-medium text-sm">
                  <Headphones size={16} />
                  Listen to audio
                </div>
                <audio controls className="w-full" src={post.audioUrl}>
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}
          </div>
        )}

        {!isLocked && (
          <>
            <div className="px-5 sm:px-8 py-4 border-t border-slate-100 flex items-center gap-5">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  liked ? "text-pink-500" : "text-slate-500 hover:text-pink-500"
                }`}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                {likes}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <MessageCircle size={18} />
                {comments.length}
              </span>
            </div>

            <div className="px-5 sm:px-8 py-5 border-t border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-semibold mb-4">Comments</h3>

              {comments.length === 0 ? (
                <p className="text-sm text-slate-400 mb-4">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl p-3 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600">@{c.user}</p>
                      <p className="text-sm text-slate-700 mt-0.5">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {loggedIn ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  />
                  <Button size="sm" onClick={handleComment} className="sm:shrink-0">
                    Comment
                  </Button>
                </div>
              ) : (
                <Link to="/signin" state={{ from: `/${username}/posts/${postId}` }}>
                  <Button variant="outline" size="sm">
                    Log in to comment
                  </Button>
                </Link>
              )}
            </div>
          </>
        )}
      </article>
    </div>
  );
};

export default CreatorPostDetail;
