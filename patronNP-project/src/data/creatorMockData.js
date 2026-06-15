export const getCreatorPosts = (username) => [
  {
    id: "post-1",
    title: "Welcome to my creator page!",
    date: "2026-05-28",
    category: "public",
    type: "text",
    excerpt: "Thanks for stopping by — here's what I'm working on this month.",
    content:
      "Thanks for stopping by! I'm building new content every week. Drop a comment and let me know what you'd like to see next.",
    imageUrl: null,
    audioUrl: null,
    videoUrl: null,
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
    type: "audio",
    excerpt: "Exclusive audio from my latest recording session.",
    content:
      "Members-only post! Listen to the raw audio from my latest session and read my production notes.",
    imageUrl: null,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    videoUrl: null,
    likes: 18,
    comments: [],
  },
  {
    id: "post-3",
    title: "Monthly Q&A recap",
    date: "2026-06-08",
    category: "public",
    type: "photo",
    excerpt: "Answers to your top questions from this month's live stream.",
    content:
      "We covered gear, workflow, and how I plan content. Full recap below for everyone.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
    audioUrl: null,
    videoUrl: null,
    likes: 31,
    comments: [
      { id: "c2", user: "fan42", text: "Great Q&A!", date: "2026-06-09" },
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

export const getRecentSupporters = (username) => [
  {
    id: "s1",
    name: "Anisha K.",
    handle: "anisha_k",
    amount: 300,
    message: "Love your content! Keep going",
    timestamp: "2026-06-10T14:30:00",
    isPrivate: false,
  },
  {
    id: "s2",
    name: "Rohan",
    handle: "rohan_dev",
    amount: 500,
    message: "Bought you a tea — well deserved!",
    timestamp: "2026-06-09T09:15:00",
    isPrivate: false,
  },
  {
    id: "s3",
    name: "Private Supporter",
    handle: null,
    amount: 200,
    message: "Thank you for everything",
    timestamp: "2026-06-08T18:00:00",
    isPrivate: true,
  },
];

export const getPublicSupporters = (username) =>
  getRecentSupporters(username).filter((s) => !s.isPrivate);

export const getPostById = (username, postId) =>
  getCreatorPosts(username).find((p) => p.id === postId);

export const getShopItemById = (username, itemId) =>
  getCreatorShopItems(username).find((i) => i.id === itemId);

export const getMembershipById = (username, tierId) =>
  getCreatorMemberships(username).find((m) => m.id === tierId);
