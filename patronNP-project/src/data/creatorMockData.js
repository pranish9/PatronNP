export const getCreatorPosts = (username) => [
  {
    id: "post-1",
    title: "Welcome to my creator page!",
    date: "2026-05-28",
    category: "public",
    excerpt: "Thanks for stopping by — here's what I'm working on this month.",
    content:
      "Thanks for stopping by! I'm building new content every week. Drop a comment and let me know what you'd like to see next.",
    audioUrl: null,
    likes: 24,
    comments: [
      { id: "c1", user: "supporter1", text: "Love your work!", date: "2026-05-29" },
    ],
  },
  {
    id: "post-2",
    title: "Behind the scenes — studio session",
    date: "2026-06-02",
    category: "membership",
    excerpt: "Exclusive audio from my latest recording session.",
    content:
      "Members-only post! Listen to the raw audio from my latest session and read my production notes.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 18,
    comments: [],
  },
  {
    id: "post-3",
    title: "Monthly Q&A recap",
    date: "2026-06-08",
    category: "public",
    excerpt: "Answers to your top questions from this month's live stream.",
    content:
      "We covered gear, workflow, and how I plan content. Full recap below for everyone.",
    audioUrl: null,
    likes: 31,
    comments: [
      { id: "c2", user: "fan42", text: "Great Q&A!", date: "2026-06-09" },
      { id: "c3", user: "artist_nepal", text: "When is the next stream?", date: "2026-06-09" },
    ],
  },
];

export const getCreatorMemberships = (username) => [
  {
    id: "tier-1",
    name: "Supporter",
    monthlyPrice: 299,
    benefits: [
      "Access to members-only posts",
      "Early access to new content",
      "Supporter badge on your profile",
    ],
  },
  {
    id: "tier-2",
    name: "Inner Circle",
    monthlyPrice: 799,
    benefits: [
      "Everything in Supporter",
      "Exclusive audio posts",
      "Monthly live Q&A access",
      "10% shop discount",
    ],
  },
];

export const getCreatorShopItems = (username) => [
  {
    id: "item-1",
    name: "Digital Preset Pack",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=60",
    description:
      "A collection of 20 custom presets for photo and video editing. Instant download after purchase.",
    purchasedCount: 128,
  },
  {
    id: "item-2",
    name: "Creator Merch — T-Shirt",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop&q=60",
    description:
      "Premium cotton tee with exclusive design. Available in S–XL. Ships across Nepal.",
    purchasedCount: 56,
  },
  {
    id: "item-3",
    name: "1-on-1 Consultation (30 min)",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&auto=format&fit=crop&q=60",
    description:
      "Book a private 30-minute session to discuss your creative projects, growth strategy, or technical questions.",
    purchasedCount: 34,
  },
];

export const getPostById = (username, postId) =>
  getCreatorPosts(username).find((p) => p.id === postId);

export const getShopItemById = (username, itemId) =>
  getCreatorShopItems(username).find((i) => i.id === itemId);

export const getMembershipById = (username, tierId) =>
  getCreatorMemberships(username).find((m) => m.id === tierId);
