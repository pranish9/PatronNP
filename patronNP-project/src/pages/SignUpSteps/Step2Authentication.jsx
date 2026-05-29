import React, { useState } from 'react';
import { Mail, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import GoogleSignIn from '../../components/auth/GoogleSignIn';

const Step2Authentication = ({ onNext, onPrev, formData, setFormData }) => {
  const [authMethod, setAuthMethod] = useState(formData.authMethod || null);
  const [email, setEmail] = useState(formData.email || '');
  const [password, setPassword] = useState(formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);

  const passwordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'No password', color: 'gray' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*]/.test(pwd)) score++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['red', 'orange', 'yellow', 'blue', 'emerald', 'emerald'];
    
    return {
      score: Math.min(score, 5),
      label: labels[Math.min(score, 5)],
      color: colors[Math.min(score, 5)]
    };
  };

  const strength = passwordStrength(password);

  const handleGoogleSuccess = (credentialResponse) => {
    setFormData({
      authMethod: 'google',
      googleData: credentialResponse,
      email: credentialResponse.email || '',
      socialData: credentialResponse
    });
    onNext();
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (strength.score < 2) {
      setError('Password is too weak. Use uppercase, lowercase, numbers, and symbols');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setValidating(true);
    
    // Simulate email verification API call
    setTimeout(() => {
      setFormData({
        authMethod: 'email',
        email,
        password,
        confirmPassword
      });
      setValidating(false);
      onNext();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-gray-600">Sign up with email or social account</p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={validating}
            />
          </div>
          {email && validateEmail(email) && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle size={14} /> Valid email format
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={validating}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${strength.color}-500 transition-all`}
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      backgroundColor: {
                        red: '#ef4444',
                        orange: '#f97316',
                        yellow: '#eab308',
                        blue: '#3b82f6',
                        emerald: '#10b981'
                      }[strength.color]
                    }}
                  />
                </div>
                <span className={`text-xs font-medium text-${strength.color}-600`}>
                  {strength.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Include uppercase, lowercase, numbers, and symbols for better security
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={validating}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password && confirmPassword && password === confirmPassword && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle size={14} /> Passwords match
            </p>
          )}
        </div>

        {/* Email Submit Button */}
        <button
          type="submit"
          disabled={validating}
          className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {validating ? (
            <>
              <Loader size={18} className="animate-spin" />
              Verifying...
            </>
          ) : (
            'Continue with Email'
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        {/* Social Auth */}
        <div className="space-y-3">
          <GoogleSignIn onSuccess={handleGoogleSuccess} />
        </div>
      </form>

      {/* Security Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">🔒 Your data is secure</span>
          <br />
          We never share your email. Passwords are encrypted with industry-standard protocols.
        </p>
      </div>

      {/* Navigation */}
      <button
        type="button"
        onClick={onPrev}
        className="w-full mt-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
      >
        Back
      </button>
    </div>
  );
};

export default Step2Authentication;
