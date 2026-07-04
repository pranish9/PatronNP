import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  X,
  Lock,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Loader,
  Image,
  Music,
  Vote,
  Check,
} from "lucide-react";

import Layout from "../../components/creatorLayout/Layout";
import { searchCreators, getTopCreators, PAGE_SIZE } from "../../services/searchService";
import { getFollowing } from "../../services/followService";
import postService from "../../services/postService";
import useDebounce from "../../utils/useDebounce";
import useInfiniteScroll from "../../utils/useInfiniteScroll";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const FEED_TYPE_TAGS = {
  ALBUM: { label: "Album", icon: Image },
  AUDIO: { label: "Audio", icon: Music },
  POLL: { label: "Poll", icon: Vote },
};

const FeedPoll = ({ post }) => {
  const [myVote, setMyVote] = useState(post.myPollVote ?? null);
  const [counts, setCounts] = useState(post.pollVoteCounts || []);
  const [total, setTotal] = useState(post.pollTotalVotes || 0);

  const handleVote = async (optionIndex) => {
    const prevVote = myVote;
    const prevCounts = counts;
    const prevTotal = total;

    const nextCounts = [...counts];
    if (prevVote !== null && prevVote !== undefined) {
      nextCounts[prevVote] = Math.max(0, (nextCounts[prevVote] || 0) - 1);
    }
    nextCounts[optionIndex] = (nextCounts[optionIndex] || 0) + 1;
    setMyVote(optionIndex);
    setCounts(nextCounts);
    if (prevVote === null || prevVote === undefined) setTotal(prevTotal + 1);

    try {
      const { data } = await postService.votePoll(post.id, optionIndex);
      setMyVote(data.myPollVote ?? optionIndex);
      setCounts(data.pollVoteCounts || nextCounts);
      setTotal(data.pollTotalVotes ?? prevTotal);
    } catch {
      setMyVote(prevVote);
      setCounts(prevCounts);
      setTotal(prevTotal);
      toast.error("Failed to vote");
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {(post.pollOptions || []).map((opt, i) => {
        const count = counts[i] || 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const selected = myVote === i;
        return (
          <button
            key={i}
            onClick={() => handleVote(i)}
            className={`relative w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border overflow-hidden text-left transition-colors ${
              selected ? "border-patron-green-600" : "border-patron-gray-200 hover:border-patron-gray-300"
            }`}
          >
            <div
              className="absolute inset-y-0 left-0 bg-patron-green-100 transition-all"
              style={{ width: `${pct}%` }}
            />
            <span className="relative flex items-center gap-2 font-medium text-patron-black text-sm">
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
      <p className="text-xs text-patron-gray-500">
        {total} vote{total === 1 ? "" : "s"}
      </p>
    </div>
  );
};

const FeedPostCard = ({ post }) => {
  const typeTag = FEED_TYPE_TAGS[post.postType];
  const thumbnail = post.images?.[0] || post.content?.match(/<img[^>]+src="([^"]+)"/)?.[1] || null;
  const postUrl = `/${post.creatorUsername}/posts/${post.id}`;
  const avatarUrl =
    post.creatorProfilePictureUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.creatorUsername)}&background=16a34a&color=fff&size=64`;

  return (
    <div className="bg-patron-white rounded-2xl sm:rounded-3xl border border-patron-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <img src={avatarUrl} className="w-10 h-10 rounded-full object-cover shrink-0" alt={post.creatorUsername} />
        <div className="min-w-0 flex-1">
          <Link
            to={`/${post.creatorUsername}`}
            className="font-semibold text-sm sm:text-base hover:text-patron-green-700 block truncate"
          >
            @{post.creatorUsername}
          </Link>
          <p className="text-xs text-patron-gray-400">{formatDate(post.createdAt)}</p>
        </div>
        {typeTag && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-patron-gray-600 bg-patron-gray-100 px-2 py-1 rounded-full shrink-0">
            <typeTag.icon size={10} />
            {typeTag.label}
          </span>
        )}
      </div>

      {post.isLocked ? (
        <Link
          to={postUrl}
          className="block bg-gradient-to-br from-patron-black to-patron-black text-patron-white p-10 sm:p-14 text-center"
        >
          <Lock size={22} className="mx-auto mb-2 opacity-80" />
          <p className="font-medium">
            {post.visibility === "MEMBERS" ? "Members-only content" : "Followers-only content"}
          </p>
          <p className="text-patron-gray-400 text-xs mt-1">
            {post.visibility === "MEMBERS" ? "Support to unlock exclusive posts" : `Follow @${post.creatorUsername} to unlock this post`}
          </p>
        </Link>
      ) : (
        <div className="px-4 pb-2">
          <Link to={postUrl} className="block hover:opacity-80 transition-opacity">
            <h3 className="font-bold text-patron-black">{post.title || "Untitled"}</h3>
          </Link>

          {thumbnail && <img src={thumbnail} alt="" className="mt-2 w-full max-h-96 object-cover rounded-xl" />}

          {post.postType === "AUDIO" && post.audioUrl && (
            <audio src={post.audioUrl} controls className="w-full mt-3 h-10" />
          )}

          {post.postType === "POLL" && <FeedPoll post={post} />}
        </div>
      )}

      <div className="px-4 py-3 flex gap-5 text-patron-gray-500 text-sm border-t border-patron-gray-100">
        <Link to={postUrl} className="flex items-center gap-1.5 hover:text-pink-500">
          <Heart size={16} />
          {post.likeCount || 0}
        </Link>
        <Link to={postUrl} className="flex items-center gap-1.5 hover:text-patron-green-600">
          <MessageCircle size={16} />
          {post.commentCount || 0}
        </Link>
      </div>
    </div>
  );
};


const ExploreCreator = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 350);

  const runSearch = useCallback(async (query, pageToLoad) => {
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchCreators(query.trim(), pageToLoad, PAGE_SIZE);
      setResults((prev) => (pageToLoad === 0 ? data.content : [...prev, ...data.content]));
      setHasMore(!data.last);
      setPage(pageToLoad);
    } catch {
      if (pageToLoad === 0) setResults([]);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery, 0);
  }, [debouncedQuery, runSearch]);

  const loadMore = useCallback(() => {
    if (!isSearching) runSearch(debouncedQuery, page + 1);
  }, [debouncedQuery, page, isSearching, runSearch]);

  const sentinelRef = useInfiniteScroll({ hasMore, loading: isSearching, onLoadMore: loadMore });

  const [topCreators, setTopCreators] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    getTopCreators(0, 10)
      .then((data) => setTopCreators(data.content || []))
      .catch(() => setTopCreators([]))
      .finally(() => setLoadingTop(false));
  }, []);

  const [followingList, setFollowingList] = useState([]);
  const [followingPage, setFollowingPage] = useState(0);
  const [followingHasMore, setFollowingHasMore] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingLoaded, setFollowingLoaded] = useState(false);

  const loadFollowing = useCallback(async (pageToLoad) => {
    setFollowingLoading(true);
    try {
      const data = await getFollowing(pageToLoad, 10);
      setFollowingList((prev) => (pageToLoad === 0 ? data.content : [...prev, ...data.content]));
      setFollowingHasMore(!data.last);
      setFollowingPage(pageToLoad);
    } catch {
      if (pageToLoad === 0) setFollowingList([]);
      setFollowingHasMore(false);
    } finally {
      setFollowingLoading(false);
      setFollowingLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "following" && !followingLoaded) {
      loadFollowing(0);
    }
  }, [activeTab, followingLoaded, loadFollowing]);

  const loadMoreFollowing = useCallback(() => {
    if (!followingLoading) loadFollowing(followingPage + 1);
  }, [followingLoading, followingPage, loadFollowing]);

  const followingSentinelRef = useInfiniteScroll({
    hasMore: followingHasMore,
    loading: followingLoading,
    onLoadMore: loadMoreFollowing,
  });

  const [feedPosts, setFeedPosts] = useState([]);
  const [feedPage, setFeedPage] = useState(0);
  const [feedHasMore, setFeedHasMore] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedLoaded, setFeedLoaded] = useState(false);

  const loadFeed = useCallback(async (pageToLoad) => {
    setFeedLoading(true);
    try {
      const { data } = await postService.getFollowingFeed(pageToLoad, 10);
      setFeedPosts((prev) => (pageToLoad === 0 ? data.content : [...prev, ...data.content]));
      setFeedHasMore(!data.last);
      setFeedPage(pageToLoad);
    } catch {
      if (pageToLoad === 0) setFeedPosts([]);
      setFeedHasMore(false);
    } finally {
      setFeedLoading(false);
      setFeedLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "following" && !feedLoaded) {
      loadFeed(0);
    }
  }, [activeTab, feedLoaded, loadFeed]);

  const loadMoreFeed = useCallback(() => {
    if (!feedLoading) loadFeed(feedPage + 1);
  }, [feedLoading, feedPage, loadFeed]);

  const feedSentinelRef = useInfiniteScroll({
    hasMore: feedHasMore,
    loading: feedLoading,
    onLoadMore: loadMoreFeed,
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-patron-gray-50 via-patron-white to-patron-orange-50/30 text-patron-black">
        {/* Hero header */}
        <div className="border-b border-patron-gray-200 bg-patron-white/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-patron-green-700 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles size={14} />
                  Discover
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Explore creators
                </h1>
                <p className="text-patron-gray-500 text-sm sm:text-base mt-1">
                  Find and support amazing creators across Nepal
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 sm:gap-8 border-b border-patron-gray-200">
              {[
                { id: "explore", label: "Explore", icon: TrendingUp },
                { id: "following", label: "Following", icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 pb-3 text-sm sm:text-base font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === id
                      ? "text-patron-green-800 border-patron-green-700"
                      : "text-patron-gray-500 border-transparent hover:text-patron-black"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === "explore" && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-patron-gray-400 group-focus-within:text-patron-green-500 transition-colors"
                  size={20}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or username..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-patron-gray-200 bg-patron-white shadow-sm focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 focus:border-patron-green-500 transition-all text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-patron-gray-400 hover:text-patron-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {!searchQuery ? (
                <div className="bg-patron-white rounded-2xl sm:rounded-3xl shadow-sm border border-patron-gray-200 overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-patron-gray-100 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                      <TrendingUp size={20} className="text-patron-green-700" />
                      Top creators
                    </h2>
                    <span className="text-xs text-patron-gray-400 hidden sm:inline">
                      All-time by supporters
                    </span>
                  </div>

                  {loadingTop ? (
                    <div className="flex justify-center py-12">
                      <Loader size={24} className="animate-spin text-patron-green-500" />
                    </div>
                  ) : topCreators.length === 0 ? (
                    <div className="py-12 text-center text-patron-gray-500">
                      <TrendingUp className="mx-auto mb-3 opacity-40" size={32} />
                      <p>No creators to show yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-patron-gray-100">
                      {topCreators.map((c, i) => (
                        <Link
                          key={c.username}
                          to={`/${c.username}`}
                          className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-patron-orange-50/50 transition-colors group"
                        >
                          <span
                            className={`w-7 text-center text-sm font-bold shrink-0 ${
                              i === 0
                                ? "text-patron-orange-500"
                                : i === 1
                                ? "text-patron-gray-400"
                                : "text-patron-orange-600/70"
                            }`}
                          >
                            #{i + 1}
                          </span>

                          <img
                            src={c.profilePictureUrl || "https://placehold.co/48x48"}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-patron-white shadow-sm shrink-0"
                            alt={c.displayName || c.username}
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-patron-green-800 transition-colors">
                              {c.displayName || c.username}
                            </h3>
                            <p className="text-xs sm:text-sm text-patron-gray-500 truncate">
                              @{c.username}
                              {c.bio ? ` · ${c.bio}` : ""}
                            </p>
                          </div>

                          <div className="hidden sm:flex items-center gap-1 text-xs text-patron-gray-400 shrink-0">
                            <Heart size={12} className="text-patron-orange-400" />
                            {(c.supporterCount || 0).toLocaleString()}
                          </div>

                          <ChevronRight
                            size={18}
                            className="text-patron-gray-300 group-hover:text-patron-green-500 shrink-0 transition-colors"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-patron-white rounded-2xl sm:rounded-3xl shadow-sm border border-patron-gray-200 overflow-hidden">
                  {results.length > 0 ? (
                    <>
                      <div className="divide-y divide-patron-gray-100">
                        {results.map((r) => (
                          <div
                            key={r.username}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 hover:bg-patron-gray-50 transition-colors"
                          >
                            <Link
                              to={`/${r.username}`}
                              className="flex items-center gap-3 min-w-0 flex-1"
                            >
                              <img
                                src={r.profilePictureUrl || "https://placehold.co/44x44"}
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
                                alt={r.displayName || r.username}
                              />
                              <div className="min-w-0">
                                <h3 className="font-semibold truncate">
                                  {r.displayName || r.username}
                                </h3>
                                <p className="text-xs sm:text-sm text-patron-gray-500 truncate">
                                  @{r.username}
                                  {r.bio ? ` · ${r.bio}` : ""}
                                </p>
                              </div>
                            </Link>

                            <Link to={`/${r.username}`}>
                              <button className="w-full sm:w-auto px-5 py-2 text-sm font-medium border border-patron-gray-200 rounded-full hover:bg-patron-green-700 hover:text-patron-white hover:border-patron-green-700 transition-all">
                                View page
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                      {hasMore && <div ref={sentinelRef} className="h-8" />}
                      {isSearching && page > 0 && (
                        <div className="flex justify-center py-4">
                          <Loader size={18} className="animate-spin text-patron-green-500" />
                        </div>
                      )}
                    </>
                  ) : isSearching ? (
                    <div className="flex justify-center py-12">
                      <Loader size={24} className="animate-spin text-patron-green-500" />
                    </div>
                  ) : (
                    <div className="py-12 text-center text-patron-gray-500">
                      <Search className="mx-auto mb-3 opacity-40" size={32} />
                      <p>No creators match &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* Feed */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                {feedPosts.length > 0 ? (
                  <>
                    {feedPosts.map((post) => (
                      <FeedPostCard key={post.id} post={post} />
                    ))}
                    {feedHasMore && <div ref={feedSentinelRef} className="h-8" />}
                    {feedLoading && feedPage > 0 && (
                      <div className="flex justify-center py-4">
                        <Loader size={18} className="animate-spin text-patron-green-500" />
                      </div>
                    )}
                  </>
                ) : feedLoading ? (
                  <div className="bg-patron-white rounded-2xl sm:rounded-3xl border border-patron-gray-200 shadow-sm flex justify-center py-16">
                    <Loader size={24} className="animate-spin text-patron-green-500" />
                  </div>
                ) : followingList.length === 0 && followingLoaded ? (
                  <div className="bg-patron-white rounded-2xl sm:rounded-3xl border border-patron-gray-200 shadow-sm py-16 text-center text-patron-gray-500 px-6">
                    <Users className="mx-auto mb-3 opacity-40" size={32} />
                    <p className="font-medium">You're not following any creators yet</p>
                    <p className="text-sm text-patron-gray-400 mt-1">
                      Follow creators to see their posts here.
                    </p>
                  </div>
                ) : (
                  <div className="bg-patron-white rounded-2xl sm:rounded-3xl border border-patron-gray-200 shadow-sm py-16 text-center text-patron-gray-500 px-6">
                    <Sparkles className="mx-auto mb-3 opacity-40" size={32} />
                    <p className="font-medium">No posts yet</p>
                    <p className="text-sm text-patron-gray-400 mt-1">
                      Creators you follow haven't posted anything yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Following sidebar */}
              <div className="bg-patron-white rounded-2xl sm:rounded-3xl border border-patron-gray-200 shadow-sm p-4 sm:p-5">
                <h3 className="text-xs font-semibold text-patron-gray-400 uppercase tracking-wider mb-4">
                  Following
                </h3>

                {followingList.length === 0 && !followingLoading ? (
                  <p className="text-patron-gray-400 text-sm italic">Not following anyone yet</p>
                ) : (
                  <div className="space-y-1">
                    {followingList.map((f) => (
                      <Link
                        key={f.username}
                        to={`/${f.username}`}
                        className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-patron-green-50 transition-colors group"
                      >
                        <img
                          src={f.profilePictureUrl || "https://placehold.co/36x36"}
                          className="w-9 h-9 rounded-full object-cover"
                          alt={f.displayName || f.username}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm block truncate group-hover:text-patron-green-800">
                            {f.displayName || f.username}
                          </span>
                          <span className="text-xs text-patron-gray-400">
                            @{f.username}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-patron-gray-300 group-hover:text-patron-green-500 shrink-0"
                        />
                      </Link>
                    ))}
                    {followingHasMore && <div ref={followingSentinelRef} className="h-6" />}
                    {followingLoading && followingPage > 0 && (
                      <div className="flex justify-center py-2">
                        <Loader size={16} className="animate-spin text-patron-green-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default ExploreCreator;
