import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";

import {
  Heart,
  Share2,
  Link as LinkIcon,
} from "lucide-react";

import Button from "../../components/Button";
import Card from "../../components/Card";
import { useLanguage } from "../../hooks/useLanguage";

const CreatorProfile = () => {
  const { username } = useParams();
  const { t } = useLanguage();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const token = localStorage.getItem("accessToken");

  const loggedInUser = token
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    fetchCreator();
  }, [username]);

  const fetchCreator = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/creators/${username}`
      );

      setCreator(res.data);
      setNotFound(false);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STATES
  // -------------------------

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (notFound || !creator) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">404 Creator Not Found</h1>
      </div>
    );
  }

  // OWNER CHECK
  const isOwner =
    loggedInUser?.username === creator.username;

  // -------------------------
  // RENDER
  // -------------------------

  return (
    <div className="space-y-8">

      {/* COVER */}
      <div className="h-48 bg-gray-200">
        {creator.coverImageUrl && (
          <img
            src={creator.coverImageUrl}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* PROFILE */}
      <div className="max-w-4xl mx-auto px-4">

        <div className="flex items-center gap-4 -mt-16">

          <img
            src={creator.profilePictureUrl}
            className="w-32 h-32 rounded-full border-4 bg-white"
          />

          <div>
            <h1 className="text-3xl font-bold">
              {creator.displayName}
            </h1>

            <p className="text-gray-500">
              @{creator.username}
            </p>

            <p className="mt-2 text-gray-600">
              {creator.bio}
            </p>

            <p className="text-sm mt-1">
              👥 {creator.supporterCount} supporters
            </p>
          </div>

          {/* ACTIONS */}
          <div className="ml-auto flex gap-2">

            {isOwner ? (
              <>
                <Button>Edit Page</Button>
                <Button variant="outline">
                  Dashboard
                </Button>
              </>
            ) : token ? (
              <Button>
                <Heart size={16} />
                Support
              </Button>
            ) : (
              <Button>
                Login to Support
              </Button>
            )}

          </div>
        </div>

        {/* SUPPORT SECTION */}
        {!isOwner && (
          <Card className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              Support {creator.displayName}
            </h2>

            <div className="flex gap-3">
              {[500, 1000, 2000].map((amt) => (
                <Button key={amt}>
                  Rs {amt}
                </Button>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default CreatorProfile;