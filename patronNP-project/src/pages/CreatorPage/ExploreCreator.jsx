import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Lock,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Loader,
} from "lucide-react";

import Layout from "../../components/creatorLayout/Layout";
import { searchCreators, PAGE_SIZE } from "../../services/searchService";
import { getFollowing } from "../../services/followService";
import useDebounce from "../../utils/useDebounce";
import useInfiniteScroll from "../../utils/useInfiniteScroll";

const trendingCreators = [
  {
    id: 1,
    username: "simplepolitics",
    name: "Simple Politics",
    desc: "Helping people have better conversations about politics",
    avatar:
      "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=150&auto=format&fit=crop&q=60",
    supporters: 1240,
  },
  {
    id: 2,
    username: "cara",
    name: "Cara",
    desc: "Building a new platform for artists",
    avatar:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
    supporters: 892,
  },
  {
    id: 3,
    username: "beachtalk",
    name: "Beach Talk Radio",
    desc: "A dinky little podcast from the coast",
    avatar:
      "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=150&auto=format&fit=crop&q=60",
    supporters: 456,
  },
];


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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-violet-50/30 text-slate-900">
        {/* Hero header */}
        <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles size={14} />
                  Discover
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Explore creators
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-1">
                  Find and support amazing creators across Nepal
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 sm:gap-8 border-b border-slate-200">
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
                      ? "text-violet-700 border-violet-600"
                      : "text-slate-500 border-transparent hover:text-slate-800"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
                  size={20}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or username..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {!searchQuery ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                      <TrendingUp size={20} className="text-violet-600" />
                      Trending creators
                    </h2>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      Updated daily
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {trendingCreators.map((c, i) => (
                      <Link
                        key={c.id}
                        to={`/${c.username}`}
                        className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-violet-50/50 transition-colors group"
                      >
                        <span
                          className={`w-7 text-center text-sm font-bold shrink-0 ${
                            i === 0
                              ? "text-amber-500"
                              : i === 1
                              ? "text-slate-400"
                              : "text-amber-700/70"
                          }`}
                        >
                          #{i + 1}
                        </span>

                        <img
                          src={c.avatar}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                          alt={c.name}
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-violet-700 transition-colors">
                            {c.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 truncate">
                            @{c.username} · {c.desc}
                          </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 shrink-0">
                          <Heart size={12} className="text-pink-400" />
                          {c.supporters.toLocaleString()}
                        </div>

                        <ChevronRight
                          size={18}
                          className="text-slate-300 group-hover:text-violet-500 shrink-0 transition-colors"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                  {results.length > 0 ? (
                    <>
                      <div className="divide-y divide-slate-100">
                        {results.map((r) => (
                          <div
                            key={r.username}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 hover:bg-slate-50/80 transition-colors"
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
                                <p className="text-xs sm:text-sm text-slate-500 truncate">
                                  @{r.username}
                                  {r.bio ? ` · ${r.bio}` : ""}
                                </p>
                              </div>
                            </Link>

                            <Link to={`/${r.username}`}>
                              <button className="w-full sm:w-auto px-5 py-2 text-sm font-medium border border-slate-200 rounded-full hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all">
                                View page
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                      {hasMore && <div ref={sentinelRef} className="h-8" />}
                      {isSearching && page > 0 && (
                        <div className="flex justify-center py-4">
                          <Loader size={18} className="animate-spin text-violet-500" />
                        </div>
                      )}
                    </>
                  ) : isSearching ? (
                    <div className="flex justify-center py-12">
                      <Loader size={24} className="animate-spin text-violet-500" />
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500">
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
              {/* Feed post */}
              <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                {followingList.length > 0 ? (
                  <>
                    <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                      <img
                        src={followingList[0].profilePictureUrl || "https://placehold.co/40x40"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={followingList[0].displayName || followingList[0].username}
                      />
                      <div>
                        <span className="font-semibold text-sm sm:text-base">
                          {followingList[0].displayName || followingList[0].username}
                        </span>
                        <p className="text-xs text-slate-400">@{followingList[0].username}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 sm:p-16 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <Lock size={24} />
                      </div>
                      <p className="font-medium text-lg">Members-only content</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Support to unlock exclusive posts
                      </p>
                    </div>

                    <div className="p-4 flex gap-5 text-slate-500">
                      <button className="hover:text-pink-500 transition-colors">
                        <Heart size={20} />
                      </button>
                      <button className="hover:text-violet-500 transition-colors">
                        <MessageCircle size={20} />
                      </button>
                      <button className="hover:text-slate-800 transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </>
                ) : followingLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader size={24} className="animate-spin text-violet-500" />
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 px-6">
                    <Users className="mx-auto mb-3 opacity-40" size={32} />
                    <p className="font-medium">You're not following any creators yet</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Follow creators to see their posts here.
                    </p>
                  </div>
                )}
              </div>

              {/* Following sidebar */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Following
                </h3>

                {followingList.length === 0 && !followingLoading ? (
                  <p className="text-slate-400 text-sm italic">Not following anyone yet</p>
                ) : (
                  <div className="space-y-1">
                    {followingList.map((f) => (
                      <Link
                        key={f.username}
                        to={`/${f.username}`}
                        className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-violet-50 transition-colors group"
                      >
                        <img
                          src={f.profilePictureUrl || "https://placehold.co/36x36"}
                          className="w-9 h-9 rounded-full object-cover"
                          alt={f.displayName || f.username}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm block truncate group-hover:text-violet-700">
                            {f.displayName || f.username}
                          </span>
                          <span className="text-xs text-slate-400">
                            @{f.username}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-slate-300 group-hover:text-violet-500 shrink-0"
                        />
                      </Link>
                    ))}
                    {followingHasMore && <div ref={followingSentinelRef} className="h-6" />}
                    {followingLoading && followingPage > 0 && (
                      <div className="flex justify-center py-2">
                        <Loader size={16} className="animate-spin text-violet-500" />
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
