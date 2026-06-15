import { useEffect, useState, useRef } from "react";
import { X, Upload, Save } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../Button";
import { openModal, closeModal } from "../../utils/jqueryModal";
import { useCreatorPage } from "../../context/CreatorPageContext";
import userService from "../../services/userService";

const OVERLAY_ID = "edit-page-modal-overlay";
const PANEL_ID = "edit-page-modal-panel";

const EditPageModal = ({ isOpen, onClose }) => {
  const { displayCreator, updateProfileDisplay } = useCreatorPage();
  const [saving, setSaving] = useState(false);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [form, setForm] = useState({
    displayName: "",
    creatingWhat: "",
    aboutMe: "",
    pageDescription: "",
    featuredVideoUrl: "",
    instagram: "",
    twitter: "",
    facebook: "",
    youtube: "",
    profilePreview: "",
    coverPreview: "",
  });

  useEffect(() => {
    if (displayCreator && isOpen) {
      setForm({
        displayName: displayCreator.displayName || "",
        creatingWhat: displayCreator.tagline || displayCreator.creatingWhat || "",
        aboutMe: displayCreator.bio || displayCreator.aboutMe || "",
        pageDescription:
          displayCreator.pageDescription || displayCreator.welcomeMessage || "",
        featuredVideoUrl:
          displayCreator.featuredVideoUrl || displayCreator.introVideoUrl || "",
        instagram: displayCreator.instagram || "",
        twitter: displayCreator.twitter || "",
        facebook: displayCreator.facebook || "",
        youtube: displayCreator.youtube || "",
        profilePreview: displayCreator.profilePictureUrl || "",
        coverPreview: displayCreator.coverImageUrl || "",
      });
    }
  }, [displayCreator, isOpen]);

  useEffect(() => {
    if (isOpen) openModal(OVERLAY_ID, PANEL_ID);
    else closeModal(OVERLAY_ID, PANEL_ID);
  }, [isOpen]);

  const handleFile = (file, field) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [field]: url }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      displayName: form.displayName,
      tagline: form.creatingWhat,
      bio: form.aboutMe,
      welcomeMessage: form.pageDescription,
      featuredVideoUrl: form.featuredVideoUrl,
      introVideoUrl: form.featuredVideoUrl,
      pageDescription: form.pageDescription,
      instagram: form.instagram,
      twitter: form.twitter,
      facebook: form.facebook,
      youtube: form.youtube,
      profilePictureUrl: form.profilePreview || displayCreator?.profilePictureUrl,
      coverImageUrl: form.coverPreview || displayCreator?.coverImageUrl,
    };

    try {
      await userService.updateProfile(payload);
      updateProfileDisplay(payload);
      toast.success("Page updated successfully!");
    } catch {
      updateProfileDisplay(payload);
      toast.success("Changes saved (preview mode)");
    } finally {
      setSaving(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const fieldClass =
    "w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30";

  return (
    <div
      id={OVERLAY_ID}
      className="patron-modal-overlay fixed inset-0 z-[200] hidden items-center justify-center bg-black/50 p-3 sm:p-4"
    >
      <div
        id={PANEL_ID}
        className="patron-modal-panel bg-patron-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 bg-patron-white border-b border-patron-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-patron-black">Edit your page</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-patron-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-patron-gray-500 mb-2">Profile photo</p>
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="w-full aspect-square rounded-xl border-2 border-dashed border-patron-gray-300 flex flex-col items-center justify-center gap-1 hover:border-patron-green-500 overflow-hidden"
              >
                {form.profilePreview ? (
                  <img src={form.profilePreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={20} className="text-patron-gray-400" />
                    <span className="text-xs text-patron-gray-500">Upload</span>
                  </>
                )}
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0], "profilePreview")}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-patron-gray-500 mb-2">Cover photo</p>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-square rounded-xl border-2 border-dashed border-patron-gray-300 flex flex-col items-center justify-center gap-1 hover:border-patron-green-500 overflow-hidden"
              >
                {form.coverPreview ? (
                  <img src={form.coverPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={20} className="text-patron-gray-400" />
                    <span className="text-xs text-patron-gray-500">Upload</span>
                  </>
                )}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0], "coverPreview")}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-patron-gray-500">Full display name</label>
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className={`${fieldClass} mt-1`}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-patron-gray-500">What are you creating?</label>
            <input
              value={form.creatingWhat}
              onChange={(e) => setForm({ ...form, creatingWhat: e.target.value })}
              className={`${fieldClass} mt-1`}
              placeholder="e.g. Music, podcasts, digital art"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-patron-gray-500">About me</label>
            <textarea
              value={form.aboutMe}
              onChange={(e) => setForm({ ...form, aboutMe: e.target.value })}
              rows={3}
              className={`${fieldClass} mt-1 resize-none`}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-patron-gray-500">What does this page do?</label>
            <textarea
              value={form.pageDescription}
              onChange={(e) => setForm({ ...form, pageDescription: e.target.value })}
              rows={2}
              className={`${fieldClass} mt-1 resize-none`}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-patron-gray-500">Featured video link</label>
            <input
              value={form.featuredVideoUrl}
              onChange={(e) => setForm({ ...form, featuredVideoUrl: e.target.value })}
              className={`${fieldClass} mt-1`}
              placeholder="YouTube or upload URL"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "instagram", label: "Instagram" },
              { key: "twitter", label: "Twitter / X" },
              { key: "facebook", label: "Facebook" },
              { key: "youtube", label: "YouTube" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs font-medium text-patron-gray-500">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={`${fieldClass} mt-1`}
                  placeholder={`@${key}`}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button variant="secondary" size="full" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              size="full"
              onClick={handleSave}
              isLoading={saving}
              className="rounded-xl"
            >
              <Save size={16} />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPageModal;
