import React, { useState, useEffect } from "react";
import { Check, X, AlertCircle, Loader } from "lucide-react";

const SignUpPhase1 = ({ onNext, formData, setFormData }) => {
  const MIN_LENGTH = 4;
  const MAX_LENGTH = 25;

  const [username, setUsername] = useState(formData.username || "");
  const [debouncedUsername, setDebouncedUsername] = useState(username);

  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  // Wait 2 seconds after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 2000);

    return () => clearTimeout(timer);
  }, [username]);

  // Check username only after debounce
  useEffect(() => {
    if (
      debouncedUsername &&
      debouncedUsername.length >= MIN_LENGTH
    ) {
      checkUsernameAvailability(debouncedUsername);
    } else {
      setIsAvailable(null);
      setSuggestions([]);
    }
  }, [debouncedUsername]);

  // Fake API check
  const checkUsernameAvailability = async (value) => {
    setChecking(true);

    // Simulate API delay
    setTimeout(() => {
      const reserved = [
        "admin",
        "api",
        "www",
        "mail",
        "support",
        "help",
        "patronnp",
        "admin123",
        "localhost",
        "5173",
      ];

      const available = !reserved.includes(value.toLowerCase());

      setIsAvailable(available);

      if (!available) {
        setSuggestions([
          `${value}${Math.floor(Math.random() * 999)}`,
          `${value}official`,
          `${value}pro`,
          `real${value}`,
          `im${value}`,
        ]);
      } else {
        setSuggestions([]);
      }

      setChecking(false);
    }, 800);
  };

  const handleUsernameChange = (value) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+/g, "")
      .replace(/-+$/g, "")
      .replace(/-+/g, "-");

    if (cleaned.length <= MAX_LENGTH) {
      setUsername(cleaned);

      // Reset states while typing
      setChecking(false);
      setIsAvailable(null);
      setSuggestions([]);
      setError("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUsername(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!username) {
      setError("Please enter a username");
      return;
    }

    if (username.length < MIN_LENGTH) {
      setError(
        `Username must be at least ${MIN_LENGTH} characters`
      );
      return;
    }

    if (username.length > MAX_LENGTH) {
      setError(
        `Username cannot exceed ${MAX_LENGTH} characters`
      );
      return;
    }

    if (isAvailable === false) {
      setError("This username is already taken");
      return;
    }

    if (isAvailable !== true) {
      setError("Please wait until username check finishes");
      return;
    }

    setFormData({
      ...formData,
      username,
    });

    onNext();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Identity
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Choose a unique username for your creator page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>

          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 font-medium">
              localhost:5173/
            </span>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                handleUsernameChange(e.target.value)
              }
              placeholder="yourname"
              className="w-full pl-44 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />

            <div className="absolute right-4 top-3.5">
              {checking && (
                <Loader
                  size={18}
                  className="animate-spin text-blue-500"
                />
              )}

              {!checking && isAvailable === true && (
                <Check size={18} className="text-emerald-500" />
              )}

              {!checking && isAvailable === false && (
                <X size={18} className="text-red-500" />
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>
                {username.length}/{MAX_LENGTH}
              </span>

              {username.length < MIN_LENGTH && (
                <span>
                  Minimum {MIN_LENGTH} characters
                </span>
              )}
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (username.length / MAX_LENGTH) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Rules */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            • Lowercase letters, numbers, and hyphens only
            <br />
            • Between {MIN_LENGTH} - {MAX_LENGTH} characters
            <br />
            • No spaces or special characters
          </p>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0"
              />

              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Available */}
          {!error && isAvailable === true && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-2">
              <Check
                size={16}
                className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"
              />

              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Username available!
                </p>

                <p className="text-xs text-emerald-600 dark:text-emerald-500">
                  localhost:5173/{username}
                </p>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!error &&
            isAvailable === false &&
            suggestions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Username taken. Try these:
                </p>

                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(suggestion)
                      }
                      className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                    >
                      localhost:5173/
                      <span className="font-semibold">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-400">
            <span className="font-semibold">
              ✨ Your unique URL
            </span>

            <br />

            This becomes your creator page address.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={checking || isAvailable !== true}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isAvailable === true && !checking
              ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600"
              : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {checking
            ? "Checking availability..."
            : "Continue"}
        </button>

        {/* Preview */}
        {username.length >= MIN_LENGTH && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              PREVIEW
            </p>

            <p className="text-lg font-bold text-gray-900 dark:text-white">
              localhost:5173/
              <span className="text-emerald-600 dark:text-emerald-400">
                {username}
              </span>
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your public creator page
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUpPhase1;
