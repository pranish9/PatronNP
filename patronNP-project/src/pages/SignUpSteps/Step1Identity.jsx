import React, { useState, useEffect } from 'react';
import { AtSign, Check, X, AlertCircle, Loader } from 'lucide-react';

const Step1Identity = ({ onNext, formData, setFormData }) => {
  const [username, setUsername] = useState(formData.username || '');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const MIN_LENGTH = 4;
  const MAX_LENGTH = 25;

  // Simulate username availability check
  const checkUsernameAvailability = async (value) => {
    if (!value || value.length < MIN_LENGTH) {
      setIsAvailable(null);
      return;
    }

    setChecking(true);
    
    // Simulate API call delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock API: reserved usernames
        const reserved = ['admin', 'api', 'www', 'mail', 'support', 'help', 'patronnp', 'admin123'];
        const available = !reserved.includes(value.toLowerCase());
        
        setIsAvailable(available);
        
        if (!available) {
          // Generate suggestions
          const baseName = value;
          setSuggestions([
            `${baseName}${Math.floor(Math.random() * 1000)}`,
            `${baseName}pro`,
            `${baseName}official`,
            `real${baseName}`,
            `im${baseName}`
          ]);
        } else {
          setSuggestions([]);
        }
        
        setChecking(false);
        resolve(available);
      }, 800);
    });
  };

  const handleUsernameChange = (value) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
      .replace(/-+/g, '-');

    if (cleaned.length <= MAX_LENGTH) {
      setUsername(cleaned);
      setError('');
      
      if (cleaned.length >= MIN_LENGTH) {
        checkUsernameAvailability(cleaned);
      } else {
        setIsAvailable(null);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUsername(suggestion);
    checkUsernameAvailability(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Please enter a username');
      return;
    }

    if (username.length < MIN_LENGTH) {
      setError(`Username must be at least ${MIN_LENGTH} characters`);
      return;
    }

    if (username.length > MAX_LENGTH) {
      setError(`Username cannot exceed ${MAX_LENGTH} characters`);
      return;
    }

    if (isAvailable === false) {
      setError('This username is not available. Choose from suggestions or try another.');
      return;
    }

    if (isAvailable !== true) {
      setError('Please verify username availability first');
      return;
    }

    setFormData({ username });
    onNext();
  };

  const progress = Math.min((username.length / MIN_LENGTH) * 100, 100);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Identity</h1>
        <p className="text-gray-600">Choose a unique username for your creator page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500 font-medium">patronnp.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="yourname"
              className="w-full pl-40 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={checking}
            />
            <div className="absolute right-4 top-3.5 flex items-center gap-1">
              {checking && <Loader size={18} className="text-blue-500 animate-spin" />}
              {!checking && isAvailable === true && <Check size={18} className="text-emerald-500" />}
              {!checking && isAvailable === false && <X size={18} className="text-red-500" />}
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-600">
                {username.length}/{MAX_LENGTH} characters
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((username.length / MAX_LENGTH) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              • Lowercase letters, numbers, and hyphens only
              <br />• Between {MIN_LENGTH}-{MAX_LENGTH} characters
              <br />• No spaces or special characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Status Messages */}
          {!error && username.length >= MIN_LENGTH && (
            <>
              {isAvailable === true && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                  <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Username available!</p>
                    <p className="text-xs text-emerald-600">Your URL: patronnp.com/{username}</p>
                  </div>
                </div>
              )}
              
              {isAvailable === false && suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 mb-2">That username is taken. Try these:</p>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        patronnp.com/<span className="font-semibold">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">✨ Your unique URL</span>
            <br />
            This will be your creator page address. You can't change it later, so choose wisely!
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAvailable !== true || checking}
          className={`w-full py-3 font-semibold rounded-lg transition-colors ${
            isAvailable === true && !checking
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {checking ? 'Checking availability...' : 'Continue'}
        </button>

        {/* Preview Box */}
        {username.length >= MIN_LENGTH && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-2">PREVIEW:</p>
            <p className="text-lg font-bold text-gray-900">patronnp.com/<span className="text-emerald-600">{username}</span></p>
            <p className="text-xs text-gray-500 mt-1">This will be your unique creator page</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Step1Identity;
