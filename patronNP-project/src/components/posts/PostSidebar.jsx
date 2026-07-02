import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Globe, Users, Lock, Check, X } from "lucide-react";
import toast from "react-hot-toast";

import usePostStore from "../../stores/postStore";
import PromptModal from "./PromptModal";

const MIN_SCHEDULE_LEAD_MS = 5 * 60 * 1000;

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time, not a UTC ISO string.
const toDatetimeLocalString = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public", icon: Globe, desc: "Visible to all your followers and the public." },
  { value: "FOLLOWERS", label: "Followers only", icon: Users, desc: "Visible only to accounts that follow you." },
  { value: "MEMBERS", label: "Members only", icon: Lock, desc: "Visible to your members only." },
];

const PostSidebar = ({
  canPublish,
  visibility,
  onVisibilityChange,
  selectedCategories,
  onToggleCategory,
  onPublishNow,
  onSaveDraft,
  onSchedule,
}) => {
  const { categories, addCategory } = usePostStore();
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [schedulePickerOpen, setSchedulePickerOpen] = useState(false);
  const [scheduleValue, setScheduleValue] = useState("");
  const [editingCategories, setEditingCategories] = useState(false);
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);

  const publishRef = useRef(null);
  const visibilityRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (publishRef.current && !publishRef.current.contains(e.target)) setPublishMenuOpen(false);
      if (visibilityRef.current && !visibilityRef.current.contains(e.target)) setVisibilityOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedVisibility = VISIBILITY_OPTIONS.find((v) => v.value === visibility) || VISIBILITY_OPTIONS[0];

  const handleNewCategory = (name) => {
    addCategory(name);
    setNewCategoryModalOpen(false);
  };

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-4">
      <div className="flex items-center gap-2 relative" ref={publishRef}>
        <button
          onClick={onPublishNow}
          disabled={!canPublish}
          className="flex-1 px-5 py-3 bg-patron-gray-200 text-patron-gray-500 enabled:bg-patron-green-600 enabled:text-white enabled:hover:bg-patron-green-700 font-semibold rounded-full transition-colors disabled:cursor-not-allowed"
        >
          Publish now
        </button>
        <button
          onClick={() => setPublishMenuOpen((v) => !v)}
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border border-patron-gray-300 hover:bg-patron-gray-50"
        >
          {publishMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {publishMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-patron-white border border-patron-gray-200 rounded-xl shadow-xl py-1 z-20">
            <button
              onClick={() => {
                setPublishMenuOpen(false);
                setSchedulePickerOpen(true);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-patron-gray-50"
            >
              Set publish date
            </button>
            <button
              onClick={() => {
                setPublishMenuOpen(false);
                onSaveDraft();
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-patron-gray-50"
            >
              Save as draft
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-patron-gray-400 -mt-2">
        This post must follow the Community Guidelines.
      </p>

      {schedulePickerOpen && (
        <div className="bg-patron-gray-50 border border-patron-gray-200 rounded-xl p-3 space-y-2">
          <label className="text-xs font-semibold text-patron-gray-600">Publish date & time</label>
          <input
            type="datetime-local"
            value={scheduleValue}
            min={toDatetimeLocalString(new Date(Date.now() + MIN_SCHEDULE_LEAD_MS))}
            onChange={(e) => setScheduleValue(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-patron-white border border-patron-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
          />
          <p className="text-[11px] text-patron-gray-400">Must be at least 5 minutes from now.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSchedulePickerOpen(false)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-patron-gray-200 hover:bg-patron-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!scheduleValue) return;
                if (new Date(scheduleValue).getTime() < Date.now() + MIN_SCHEDULE_LEAD_MS) {
                  toast.error("Pick a time at least 5 minutes from now");
                  return;
                }
                onSchedule(scheduleValue);
                setSchedulePickerOpen(false);
              }}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-patron-green-600 text-white hover:bg-patron-green-700"
            >
              Schedule
            </button>
          </div>
        </div>
      )}

      <div className="bg-patron-white rounded-2xl border border-patron-gray-200 p-4 space-y-3">
        <label className="text-sm font-bold text-patron-black">Who can see this post?</label>
        <div className="relative" ref={visibilityRef}>
          <button
            onClick={() => setVisibilityOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border border-patron-black rounded-xl text-sm font-medium text-patron-black"
          >
            <span className="flex items-center gap-2">
              <selectedVisibility.icon size={16} />
              {selectedVisibility.label}
            </span>
            <ChevronDown size={16} className={`transition-transform ${visibilityOpen ? "rotate-180" : ""}`} />
          </button>

          {visibilityOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-patron-white border border-patron-gray-200 rounded-xl shadow-xl py-1 z-20">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onVisibilityChange(opt.value);
                    setVisibilityOpen(false);
                  }}
                  className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left hover:bg-patron-gray-50"
                >
                  <opt.icon size={16} className="mt-0.5 shrink-0 text-patron-gray-600" />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-patron-black">
                      {opt.label}
                      {opt.value === visibility && <Check size={14} className="text-patron-green-600" />}
                    </span>
                    <span className="block text-xs text-patron-gray-400">{opt.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-patron-white rounded-2xl border border-patron-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-patron-black">Categories</h3>
          <button
            onClick={() => setEditingCategories((v) => !v)}
            className="text-xs font-semibold text-patron-gray-500 bg-patron-gray-100 px-2.5 py-1 rounded-full hover:bg-patron-gray-200"
          >
            {editingCategories ? "Done" : "Edit"}
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-xs text-patron-gray-400">No categories yet.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm text-patron-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => onToggleCategory(cat)}
                    className="rounded"
                  />
                  {cat}
                </label>
                {editingCategories && (
                  <button
                    onClick={() => usePostStore.getState().removeCategory(cat)}
                    className="text-patron-gray-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setNewCategoryModalOpen(true)}
          className="w-full text-center text-sm font-semibold text-patron-gray-700 bg-patron-gray-100 hover:bg-patron-gray-200 py-2.5 rounded-xl transition-colors"
        >
          + New category
        </button>
      </div>

      <PromptModal
        isOpen={newCategoryModalOpen}
        title="New category"
        label="Category name"
        placeholder="e.g. Behind the scenes"
        confirmLabel="Add"
        onConfirm={handleNewCategory}
        onClose={() => setNewCategoryModalOpen(false)}
      />
    </div>
  );
};

export default PostSidebar;
