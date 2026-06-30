import React, { useState, useEffect } from "react";
import { Check, X, AlertCircle, Loader } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const SignUpPhase1 = ({ onNext, formData, setFormData }) => {
  const { t } = useLanguage();
  const MIN_LENGTH = 4;
  const MAX_LENGTH = 25;

  const [username, setUsername] = useState(formData.username || "");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  // debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 800);

    return () => clearTimeout(timer);
  }, [username]);

  // check backend
  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < MIN_LENGTH) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }

    checkUsernameAvailability(debouncedUsername);
  }, [debouncedUsername]);

  const checkUsernameAvailability = async (value) => {
    setChecking(true);

    try {
      const res = await fetch(
        `http://localhost:8080/auth/check-username?username=${value}`
      );

      const data = await res.json();

      setIsAvailable(data.available);

      if (!data.available) {
        setSuggestions([
          `${value}${Math.floor(Math.random() * 999)}`,
          `${value}_official`,
          `${value}pro`,
          `real_${value}`,
          `its_${value}`,
        ]);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
      setIsAvailable(false);
      setError(t('errors.serverErrorTryAgain'));
    }

    setChecking(false);
  };

  const handleUsernameChange = (value) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");

    if (cleaned.length <= MAX_LENGTH) {
      setUsername(cleaned);
      setIsAvailable(null);
      setSuggestions([]);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username) return setError(t('errors.usernameRequired'));

    if (username.length < MIN_LENGTH)
      return setError(t('errors.minCharsRequired', { n: MIN_LENGTH }));

    if (username.length > MAX_LENGTH)
      return setError(t('errors.maxCharsAllowed', { n: MAX_LENGTH }));

    if (isAvailable === false)
      return setError(t('errors.usernameTaken'));

    if (isAvailable !== true)
      return setError(t('errors.waitForAvailabilityCheck'));

    setFormData({ ...formData, username });
    onNext();
  };

  const selectSuggestion = (value) => {
    setUsername(value);
  };

  return (
    <div className="max-w-md mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {t('onboarding.createIdentity')}
        </h1>
        <p className="text-gray-500 mt-2">
          {t('onboarding.chooseUsername')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('auth.username')}
          </label>

          <div className="relative">
            <span className="absolute left-3 sm:left-4 top-3.5 text-gray-400 text-xs sm:text-base truncate max-w-[40%] sm:max-w-none">
              patronnp.com/
            </span>

            <input
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="yourname"
              className="w-full pl-28 sm:pl-44 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <div className="absolute right-4 top-3.5">
              {checking && <Loader className="animate-spin text-orange-500" size={18} />}
              {!checking && isAvailable === true && <Check className="text-green-500" size={18} />}
              {!checking && isAvailable === false && <X className="text-red-500" size={18} />}
            </div>
          </div>

          {/* progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{username.length}/{MAX_LENGTH}</span>
              {username.length < MIN_LENGTH && (
                <span>{t('onboarding.minChars', { n: MIN_LENGTH })}</span>
              )}
            </div>

            <div className="h-1.5 bg-gray-200 rounded">
              <div
                className="h-1.5 bg-green-500 rounded transition-all"
                style={{
                  width: `${Math.min(
                    (username.length / MAX_LENGTH) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* error */}
          {error && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded flex gap-2">
              <AlertCircle className="text-orange-500" size={16} />
              <p className="text-sm text-orange-700">{error}</p>
            </div>
          )}

          {/* available */}
          {isAvailable === true && !error && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 text-sm font-medium">
                {t('onboarding.usernameAvailableExclaim')}
              </p>
              <p className="text-xs text-green-600">
                patronnp.com/{username}
              </p>
            </div>
          )}

          {/* suggestions */}
          {isAvailable === false && suggestions.length > 0 && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
              <p className="text-sm font-medium text-orange-700 mb-2">
                {t('onboarding.usernameTakenTrySuggestions')}
              </p>

              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="block w-full text-left px-2 py-1 hover:bg-orange-100 rounded"
                >
                  patronnp.com/<b>{s}</b>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm">
            <b className="text-green-600">{t('onboarding.yourUniqueUrl')}</b>
            <br />
            {t('onboarding.uniqueUrlDesc')}
          </p>
        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={checking || isAvailable !== true}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isAvailable
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          {checking ? t('onboarding.checking') : t('common.continue')}
        </button>

      </form>
    </div>
  );
};

export default SignUpPhase1;