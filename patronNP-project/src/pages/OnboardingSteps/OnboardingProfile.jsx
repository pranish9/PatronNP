
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { API_HOST } from "../../utils/apiHost";

const OnboardingProfile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();


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
      toast.error(t('onboarding.selectImageFile'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('onboarding.imageSizeLimit'));
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
      return toast.error(t('onboarding.fullNameRequired'));
    }

    if (!profileData.bio.trim()) {
      return toast.error(t('onboarding.bioRequired'));
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
        `${API_HOST}/api/profile/save`,
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
        t('onboarding.profileCompletedSuccess')
      );

      navigate("/payment-setup");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t('onboarding.failedToSaveProfile')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onboardingCompleted =
      localStorage.getItem("onboardingCompleted");
  
    if (onboardingCompleted === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
          {t('onboarding.completeCreatorPage')}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8 md:gap-12"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
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
              {t('onboarding.uploadProfilePhoto')}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <p className="text-xs text-gray-500 mt-2">
              {t('onboarding.jpgPngMax5mb')}
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('onboarding.fullName')}
              </label>

              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                placeholder={t('onboarding.yourFullName')}
                className="w-full bg-gray-100 p-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('onboarding.aboutYou')}
              </label>

              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                maxLength={500}
                placeholder={t('onboarding.bioPlaceholder')}
                className="w-full bg-gray-100 p-3 rounded-lg outline-none h-32 resize-none"
              />

              <div className="text-right text-xs text-gray-500 mt-1">
                {profileData.bio.length}/500
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('onboarding.websiteOrSocialLink')}
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
                ? t('onboarding.savingProfile')
                : t('common.continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingProfile;
