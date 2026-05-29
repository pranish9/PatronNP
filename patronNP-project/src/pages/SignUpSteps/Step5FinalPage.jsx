import React, { useState } from 'react';
import { Download, Share2, Smile, Copy, ExternalLink, CheckCircle } from 'lucide-react';

const Step5FinalPage = ({ formData, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const publicUrl = `https://patronnp.com/${formData.username}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: `Support ${formData.displayName} on PatronNP`,
        text: `Check out my creator page on PatronNP!`,
        url: publicUrl
      });
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-30"></div>
              <CheckCircle size={48} className="text-emerald-600 relative" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Creator Page is Ready!</h1>
          <p className="text-gray-600 text-lg">
            Welcome to PatronNP, {formData.displayName}! Your public page is now live.
          </p>
        </div>

        {/* URL Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-emerald-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Your Public Page</p>
          <div className="flex items-center gap-2 mb-4">
            <code className="flex-1 px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-900 break-all">
              {publicUrl}
            </code>
            <button
              onClick={handleCopyUrl}
              className="flex-shrink-0 p-3 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
              title="Copy URL"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {copied ? '✓ Copied to clipboard!' : 'Click to copy your unique URL'}
          </p>
        </div>

        {/* Page Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              {/* Header Background */}
              <div className="h-32 bg-gradient-to-r from-emerald-500 to-blue-500"></div>

              <div className="px-6 pb-6">
                {/* Profile Section */}
                <div className="flex items-start gap-4 -mt-16 mb-6 relative z-10">
                  {formData.profilePictureUrl ? (
                    <img
                      src={formData.profilePictureUrl}
                      alt={formData.displayName}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center">
                      <Smile size={40} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 mt-4">
                    <h2 className="text-2xl font-bold text-gray-900">{formData.displayName}</h2>
                    <p className="text-sm text-emerald-600 font-semibold">@{formData.username}</p>
                  </div>
                </div>

                {/* About Section */}
                {formData.about && (
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">{formData.about}</p>
                  </div>
                )}

                {/* Social Links */}
                {Object.entries(formData.socialLinks).some(([_, url]) => url) && (
                  <div className="mb-6 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Connect</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.socialLinks).map(([platform, url]) =>
                        url ? (
                          <a
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-colors text-xs font-medium"
                          >
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            <ExternalLink size={12} />
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Support Section */}
                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm font-semibold text-emerald-900 mb-3">💝 Support This Creator</p>
                  <button
                    className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Buy Me a Coffee
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Auth Method</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{formData.authMethod}</p>
                </div>
                {formData.paymentMethods.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600">Payment Methods</p>
                    <div className="flex gap-2 mt-1">
                      {formData.paymentMethods.map(method => (
                        <span
                          key={method}
                          className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded capitalize"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-blue-900 mb-3">📋 Next Steps</h3>
              <ul className="text-xs text-blue-900 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Share your creator page link with supporters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Customize your page from the dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Start receiving support from your community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={handleShareUrl}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 border border-emerald-200 transition-colors"
          >
            <Share2 size={18} />
            Share Page
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <ExternalLink size={18} />
            View Public Page
          </a>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Celebration */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Your account is ready to receive support from the community! 🎉
          </p>
          <button
            onClick={onRestart}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Create Another Account →
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-10 right-10 text-6xl opacity-10 pointer-events-none animate-pulse">
        💝
      </div>
      <div className="fixed bottom-10 left-10 text-6xl opacity-10 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        ✨
      </div>
    </div>
  );
};

export default Step5FinalPage;
