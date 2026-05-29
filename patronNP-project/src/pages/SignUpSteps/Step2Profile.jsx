import React, { useState } from 'react';
import { User, AtSign, Folder } from 'lucide-react';

const Step2Profile = ({ onNext, onPrev, formData, setFormData }) => {
  const [name, setName] = useState(formData.name || '');
  const [uniqueUrl, setUniqueUrl] = useState(formData.uniqueUrl || '');
  const [category, setCategory] = useState(formData.category || '');
  const [error, setError] = useState('');
  const [urlChecking, setUrlChecking] = useState(false);
  const [urlAvailable, setUrlAvailable] = useState(null);

  const categories = [
    'Artist',
    'Content Creator',
    'Musician',
    'Photographer',
    'Podcaster',
    'Streamer',
    'Writer',
    'Educator',
    'Fitness Coach',
    'Designer',
    'Other'
  ];

  const checkUrlAvailability = async (url) => {
    if (!url || url.length < 3) {
      setUrlAvailable(null);
      return;
    }

    setUrlChecking(true);
    // Simulate API call
    setTimeout(() => {
      setUrlAvailable(true);
      setUrlChecking(false);
    }, 500);
  };

  const handleUrlChange = (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setUniqueUrl(cleaned);
    checkUrlAvailability(cleaned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!uniqueUrl.trim()) {
      setError('Please enter a unique URL');
      return;
    }

    if (uniqueUrl.length < 3) {
      setError('URL must be at least 3 characters');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (urlAvailable === false) {
      setError('This URL is not available');
      return;
    }

    setFormData({
      ...formData,
      name,
      uniqueUrl,
      category
    });
    onNext();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Set Up Your Creator Profile</h1>
      <p className="text-gray-600 mb-8 text-center">This is your public creator page. You can change it anytime.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">This will appear on your creator page</p>
        </div>

        {/* Unique URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your URL</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 text-sm font-medium">patronnp.com/</span>
            <input
              type="text"
              value={uniqueUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full pl-40 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="yourname"
            />
            {urlChecking && (
              <span className="absolute right-3 top-3 text-gray-500 text-sm">Checking...</span>
            )}
            {!urlChecking && urlAvailable === true && (
              <span className="absolute right-3 top-3 text-emerald-600 text-sm font-medium">✓ Available</span>
            )}
            {!urlChecking && urlAvailable === false && (
              <span className="absolute right-3 top-3 text-red-600 text-sm font-medium">✗ Taken</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you create?</label>
          <div className="relative">
            <Folder size={18} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs font-semibold text-gray-600 mb-2">PREVIEW:</p>
        <p className="text-lg font-semibold text-gray-900">{name || 'Your Name'}</p>
        <p className="text-sm text-gray-600">patronnp.com/{uniqueUrl || 'yourname'}</p>
        {category && <p className="text-sm text-emerald-600 mt-1">• {category}</p>}
      </div>
    </div>
  );
};

export default Step2Profile;
