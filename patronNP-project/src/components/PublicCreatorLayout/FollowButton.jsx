import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCheck } from "lucide-react";
import { getFollowStatus, followCreator, unfollowCreator } from "../../services/followService";

const FollowButton = ({ username, loggedIn, className = "" }) => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFollowStatus(username)
      .then((data) => {
        if (!cancelled) setFollowing(data.following);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [username]);

  const toggleFollow = async () => {
    if (!loggedIn) {
      navigate("/signin", { state: { from: `/${username}` } });
      return;
    }

    setLoading(true);
    const next = !following;
    setFollowing(next);
    try {
      if (next) {
        await followCreator(username);
      } else {
        await unfollowCreator(username);
      }
    } catch {
      setFollowing(!next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors disabled:opacity-60 ${
        following
          ? "border border-patron-gray-200 text-patron-gray-700 hover:bg-patron-gray-50"
          : "bg-patron-black text-white hover:bg-patron-gray-800"
      } ${className}`}
    >
      {following ? <UserCheck size={14} /> : <UserPlus size={14} />}
      {following ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
