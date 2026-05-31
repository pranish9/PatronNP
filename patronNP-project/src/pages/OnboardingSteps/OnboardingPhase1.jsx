import React, { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const OnboardingPhase1 = ({ profileData, setProfileData, onNext }) => {
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData({
          ...profileData,
          profilePicture: file,
          profilePictureUrl: event.target?.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndNext = () => {
    const newErrors = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!profileData.about.trim()) {
      newErrors.about = 'About/Bio is required';
    } else if (profileData.about.length < 10) {
      newErrors.about = 'About should be at least 10 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Setup
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Let's create your creator profile
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Profile Picture
          </label>

          <div className="relative">
            {profileData.profilePictureUrl ? (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={profileData.profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition">
                  <Upload size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Add photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) =>
              setProfileData({ ...profileData, fullName: e.target.value })
            }
            placeholder="John Doe"
            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
            }`}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* About / Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            About / Bio *
          </label>
          <textarea
            value={profileData.about}
            onChange={(e) =>
              setProfileData({ ...profileData, about: e.target.value })
            }
            placeholder="Tell creators about yourself..."
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition resize-none ${
              errors.about
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
            }`}
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profileData.about.length}/150
            </p>
            {errors.about && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.about}
              </p>
            )}
          </div>
        </div>

        {/* Social Link (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Social Link (Optional)
          </label>
          <div className="flex gap-2">
            <select
              value={profileData.socialPlatform}
              onChange={(e) =>
                setProfileData({ ...profileData, socialPlatform: e.target.value })
              }
              className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
            </select>
            <input
              type="text"
              value={profileData.socialLink}
              onChange={(e) =>
                setProfileData({ ...profileData, socialLink: e.target.value })
              }
              placeholder="@yourhandle or URL"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={validateAndNext}
          className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition flex items-center justify-center gap-2"
        >
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPhase1;
