import { useEffect, useState } from "react";
import { X, Upload, Check, Plus } from "lucide-react";

const REWARD_TEMPLATES = [
  "Support me on a monthly basis",
  "Unlock exclusive posts and messages",
  "Shout out for new members",
  "Access to full library",
  "Free & discounted extras",
];

const emptyForm = {
  name: "",
  description: "",
  monthlyPrice: "",
  yearlyPrice: "",
  welcomeNote: "Thank you for joining my membership! 🎉",
  rewards: [],
  limitMembers: false,
  memberLimit: "",
};

const LevelFormModal = ({ isOpen, level, onClose, onSave }) => {
  const [form, setForm] = useState(emptyForm);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [rewardInput, setRewardInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (level) {
      setForm({
        name: level.name || "",
        description: level.description || "",
        monthlyPrice: level.monthlyPrice ?? "",
        yearlyPrice: level.yearlyPrice ?? "",
        welcomeNote: level.welcomeNote || emptyForm.welcomeNote,
        rewards: level.rewards || [],
        limitMembers: level.limitMembers || false,
        memberLimit: level.memberLimit ?? "",
      });
      setCoverImageUrl(level.coverImageUrl || null);
    } else {
      setForm(emptyForm);
      setCoverImageUrl(null);
    }
    setCoverImageFile(null);
    setRewardInput("");
  }, [isOpen, level]);

  if (!isOpen) return null;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addReward = (text) => {
    const value = text.trim();
    if (!value || form.rewards.includes(value)) return;
    set({ rewards: [...form.rewards, value] });
    setRewardInput("");
  };

  const removeReward = (value) => set({ rewards: form.rewards.filter((r) => r !== value) });

  const handleSave = async (publish) => {
    if (!form.name.trim()) return;
    if (!form.monthlyPrice || Number(form.monthlyPrice) <= 0) return;

    setSaving(true);
    try {
      await onSave(
        {
          ...form,
          monthlyPrice: Number(form.monthlyPrice),
          yearlyPrice: form.yearlyPrice === "" ? null : Number(form.yearlyPrice),
          memberLimit: form.limitMembers && form.memberLimit !== "" ? Number(form.memberLimit) : null,
        },
        { coverImage: coverImageFile, publish }
      );
    } finally {
      setSaving(false);
    }
  };

  const previewPrice = form.monthlyPrice || 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-patron-gray-50 w-full max-w-3xl rounded-2xl shadow-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-patron-white hover:bg-patron-gray-100 z-10"
        >
          <X size={18} />
        </button>

        <div className="grid sm:grid-cols-3 gap-6 p-5 sm:p-8">
          {/* Form */}
          <div className="sm:col-span-2 space-y-5">
            <h2 className="text-lg font-bold text-patron-black">
              {level ? "Edit membership level" : "New membership level"}
            </h2>

            <div>
              <label className="text-sm font-bold text-patron-black">Membership level name</label>
              <input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Bronze level"
                className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-white border border-patron-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-patron-black">Price</label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <div className="flex items-center bg-patron-white border border-patron-gray-200 rounded-2xl px-4">
                  <span className="text-patron-gray-500 text-sm">Rs</span>
                  <input
                    type="number"
                    min="1"
                    value={form.monthlyPrice}
                    onChange={(e) => set({ monthlyPrice: e.target.value })}
                    placeholder="5"
                    className="flex-1 min-w-0 px-2 py-3 text-sm bg-transparent border-none focus:outline-none"
                  />
                  <span className="text-xs text-patron-gray-400 shrink-0">/ month</span>
                </div>
                <div className="flex items-center bg-patron-white border border-patron-gray-200 rounded-2xl px-4">
                  <span className="text-patron-gray-500 text-sm">Rs</span>
                  <input
                    type="number"
                    min="0"
                    value={form.yearlyPrice}
                    onChange={(e) => set({ yearlyPrice: e.target.value })}
                    placeholder="Optional"
                    className="flex-1 min-w-0 px-2 py-3 text-sm bg-transparent border-none focus:outline-none"
                  />
                  <span className="text-xs text-patron-gray-400 shrink-0">/ year</span>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-patron-gray-400">
                Leave yearly blank to offer monthly billing only.
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-patron-black">Description (optional)</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Help supporters see the value in joining your membership level."
                className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-white border border-patron-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-patron-black">Cover image (optional)</label>
              {coverImageUrl ? (
                <div className="mt-1.5 relative w-40 h-24">
                  <img src={coverImageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    onClick={() => {
                      setCoverImageUrl(null);
                      setCoverImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-patron-black text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="mt-1.5 flex flex-col items-center justify-center gap-1 w-40 h-24 border-2 border-dashed border-patron-gray-300 rounded-xl cursor-pointer text-patron-gray-400 hover:border-patron-gray-400 bg-patron-white">
                  <Upload size={16} />
                  <span className="text-xs">Upload cover image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setCoverImageFile(file);
                      setCoverImageUrl(URL.createObjectURL(file));
                    }}
                  />
                </label>
              )}
              <p className="mt-1.5 text-xs text-patron-gray-400">Recommended size: 250px x 150px</p>
            </div>

            <div>
              <label className="text-sm font-bold text-patron-black">Rewards</label>
              <p className="text-xs text-patron-gray-400 mb-2">
                Rewards could be anything from exclusive posts to a thank you message.
              </p>

              <div className="space-y-2">
                {form.rewards.map((r) => (
                  <div
                    key={r}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 bg-patron-orange-50 border border-patron-orange-100 rounded-xl text-sm text-patron-black"
                  >
                    <span className="truncate">{r}</span>
                    <button onClick={() => removeReward(r)} className="text-patron-gray-400 hover:text-patron-gray-600 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {REWARD_TEMPLATES.filter((t) => !form.rewards.includes(t)).map((t) => (
                  <button
                    key={t}
                    onClick={() => addReward(t)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-patron-white border border-patron-gray-200 rounded-full text-patron-gray-700 hover:border-patron-green-400 hover:text-patron-green-700"
                  >
                    <Plus size={11} />
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex gap-2">
                <input
                  value={rewardInput}
                  onChange={(e) => setRewardInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addReward(rewardInput);
                    }
                  }}
                  placeholder="Add a custom reward"
                  className="flex-1 px-3 py-2 text-sm bg-patron-white border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
                <button
                  onClick={() => addReward(rewardInput)}
                  className="px-3 py-2 border border-patron-gray-300 rounded-xl text-sm font-semibold text-patron-black hover:bg-patron-white"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-patron-black">Welcome note</label>
              </div>
              <p className="text-xs text-patron-gray-400 mb-1.5">
                Shown after payment and in the welcome email.
              </p>
              <textarea
                rows={2}
                value={form.welcomeNote}
                onChange={(e) => set({ welcomeNote: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-patron-white border border-patron-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            </div>

            <div className="bg-patron-white border border-patron-gray-200 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-patron-black mb-3">Advanced settings</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-patron-gray-700">Limit the number of members</span>
                <button
                  onClick={() => set({ limitMembers: !form.limitMembers })}
                  className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
                    form.limitMembers ? "bg-patron-green-600" : "bg-patron-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      form.limitMembers ? "translate-x-4" : ""
                    }`}
                  />
                </button>
              </div>
              {form.limitMembers && (
                <input
                  type="number"
                  min="1"
                  value={form.memberLimit}
                  onChange={(e) => set({ memberLimit: e.target.value })}
                  placeholder="Number of members"
                  className="mt-2 w-full px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-patron-white border border-patron-gray-300 text-sm font-semibold rounded-xl disabled:opacity-50"
              >
                Save as draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-patron-green-600 hover:bg-patron-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-50"
              >
                {level ? "Save & publish" : "Create & publish"}
              </button>
            </div>
          </div>

          {/* Live preview */}
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-patron-gray-400 uppercase tracking-wide mb-2">Level preview</p>
            <div className="bg-patron-white rounded-2xl border border-patron-gray-200 shadow-sm p-5 sticky top-8">
              {coverImageUrl && (
                <img src={coverImageUrl} alt="" className="w-full h-24 object-cover rounded-xl mb-3" />
              )}
              <h4 className="text-base font-bold text-patron-black">{form.name || "Level name"}</h4>
              <p className="mt-1">
                <span className="text-2xl font-bold text-patron-black">Rs {previewPrice || 0}</span>
                <span className="text-patron-gray-400 text-xs"> / month</span>
              </p>
              <button className="mt-3 w-full py-2.5 bg-patron-green-600 text-white text-sm font-bold rounded-full">
                Join
              </button>
              <ul className="mt-4 space-y-1.5">
                {form.rewards.length === 0 ? (
                  <li className="text-xs text-patron-gray-400">Add rewards to show them here</li>
                ) : (
                  form.rewards.map((r) => (
                    <li key={r} className="flex items-start gap-1.5 text-xs text-patron-gray-600">
                      <Check size={12} className="text-patron-green-600 shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelFormModal;
