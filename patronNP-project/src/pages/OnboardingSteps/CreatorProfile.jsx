import {
  Heart,
  Share2,
  Link as LinkIcon
} from "lucide-react";

import {
  useParams,
  Navigate
} from "react-router-dom";

import Layout from "../../components/Layout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { useLanguage } from "../../hooks/useLanguage";

export const CreatorProfile = () => {
  const { username } = useParams();
  const { t } = useLanguage();

  // Authentication Check
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Onboarding Check
  const onboardingCompleted =
    localStorage.getItem("onboardingCompleted") === "true";

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // Mock creator data
  const creator = {
    username: username || "johndoe",
    displayName: "John Doe",
    bio: "Content creator, photographer, and digital nomad. 📸 Exploring the world one frame at a time!",
    profilePicture: "https://via.placeholder.com/120",
    coverBanner: "https://via.placeholder.com/1200x300",
    followers: 1250,
    earnings: "NP",
    social: {
      instagram: "@johndoe",
      twitter: "@johndoe",
      youtube: "@johndoe",
      website: "https://johndoe.com",
    },
  };

  const recentSupporters = [
    {
      id: 1,
      name: "Anonymous",
      amount: 500,
    },
    {
      id: 2,
      name: "Sita P.",
      amount: 1000,
    },
    {
      id: 3,
      name: "Ram S.",
      amount: 750,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">

        {/* Cover Banner */}
        <div className="h-40 md:h-64 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 relative -mx-4 sm:mx-0">
          <img
            src={creator.coverBanner}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Section */}
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-20 relative z-10">
            <div>
              <img
                src={creator.profilePicture}
                alt={creator.displayName}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold">
                {creator.displayName}
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400">
                @{creator.username}
              </p>

              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {creator.bio}
              </p>

              <div className="flex gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                <span>
                  👥 {creator.followers.toLocaleString()}{" "}
                  {t("creator.followers")}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="md">
                <Share2 size={20} />
              </Button>
            </div>
          </div>

          {/* Keep the rest of your existing JSX here */}

        </div>
      </div>
    </Layout>
  );
};

const SocialLink = ({ icon, label, value }) => {
  const url =
    value.startsWith("http")
      ? value
      : `https://${value.replace("@", "")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      <span className="text-xl">{icon}</span>

      <div className="flex-1">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="font-medium text-sm">
          {value}
        </p>
      </div>

      <LinkIcon
        size={16}
        className="text-slate-400"
      />
    </a>
  );
};

export default CreatorProfile;