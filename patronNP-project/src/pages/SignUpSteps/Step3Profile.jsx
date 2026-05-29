import React, { useState, useRef } from 'react';
import { User, FileImage, AlertCircle, CheckCircle, Link as LinkIcon, Edit2 } from 'lucide-react';

const Step3Profile = ({ onNext, onPrev, formData, setFormData }) => {
  const [displayName, setDisplayName] = useState(formData.displayName || '');
  const [about, setAbout] = useState(formData.about || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(formData.profilePictureUrl || '');
  const [socialLinks, setSocialLinks] = useState(formData.socialLinks || {
    twitter: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_ABOUT_LENGTH = 500;

  const validateUrl = (url) => {
    if (!url) return true; // Optional field
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are supported');
      return;
    }

    setError('');
    setUploading(true);

    // Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePictureUrl(event.target?.result || '');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    if (displayName.trim().length > 50) {
      setError('Display name cannot exceed 50 characters');
      return;
    }

    if (about.length > MAX_ABOUT_LENGTH) {
      setError(`About section cannot exceed ${MAX_ABOUT_LENGTH} characters`);
      return;
    }

    // Validate all URLs
    for (const [platform, url] of Object.entries(socialLinks)) {
      if (url && !validateUrl(url)) {
        setError(`Invalid URL for ${platform}`);
        return;
      }
    }

    setFormData({
      displayName: displayName.trim(),
      about,
      profilePictureUrl,
      socialLinks
    });

    onNext();
  };

  const platforms = [
    { id: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yourhandle' },
    { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
    { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourprofile' },
    { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
    { id: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Your Profile</h1>
        <p className="text-gray-600">Add a profile picture and tell supporters about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
          <div className="flex items-end gap-4">
            <div className="relative">
              {profilePictureUrl ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-emerald-500">
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Edit2 size={20} className="text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 transition-colors flex items-center justify-center bg-gray-50 hover:bg-emerald-50"
                >
                  <div className="text-center">
                    <FileImage size={24} className="mx-auto text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600">Add photo</span>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {profilePictureUrl
                  ? '✓ Picture uploaded'
                  : 'Upload a photo (JPEG, PNG, WebP)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Max 5MB • Square format recommended</p>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {displayName.length}/50 • This appears on your creator page
          </p>
        </div>

        {/* About Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, MAX_ABOUT_LENGTH))}
            placeholder="Tell your supporters what you do... (e.g., I'm a digital artist creating fantasy illustrations)"
            maxLength={MAX_ABOUT_LENGTH}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {about.length}/{MAX_ABOUT_LENGTH} characters
          </p>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Social & Website Links</label>
          <div className="space-y-3">
            {platforms.map(platform => (
              <div key={platform.id}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {platform.label}
                </label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    value={socialLinks[platform.id] || ''}
                    onChange={(e) => handleSocialLinkChange(platform.id, e.target.value)}
                    placeholder={platform.placeholder}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  />
                  {socialLinks[platform.id] && validateUrl(socialLinks[platform.id]) && (
                    <CheckCircle size={16} className="absolute right-3 top-3 text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Links are optional. Include full URLs starting with http:// or https://</p>
        </div>

        {/* Preview Card */}
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-600 mb-3">PREVIEW:</p>
          <div className="flex items-start gap-3">
            {profilePictureUrl && (
              <img
                src={profilePictureUrl}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{displayName || 'Your Name'}</p>
              {about && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{about}</p>
              )}
              {Object.values(socialLinks).some(link => link) && (
                <div className="flex gap-2 mt-2">
                  {Object.entries(socialLinks).map(([platform, link]) =>
                    link ? (
                      <span
                        key={platform}
                        className="inline-block px-2 py-1 bg-white text-xs text-emerald-600 rounded border border-emerald-200"
                      >
                        {platform}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3Profile;
