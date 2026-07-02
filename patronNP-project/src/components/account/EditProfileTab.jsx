import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

import userService from "../../services/userService";

const COUNTRIES = [
  "Nepal", "United States", "United Kingdom", "India", "Canada", "Australia",
  "Germany", "France", "Japan", "Singapore", "United Arab Emirates", "Other",
];

const TIMEZONES = [
  "UTC", "Asia/Kathmandu", "Asia/Kolkata", "America/New_York", "America/Los_Angeles",
  "Europe/London", "Europe/Berlin", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney",
];

const EditProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    userService
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile({
        name: profile.name,
        country: profile.country,
        timezone: profile.timezone,
        photo: photoFile,
      });
      setProfile(res.data);
      setPhotoFile(null);
      setPhotoPreview(null);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await userService.changePassword(newPassword, confirmPassword);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Delete your account? This will permanently remove your access and cannot be undone."
      )
    )
      return;
    setDeleting(true);
    try {
      await userService.deleteAccount();
      toast.success("Account deleted");
      localStorage.clear();
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
        <h2 className="text-lg font-bold text-patron-black">Personal Info</h2>

        <label className="relative w-20 h-20 rounded-full bg-patron-black flex items-center justify-center cursor-pointer overflow-hidden">
          {photoPreview || profile.profilePictureUrl ? (
            <img
              src={photoPreview || profile.profilePictureUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={20} className="text-white" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPhotoFile(file);
              setPhotoPreview(URL.createObjectURL(file));
            }}
          />
        </label>

        <div>
          <label className="text-sm font-bold text-patron-black">Name</label>
          <input
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-patron-black">Email</label>
          <div className="mt-1.5 flex items-center justify-between px-4 py-3 bg-patron-gray-100 rounded-2xl">
            <span className="text-sm text-patron-gray-700">{profile.email}</span>
            <button
              type="button"
              onClick={() => toast("Contact support to change your email")}
              className="text-sm font-semibold text-patron-green-700 hover:underline"
            >
              Change email
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-patron-black">Country</label>
          <select
            value={profile.country || ""}
            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-patron-black">Timezone</label>
          <select
            value={profile.timezone || "UTC"}
            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
            className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full py-3 bg-patron-orange-500 hover:bg-patron-orange-600 text-white font-bold rounded-full disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold text-patron-black">Set a password</h2>

        <div>
          <label className="text-sm font-bold text-patron-black">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-patron-black">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
        </div>

        <button
          onClick={handleSavePassword}
          disabled={savingPassword}
          className="w-full py-3 bg-patron-orange-500 hover:bg-patron-orange-600 text-white font-bold rounded-full disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-red-600">Delete your account</h2>
          <p className="text-sm text-patron-gray-500 mt-1 max-w-md">
            Your account, along with all associated data, content, and payment information, will be
            deactivated and you will no longer be able to log in.
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full disabled:opacity-50 shrink-0"
        >
          Delete my account
        </button>
      </div>
    </div>
  );
};

export default EditProfileTab;
