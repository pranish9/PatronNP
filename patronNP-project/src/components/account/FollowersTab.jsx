import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

import { getFollowers } from "../../services/followService";

const FollowersTab = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFollowers(0, 20)
      .then((data) => setFollowers(data.content || []))
      .catch(() => toast.error("Failed to load followers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
      {loading ? (
        <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
      ) : followers.length === 0 ? (
        <div className="border border-patron-gray-100 rounded-2xl py-12 text-center">
          <div className="w-12 h-12 bg-patron-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-patron-gray-400">
            <Heart size={20} />
          </div>
          <h3 className="font-bold text-patron-black">You don't have any followers yet.</h3>
          <p className="text-sm text-patron-gray-500 mt-1">
            Share your page with your audience to get started.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-patron-gray-100">
          {followers.map((follower) => (
            <Link
              key={follower.username}
              to={`/${follower.username}`}
              className="flex items-center gap-3 py-3 -mx-2 px-2 rounded-xl hover:bg-patron-gray-50 transition-colors"
            >
              <img
                src={
                  follower.profilePictureUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    follower.displayName || follower.username
                  )}&background=16a34a&color=fff`
                }
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-patron-black truncate">
                  {follower.displayName || follower.username}
                </p>
                <p className="text-xs text-patron-gray-500 truncate">@{follower.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersTab;
