import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share as ShareIcon, MoreHorizontal, Lock, Music, Pin, ChevronLeft, ChevronRight, Check } from "lucide-react";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";

import { useCreatorPage } from "../../context/CreatorPageContext";
import UserNotFound from "./UserNotFound";
import postService from "../../services/postService";
import userService from "../../services/userService";
import ShareModal from "../../components/PublicCreatorLayout/ShareModal";
import PollShareModal from "../../components/posts/PollShareModal";
import { getAuthUser } from "../../utils/auth";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=16a34a&color=fff&size=64`;

const AlbumSlideshow = ({ images }) => {
  const [index, setIndex] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl overflow-hidden bg-patron-black">
        <img src={images[index]} alt="" className="w-full aspect-square sm:aspect-video object-contain" />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute top-3 right-3 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded-full">
              {index + 1}/{images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-patron-green-600" : "bg-patron-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CreatorPostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { username, creator, isOwner, loading, notFound, loggedIn } = useCreatorPage();
  const authUser = getAuthUser();

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [myPollVote, setMyPollVote] = useState(null);
  const [pollVoteCounts, setPollVoteCounts] = useState([]);
  const [pollTotalVotes, setPollTotalVotes] = useState(0);
  const [myProfilePictureUrl, setMyProfilePictureUrl] = useState(null);
  const commentBoxRef = useRef(null);

  useEffect(() => {
    if (!loggedIn || !authUser?.username) return;
    // The Edit Page picture (CreatorProfile) is what shows everywhere else the
    // viewer appears as a creator — not the plain account-settings picture.
    userService
      .getCreatorPage(authUser.username)
      .then(({ data }) => setMyProfilePictureUrl(data.profilePictureUrl || null))
      .catch(() => {});
  }, [loggedIn, authUser?.username]);

  useEffect(() => {
    if (!username || !postId) return;
    setPostLoading(true);
    postService
      .getPublicPost(username, postId)
      .then(({ data }) => {
        setPost(data);
        setLiked(data.likedByCurrentUser);
        setLikeCount(data.likeCount || 0);
        setMyPollVote(data.myPollVote ?? null);
        setPollVoteCounts(data.pollVoteCounts || []);
        setPollTotalVotes(data.pollTotalVotes || 0);
      })
      .catch(() => setPost(null))
      .finally(() => setPostLoading(false));

    postService
      .listComments(postId)
      .then(({ data }) => setComments(data))
      .catch(() => {});
  }, [username, postId]);

  if (loading || postLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <UserNotFound username={username} />;

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-patron-black">Post not found</h1>
        <Link to={`/${username}/posts`} className="text-patron-green-700 text-sm mt-2 inline-block">
          Back to posts
        </Link>
      </div>
    );
  }

  const postUrl = `${window.location.origin}/${username}/posts/${postId}`;

  const handleLike = async () => {
    if (!loggedIn) {
      navigate("/signin", { state: { from: `/${username}/posts/${postId}` } });
      return;
    }
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((n) => n + (nextLiked ? 1 : -1));
    try {
      await postService.toggleLike(postId);
    } catch {
      setLiked(!nextLiked);
      setLikeCount((n) => n + (nextLiked ? -1 : 1));
      toast.error("Failed to update like");
    }
  };

  const scrollToComments = () => {
    commentBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleAddComment = async () => {
    if (!loggedIn) {
      navigate("/signin", { state: { from: `/${username}/posts/${postId}` } });
      return;
    }
    if (!commentText.trim()) return;
    try {
      const { data } = await postService.addComment(postId, commentText.trim());
      setComments((prev) => [...prev, data]);
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleVote = async (optionIndex) => {
    if (!loggedIn) {
      navigate("/signin", { state: { from: `/${username}/posts/${postId}` } });
      return;
    }
    const prevVote = myPollVote;
    const prevCounts = pollVoteCounts;
    const prevTotal = pollTotalVotes;

    const nextCounts = [...pollVoteCounts];
    if (prevVote !== null && prevVote !== undefined) {
      nextCounts[prevVote] = Math.max(0, (nextCounts[prevVote] || 0) - 1);
    }
    nextCounts[optionIndex] = (nextCounts[optionIndex] || 0) + 1;
    setMyPollVote(optionIndex);
    setPollVoteCounts(nextCounts);
    if (prevVote === null || prevVote === undefined) setPollTotalVotes(prevTotal + 1);

    try {
      const { data } = await postService.votePoll(postId, optionIndex);
      setMyPollVote(data.myPollVote ?? optionIndex);
      setPollVoteCounts(data.pollVoteCounts || nextCounts);
      setPollTotalVotes(data.pollTotalVotes ?? prevTotal);
    } catch {
      setMyPollVote(prevVote);
      setPollVoteCounts(prevCounts);
      setPollTotalVotes(prevTotal);
      toast.error("Failed to vote");
    }
  };

  const handleDownloadResults = async () => {
    try {
      await postService.downloadPollResultsCsv(postId);
    } catch {
      toast.error("Failed to download results");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <nav className="text-sm text-patron-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to={`/${username}`} className="hover:text-patron-green-700">
          {creator?.displayName || username}
        </Link>
        <span>&gt;</span>
        <Link to={`/${username}/posts`} className="hover:text-patron-green-700">
          Posts
        </Link>
        <span>&gt;</span>
        <span className="text-patron-gray-600 truncate">{post.title}</span>
      </nav>

      {post.pinned && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-patron-green-700 bg-patron-green-100 px-2 py-1 rounded-full mb-2">
          <Pin size={10} />
          Pinned post
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-patron-black">{post.title}</h1>
      <p className="text-sm text-patron-gray-400 mt-1">{formatDate(post.createdAt)}</p>

      <div className="flex items-center gap-2 mt-4 pb-4 border-b border-patron-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
            liked
              ? "border-pink-200 bg-pink-50 text-pink-600"
              : "border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          {likeCount}
        </button>
        <button
          onClick={scrollToComments}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-patron-gray-200 text-sm font-medium text-patron-gray-600 hover:bg-patron-gray-50"
        >
          <MessageCircle size={16} />
          {comments.length}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-patron-gray-200 text-sm font-medium text-patron-gray-600 hover:bg-patron-gray-50"
        >
          <ShareIcon size={16} />
          Share
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-patron-gray-200 text-patron-gray-600 hover:bg-patron-gray-50">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {post.locked ? (
        <div className="mt-6 p-8 sm:p-12 bg-patron-black/40 rounded-2xl text-center text-white">
          <Lock className="mx-auto mb-3 opacity-80" size={32} />
          <p className="font-semibold text-lg">
            {post.visibility === "MEMBERS" ? "Members-only content" : "Followers-only content"}
          </p>
          <p className="text-patron-gray-300 text-sm mt-1">
            {post.visibility === "MEMBERS"
              ? `Support ${creator?.displayName || username} to see this post.`
              : `Follow ${creator?.displayName || username} to see this post.`}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {post.postType === "POST" && (
            <div
              className="text-patron-black leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-patron-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-patron-gray-600 [&_blockquote]:italic [&_code]:bg-patron-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_a]:text-patron-green-700 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 [&_iframe]:rounded-lg [&_iframe]:my-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content || "", {
                  ADD_TAGS: ["iframe"],
                  ADD_ATTR: ["allowfullscreen", "frameborder"],
                }),
              }}
            />
          )}

          {post.postType === "ALBUM" && (
            <div className="space-y-4">
              {post.caption && <p className="text-patron-black">{post.caption}</p>}
              <AlbumSlideshow images={post.images} />
            </div>
          )}

          {post.postType === "AUDIO" && (
            <div className="space-y-4">
              {post.caption && <p className="text-patron-black">{post.caption}</p>}
              <div className="flex items-center gap-3 bg-patron-gray-50 border border-patron-gray-200 rounded-2xl p-4">
                <div className="w-12 h-12 rounded-xl bg-patron-green-100 flex items-center justify-center text-patron-green-600 shrink-0">
                  <Music size={20} />
                </div>
                <audio src={post.audioUrl} controls className="flex-1 min-w-0" />
              </div>
            </div>
          )}

          {post.postType === "POLL" && (
            <div className="space-y-4">
              {post.caption && <p className="text-patron-black">{post.caption}</p>}
              <div className="space-y-2">
                {(post.pollOptions || []).map((opt, i) => {
                  const count = pollVoteCounts[i] || 0;
                  const pct = pollTotalVotes > 0 ? Math.round((count / pollTotalVotes) * 100) : 0;
                  const selected = myPollVote === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleVote(i)}
                      className={`relative w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border overflow-hidden text-left transition-colors ${
                        selected
                          ? "border-patron-green-600"
                          : "border-patron-gray-200 hover:border-patron-gray-300"
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-patron-green-100 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="relative flex items-center gap-2 font-medium text-patron-black">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selected ? "bg-patron-green-600 border-patron-green-600" : "border-patron-gray-300"
                          }`}
                        >
                          {selected && <Check size={10} className="text-white" />}
                        </span>
                        {opt}
                      </span>
                      <span className="relative text-sm font-semibold text-patron-gray-600 shrink-0">{pct}%</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-patron-gray-500">
                <span>
                  {pollTotalVotes} vote{pollTotalVotes === 1 ? "" : "s"}
                </span>
                {isOwner && (
                  <>
                    <span>•</span>
                    <button
                      onClick={handleDownloadResults}
                      className="text-patron-green-700 font-medium hover:underline"
                    >
                      Download result
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div ref={commentBoxRef} className="mt-8 pt-6 border-t border-patron-gray-100">
        <h3 className="text-sm font-bold text-patron-black mb-4">Comments</h3>

        {comments.length === 0 ? (
          <p className="text-sm text-patron-gray-400 mb-4">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-3 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <img
                  src={c.commenterProfilePictureUrl || avatarUrl(c.commenterDisplayName)}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="bg-patron-gray-50 rounded-xl px-3 py-2 flex-1 min-w-0">
                  <p className="text-xs font-semibold text-patron-black">{c.commenterDisplayName}</p>
                  <p className="text-sm text-patron-gray-700 mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-3">
          <img
            src={myProfilePictureUrl || avatarUrl(authUser?.username || "You")}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2.5 text-sm bg-patron-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-patron-green-600 text-white text-sm font-medium rounded-xl hover:bg-patron-green-700 shrink-0"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {post.postType === "POLL" ? (
        <PollShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          url={postUrl}
          question={post.title}
          options={post.pollOptions}
          voteCounts={pollVoteCounts}
          totalVotes={pollTotalVotes}
          myVote={myPollVote}
        />
      ) : (
        <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} url={postUrl} title={post.title} />
      )}
    </div>
  );
};

export default CreatorPostDetail;
