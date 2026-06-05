
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const OnboardingProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    profilePicture: null,
    fullName: "",
    bio: "",
    socialLink: "",
  });

  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      profilePicture: file,
    }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.fullName.trim()) {
      return toast.error("Full name is required");
    }

    if (!profileData.bio.trim()) {
      return toast.error("Bio is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (profileData.profilePicture) {
        formData.append(
          "profilePicture",
          profileData.profilePicture
        );
      }

      formData.append(
        "fullName",
        profileData.fullName
      );

      formData.append(
        "bio",
        profileData.bio
      );

      formData.append(
        "socialLink",
        profileData.socialLink
      );

      const token =
        localStorage.getItem("accessToken");

      await axios.post(
        "http://localhost:8080/api/profile/save",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Profile completed successfully"
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Complete Your Creator Page
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-12"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            <label className="cursor-pointer border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition">
              Upload Profile Photo

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG • Max 5MB
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full bg-gray-100 p-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                About You
              </label>

              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                maxLength={500}
                placeholder="Tell supporters about yourself and what you're creating..."
                className="w-full bg-gray-100 p-3 rounded-lg outline-none h-32 resize-none"
              />

              <div className="text-right text-xs text-gray-500 mt-1">
                {profileData.bio.length}/500
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Website or Social Link
              </label>

              <input
                type="url"
                name="socialLink"
                value={profileData.socialLink}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className="w-full bg-gray-100 p-3 rounded-lg outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading
                ? "Saving Profile..."
                : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingProfile;
