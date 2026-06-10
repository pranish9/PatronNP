import React, { useState } from "react";
import {
  Search,
  X,
  Lock,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

import Layout from "../../components/creatorLayout/Layout"; // ✅ FIX: import layout properly

// --- Mock Data ---
const trendingCreators = [
  {
    id: 1,
    name: "Simple Politics",
    desc: "Helping people have better conversations about politics",
    avatar:
      "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Cara",
    desc: "building a new platform for artists",
    avatar:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "Beach Talk Radio",
    desc: "A Dinky Little Podcast",
    avatar:
      "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=150&auto=format&fit=crop&q=60",
  },
];

const searchResultsData = [
  {
    id: 101,
    name: "Hell to the No",
    desc: "A safe place for people to speak their truths",
    avatar:
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 102,
    name: "Hell Heroes",
    desc: "Unique indie video game",
    avatar:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=60",
  },
];

const followingList = [
  {
    name: "Cara",
    avatar:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
  },
  {
    name: "Kaleigh Cohen",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60",
  },
];

const ExploreCreator = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="min-h-screen bg-[#f3f4f6] text-[#222]">

        {/* HEADER TABS */}
        <div className="max-w-5xl mx-auto pt-6 px-4">
          <div className="flex space-x-8 border-b border-gray-200 text-lg font-medium">

            <button
              onClick={() => {
                setActiveTab("explore");
                setSearchQuery("");
              }}
              className={`pb-3 ${
                activeTab === "explore"
                  ? "text-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              Explore creators
            </button>

            <button
              onClick={() => {
                setActiveTab("following");
                setSearchQuery("");
              }}
              className={`pb-3 ${
                activeTab === "following"
                  ? "text-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              Following
            </button>

          </div>
        </div>

        {/* MAIN */}
        <main className="max-w-5xl mx-auto px-4 py-6">

          {/* ================= EXPLORE ================= */}
          {activeTab === "explore" && (
            <div className="space-y-6">

              {/* SEARCH */}
              <div className="relative">
                <Search className="absolute left-4 top-3 text-gray-400" size={20} />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators..."
                  className="w-full pl-12 pr-12 py-3 rounded-full border bg-white"
                />

                {searchQuery && (
                  <X
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-3 cursor-pointer text-gray-400"
                    size={20}
                  />
                )}
              </div>

              {/* TRENDING */}
              {!searchQuery ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h2 className="text-xl font-bold mb-4">
                    Trending creators
                  </h2>

                  <div className="space-y-4">
                    {trendingCreators.map((c, i) => (
                      <div key={c.id} className="flex gap-4 items-center">
                        <span className="text-gray-500 font-bold">
                          #{i + 1}
                        </span>

                        <img
                          src={c.avatar}
                          className="w-12 h-12 rounded-full"
                          alt={c.name}
                        />

                        <div>
                          <h3 className="font-bold">{c.name}</h3>
                          <p className="text-sm text-gray-500">{c.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* SEARCH RESULTS */
                <div className="bg-white rounded-2xl border divide-y">
                  {searchResultsData.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between items-center p-4 hover:bg-gray-50"
                    >
                      <div className="flex gap-3">
                        <img
                          src={r.avatar}
                          className="w-10 h-10 rounded-full"
                          alt={r.name}
                        />
                        <div>
                          <h3 className="font-bold">{r.name}</h3>
                          <p className="text-sm text-gray-500">{r.desc}</p>
                        </div>
                      </div>

                      <button className="border px-4 py-1 rounded-full">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= FOLLOWING ================= */}
          {activeTab === "following" && (
            <div className="grid lg:grid-cols-3 gap-6">

              {/* POST */}
              <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden">

                <div className="p-4 border-b flex items-center gap-3">
                  <img
                    src={followingList[0].avatar}
                    className="w-10 h-10 rounded-full"
                    alt="creator"
                  />
                  <span className="font-bold">Kaleigh Cohen</span>
                </div>

                <div className="bg-black text-white p-10 text-center">
                  <Lock className="mx-auto mb-3" />
                  <p>Members only content</p>
                </div>

                <div className="p-4 flex gap-4">
                  <Heart />
                  <MessageCircle />
                  <Share2 />
                </div>
              </div>

              {/* FOLLOWING LIST */}
              <div className="bg-white p-4 rounded-2xl border">
                <h3 className="text-sm text-gray-500 mb-4">
                  Following
                </h3>

                {followingList.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2"
                  >
                    <img
                      src={f.avatar}
                      className="w-8 h-8 rounded-full"
                      alt={f.name}
                    />
                    <span className="font-medium">{f.name}</span>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>
    </Layout>
  );
};

export default ExploreCreator;