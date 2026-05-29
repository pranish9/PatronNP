import React from 'react';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Step4Success = ({ formData }) => {
  const navigate = useNavigate();

  const handleViewPage = () => {
    // Save user data
    localStorage.setItem('user', JSON.stringify({
      name: formData.name,
      email: formData.email,
      uniqueUrl: formData.uniqueUrl,
      category: formData.category,
      paymentConnected: formData.paymentConnected,
      paymentMethod: formData.paymentMethod,
      authMethod: formData.authMethod
    }));

    // Redirect to home for now (creator page route can be added later)
    navigate('/');
  };

  const handleExplore = () => {
    navigate('/');
  };

  return (
    <div className="text-center py-8">
      {/* Success Icon */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 opacity-20 rounded-full blur-2xl"></div>
          <CheckCircle2 size={80} className="text-emerald-600 relative" />
        </div>
      </div>

      {/* Main Message */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Welcome, Creator!
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        Your PatronNP page is ready to share with the world.
      </p>

      {/* Details Card */}
      <div className="mt-8 mb-8 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl">
        <div className="space-y-4">
          <div className="text-left">
            <p className="text-sm text-emerald-700 font-semibold">Creator Name</p>
            <p className="text-xl font-bold text-emerald-900">{formData.name}</p>
          </div>
          <div className="h-px bg-emerald-200"></div>
          <div className="text-left">
            <p className="text-sm text-emerald-700 font-semibold">Your Creator URL</p>
            <p className="text-lg font-bold text-emerald-900 break-all">
              patronnp.com/{formData.uniqueUrl}
            </p>
          </div>
          {formData.category && (
            <>
              <div className="h-px bg-emerald-200"></div>
              <div className="text-left">
                <p className="text-sm text-emerald-700 font-semibold">Category</p>
                <p className="text-lg font-semibold text-emerald-900">{formData.category}</p>
              </div>
            </>
          )}
          {formData.paymentConnected && (
            <>
              <div className="h-px bg-emerald-200"></div>
              <div className="text-left">
                <p className="text-sm text-emerald-700 font-semibold">Payment Method</p>
                <p className="text-lg font-semibold text-emerald-900 capitalize">
                  {formData.paymentMethod === 'esewa' ? 'eSewa' : 
                   formData.paymentMethod === 'khalti' ? 'Khalti' : 
                   'Bank Transfer'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div className="text-left">
            <p className="font-semibold text-blue-900">Next Steps:</p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Share your creator page with your audience</li>
              <li>Complete your profile bio and add a profile picture</li>
              {!formData.paymentConnected && <li>Add a payment method to start receiving funds</li>}
              <li>Create your first tier or set up donation buttons</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleViewPage}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 group"
        >
          View My Creator Page
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleExplore}
          className="w-full py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Explore Other Creators
        </button>
      </div>

      {/* Trust Message */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">🎉 Congratulations!</span> You're now part of the PatronNP community supporting Nepali creators.
        </p>
      </div>

      {/* Social Sharing Hint */}
      <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-xs text-orange-900">
          <span className="font-semibold">💡 Pro Tip:</span> Share your link on social media, TikTok, YouTube, and other platforms to start earning!
        </p>
      </div>
    </div>
  );
};

export default Step4Success;
