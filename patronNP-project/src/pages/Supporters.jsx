import { useState, useEffect, useCallback } from "react";
import { Heart, Calendar, Wallet, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/creatorLayout/Layout";
import userService from "../services/userService";
import { getRecentSupporters } from "../services/supporterService";

const METAPHORS = [
  { value: "coffee", emoji: "☕", label: "Coffee" },
  { value: "tea", emoji: "🍵", label: "Tea" },
  { value: "beer", emoji: "🍺", label: "Beer" },
  { value: "pizza", emoji: "🍕", label: "Pizza" },
  { value: "book", emoji: "📖", label: "Book" },
];

const PRICE_PRESETS = [50, 100, 200];
const BUTTON_WORDING_OPTIONS = ["Support", "Buy", "Donate", "Tip"];

const emojiFor = (label) => METAPHORS.find((m) => m.value === label)?.emoji || "☕";

const Supporters = () => {
  const username = localStorage.getItem("username") || "";
  const [activeTab, setActiveTab] = useState("one-time");

  // One-time tab state
  const [stats, setStats] = useState({ supporterCount: 0, last30DaysEarnings: 0, allTimeEarnings: 0 });
  const [supporters, setSupporters] = useState([]);
  const [loadingOneTime, setLoadingOneTime] = useState(true);
  const [oneTimeLoaded, setOneTimeLoaded] = useState(false);

  useEffect(() => {
    if (activeTab !== "one-time" || oneTimeLoaded) return;
    Promise.all([
      userService.getCreatorStats().catch(() => ({ data: null })),
      username ? getRecentSupporters(username, 0, 10).catch(() => ({ content: [] })) : Promise.resolve({ content: [] }),
    ]).then(([statsRes, supportersRes]) => {
      if (statsRes.data) setStats(statsRes.data);
      // getRecentSupporters is shared with the public creator page (which intentionally
      // shows shop/membership activity too) — this tab is one-time tips only, so filter here.
      setSupporters((supportersRes.content || []).filter((s) => s.category === "TIP"));
      setLoadingOneTime(false);
      setOneTimeLoaded(true);
    });
  }, [activeTab, username, oneTimeLoaded]);

  // Settings tab state
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeTab !== "settings" || settings) return;
    userService
      .getCreatorSettings()
      .then((res) => setSettings(res.data))
      .catch(() =>
        setSettings({
          supportUnitPrice: 100,
          supportUnitLabel: "coffee",
          supportUnitEmoji: "☕",
          buttonWording: "Support",
          thankYouMessage: "Thank you for the support!",
          layoutType: "STANDARD",
        })
      )
      .finally(() => setLoadingSettings(false));
  }, [activeTab, settings]);

  const saveSettings = useCallback(
    async (patch) => {
      setSaving(true);
      try {
        const res = await userService.updateCreatorSettings(patch);
        setSettings(res.data);
        setEditingField(null);
        toast.success("Settings saved");
      } catch {
        toast.error("Failed to save settings");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const startEdit = (field, initialDraft) => {
    setEditingField(field);
    setDraft(initialDraft);
  };

  return (
    <Layout>
      <div className="bg-patron-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-patron-black">Supporters</h1>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-patron-gray-200">
            {[
              { id: "one-time", label: "One-time" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? "text-patron-black border-patron-black"
                    : "text-patron-gray-400 border-transparent hover:text-patron-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "one-time" && (
            <div className="space-y-4">
              {/* Stat cards */}
              <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-patron-gray-100 rounded-xl p-4">
                    <p className="text-2xl font-bold text-patron-black">
                      {loadingOneTime ? "—" : stats.supporterCount}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-patron-gray-500 mt-1">
                      <Heart size={13} />
                      Supporter
                    </p>
                  </div>
                  <div className="bg-patron-gray-100 rounded-xl p-4">
                    <p className="text-2xl font-bold text-patron-black">
                      {loadingOneTime ? "—" : `NPR ${Math.round(stats.last30DaysEarnings).toLocaleString()}`}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-patron-gray-500 mt-1">
                      <Calendar size={13} />
                      Last 30 days
                    </p>
                  </div>
                  <div className="bg-patron-gray-100 rounded-xl p-4">
                    <p className="text-2xl font-bold text-patron-black">
                      {loadingOneTime ? "—" : `NPR ${Math.round(stats.allTimeEarnings).toLocaleString()}`}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-patron-gray-500 mt-1">
                      <Wallet size={13} />
                      All-time
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporters list / empty state */}
              <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-6 sm:p-8">
                {loadingOneTime ? (
                  <div className="py-8 text-center text-patron-gray-400 text-sm">Loading...</div>
                ) : supporters.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-patron-gray-100 text-patron-gray-500 flex items-center justify-center mx-auto mb-4">
                      <Heart size={20} />
                    </div>
                    <h3 className="font-bold text-patron-black">
                      Your first supporter is closer than you think!
                    </h3>
                    <p className="text-sm text-patron-gray-500 mt-1">
                      Share your page on social media to help them find you.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-patron-gray-100">
                    {supporters.map((s, i) => (
                      <div key={`${s.supporterName}-${s.createdAt}-${i}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="w-9 h-9 rounded-full bg-patron-orange-50 text-patron-orange-600 flex items-center justify-center shrink-0">
                          <Heart size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-patron-black">
                            <span className="font-semibold">{s.supporterName}</span>{" "}
                            <span className="text-patron-gray-500">sent NPR {s.amount}</span>
                          </p>
                          {s.message && (
                            <p className="text-sm text-patron-gray-600 mt-1 italic">"{s.message}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              {loadingSettings || !settings ? (
                <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
                  Loading...
                </div>
              ) : (
                <>
                  {/* Thank you message */}
                  <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                    <h2 className="font-bold text-patron-black mb-1">Thank you message</h2>
                    <p className="text-sm text-patron-gray-500 mb-3">
                      This will be visible after the payment and in the receipt email.
                    </p>
                    <textarea
                      rows={3}
                      value={settings.thankYouMessage || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, thankYouMessage: e.target.value }))}
                      className="w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                    />
                    <button
                      onClick={() => saveSettings({ thankYouMessage: settings.thankYouMessage })}
                      disabled={saving}
                      className="mt-3 px-5 py-2 bg-patron-black text-patron-white text-sm font-semibold rounded-xl hover:bg-patron-gray-800 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>

                  {/* Choose a layout */}
                  <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
                    <h2 className="font-bold text-patron-black mb-4">Choose a layout</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { value: "STANDARD", label: "Standard view" },
                        { value: "SUGGESTED", label: "Suggested amounts" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => saveSettings({ layoutType: opt.value })}
                          className={`text-left rounded-2xl border-2 p-4 transition-colors ${
                            settings.layoutType === opt.value
                              ? "border-patron-black"
                              : "border-patron-gray-200 hover:border-patron-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                settings.layoutType === opt.value ? "border-patron-black" : "border-patron-gray-300"
                              }`}
                            >
                              {settings.layoutType === opt.value && (
                                <span className="w-2 h-2 rounded-full bg-patron-black" />
                              )}
                            </span>
                            <span className="text-sm font-semibold text-patron-black">{opt.label}</span>
                          </div>

                          {opt.value === "STANDARD" ? (
                            <div className="bg-patron-gray-50 rounded-xl p-3 space-y-2 pointer-events-none">
                              <div className="flex items-center gap-2 bg-patron-orange-50 rounded-lg p-2">
                                <span className="text-sm">{emojiFor(settings.supportUnitLabel)}</span>
                                <span className="text-patron-gray-400 text-xs">×</span>
                                <span className="w-5 h-5 rounded-full bg-patron-orange-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                                <span className="w-5 h-5 rounded-full border border-patron-orange-200 text-patron-orange-500 text-[10px] flex items-center justify-center font-bold">3</span>
                              </div>
                              <div className="h-6 bg-patron-white rounded-lg" />
                              <div className="h-7 bg-patron-orange-500 rounded-full" />
                            </div>
                          ) : (
                            <div className="bg-patron-gray-50 rounded-xl p-3 space-y-2 pointer-events-none">
                              <div className="flex items-center gap-1.5">
                                <div className="h-6 flex-1 bg-patron-white rounded-lg" />
                                <span className="text-[10px] px-1.5 py-1 bg-patron-white rounded-full text-patron-gray-500">+5</span>
                                <span className="text-[10px] px-1.5 py-1 bg-patron-white rounded-full text-patron-gray-500">+10</span>
                              </div>
                              <div className="h-6 bg-patron-white rounded-lg" />
                              <div className="h-7 bg-patron-orange-500 rounded-full" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price per metaphor */}
                  <SettingsRow
                    label={`Price per "${settings.supportUnitLabel}"`}
                    value={`NPR ${settings.supportUnitPrice}`}
                    editing={editingField === "price"}
                    onEdit={() => startEdit("price", { supportUnitPrice: settings.supportUnitPrice })}
                    onCancel={() => setEditingField(null)}
                    onSave={() => saveSettings({ supportUnitPrice: draft.supportUnitPrice })}
                    saving={saving}
                  >
                    <div className="flex gap-2">
                      {PRICE_PRESETS.map((p) => (
                        <button
                          key={p}
                          onClick={() => setDraft({ supportUnitPrice: p })}
                          className={`w-16 h-11 rounded-full text-sm font-bold border-2 ${
                            draft.supportUnitPrice === p
                              ? "bg-patron-orange-500 border-patron-orange-500 text-white"
                              : "bg-patron-white border-patron-orange-200 text-patron-orange-500"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <input
                        type="number"
                        min="10"
                        value={draft.supportUnitPrice}
                        onChange={(e) => setDraft({ supportUnitPrice: parseInt(e.target.value, 10) || 0 })}
                        className="w-24 px-3 rounded-xl border border-patron-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                      />
                    </div>
                  </SettingsRow>

                  {/* Preferred metaphor */}
                  <SettingsRow
                    label="Preferred metaphor"
                    value={`${settings.supportUnitEmoji || emojiFor(settings.supportUnitLabel)} ${settings.supportUnitLabel}`}
                    editing={editingField === "metaphor"}
                    onEdit={() =>
                      startEdit("metaphor", {
                        supportUnitLabel: settings.supportUnitLabel,
                        supportUnitEmoji: settings.supportUnitEmoji || emojiFor(settings.supportUnitLabel),
                      })
                    }
                    onCancel={() => setEditingField(null)}
                    onSave={() =>
                      saveSettings({
                        supportUnitLabel: draft.supportUnitLabel,
                        supportUnitEmoji: draft.supportUnitEmoji,
                      })
                    }
                    saving={saving}
                  >
                    <div className="flex flex-wrap gap-2">
                      {METAPHORS.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setDraft({ supportUnitLabel: m.value, supportUnitEmoji: m.emoji })}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border-2 ${
                            draft.supportUnitLabel === m.value
                              ? "bg-patron-green-600 border-patron-green-600 text-white"
                              : "bg-patron-white border-patron-gray-200 text-patron-gray-700"
                          }`}
                        >
                          <span>{m.emoji}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </SettingsRow>

                  {/* Button wording */}
                  <SettingsRow
                    label="Button wording"
                    value={settings.buttonWording}
                    editing={editingField === "button"}
                    onEdit={() => startEdit("button", { buttonWording: settings.buttonWording })}
                    onCancel={() => setEditingField(null)}
                    onSave={() => saveSettings({ buttonWording: draft.buttonWording })}
                    saving={saving}
                  >
                    <select
                      value={draft.buttonWording}
                      onChange={(e) => setDraft({ buttonWording: e.target.value })}
                      className="w-full sm:w-48 px-3 py-2.5 rounded-xl border border-patron-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                    >
                      {BUTTON_WORDING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </SettingsRow>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const SettingsRow = ({ label, value, editing, onEdit, onCancel, onSave, saving, children }) => (
  <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
    <div className="flex items-center justify-between mb-1">
      <h2 className="font-bold text-patron-black">{label}</h2>
      {editing ? (
        <button onClick={onCancel} className="text-sm text-patron-gray-500 hover:underline">
          Cancel
        </button>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-patron-green-700 hover:underline"
        >
          <Pencil size={13} />
          Edit
        </button>
      )}
    </div>
    {!editing ? (
      <p className="text-patron-gray-600">{value}</p>
    ) : (
      <div className="mt-3 space-y-3">
        {children}
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 bg-patron-black text-patron-white text-sm font-semibold rounded-xl hover:bg-patron-gray-800 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    )}
  </div>
);

export default Supporters;
