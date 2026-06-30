import { useState, useEffect, useRef } from "react";
import { Radio, Copy, Check, ChevronLeft, ChevronDown, ChevronUp, Play, Coffee } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/creatorLayout/Layout";
import Button from "../components/Button";
import { useLanguage } from "../hooks/useLanguage";
import { getStreamAlertSettings, updateStreamAlertSettings, sendTestStreamAlert } from "../services/streamAlertService";

const POSITIONS = [
  "TOP_LEFT", "TOP_CENTER", "TOP_RIGHT",
  "CENTER_LEFT", "CENTER_RIGHT",
  "BOTTOM_LEFT", "BOTTOM_CENTER", "BOTTOM_RIGHT",
];

const POSITION_LABELS = {
  TOP_LEFT: (t) => t('stream.positionTopLeft'),
  TOP_CENTER: (t) => t('stream.positionTopCenter'),
  TOP_RIGHT: (t) => t('stream.positionTopRight'),
  CENTER_LEFT: (t) => t('stream.positionCenterLeft'),
  CENTER_RIGHT: (t) => t('stream.positionCenterRight'),
  BOTTOM_LEFT: (t) => t('stream.positionBottomLeft'),
  BOTTOM_CENTER: (t) => t('stream.positionBottomCenter'),
  BOTTOM_RIGHT: (t) => t('stream.positionBottomRight'),
};

const SOUND_OPTIONS = ["default.mp3", "chime.mp3", "coin.mp3", "none"];

const COLOR_SWATCHES = ["#a78bfa", "#38bdf8", "#4ade80", "#facc15", "#fb923c", "#f472b6", "#FFFFFF"];

const renderPreviewText = (template, t) => {
  const parts = template.split(/(\{username\}|\{amount\}|\{message\})/g);
  return parts.map((part, i) => {
    if (part === "{username}" || part === "{amount}") {
      return (
        <span key={i} className="text-amber-300 font-bold">
          {part === "{username}" ? t('stream.testSupporterName') : "NPR 100"}
        </span>
      );
    }
    if (part === "{message}") {
      return <span key={i}>{t('stream.testMessage')}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

const StreamAlertsPanel = ({ onBack }) => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    getStreamAlertSettings()
      .then(setSettings)
      .catch(() => toast.error(t('errors.somethingWrong')))
      .finally(() => setLoading(false));
  }, [t]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateStreamAlertSettings({
        enabled: settings.enabled,
        alertTextTemplate: settings.alertTextTemplate,
        ctaText: settings.ctaText,
        position: settings.position,
        textColor: settings.textColor,
        soundFile: settings.soundFile,
        ctaOpacity: settings.ctaOpacity,
      });
      setSettings(updated);
      toast.success(t('common.success'));
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(settings.browserSourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestAlert = async () => {
    setTesting(true);
    try {
      await sendTestStreamAlert();
      toast.success(t('stream.testAlertSent'));
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setTesting(false);
    }
  };

  const playSound = () => {
    if (settings.soundFile === "none") return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  if (loading || !settings) {
    return <div className="py-16 text-center text-gray-400 text-sm">{t('common.loading')}</div>;
  }

  const ctaOpacityPct = settings.ctaOpacity ?? 100;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ChevronLeft size={16} /> {t('common.back')}
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{t('stream.title')}</h2>
        <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
          <span className="text-sm font-medium text-gray-700">{t('stream.enable')}</span>
          <div
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
              settings.enabled ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </label>
      </div>

      {/* Live preview */}
      <div className="rounded-2xl overflow-hidden bg-gray-500 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[280px]">
        <Coffee size={56} className="text-amber-300 mb-4 animate-bounce" />
        <p className="text-white font-bold text-base sm:text-lg leading-snug max-w-md">
          {renderPreviewText(settings.alertTextTemplate, t)}
        </p>
        {settings.ctaText && (
          <div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold"
            style={{ backgroundColor: `rgba(0,0,0,${ctaOpacityPct / 100})` }}
          >
            <Coffee size={16} className="text-amber-300" />
            {settings.ctaText}
          </div>
        )}
      </div>

      {/* Browser source URL + test alert */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm">{t('stream.browserSourceUrl')}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{t('stream.browserSourceDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <input
            readOnly
            value={settings.browserSourceUrl}
            className="flex-1 min-w-0 px-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50 font-mono truncate"
          />
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={copyUrl}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t('stream.copied') : t('stream.copy')}
            </Button>
            <Button variant="accent" size="sm" onClick={handleTestAlert} isLoading={testing}>
              {t('stream.sendTestAlert')}
            </Button>
          </div>
        </div>
      </div>

      {/* Alert text */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm">{t('stream.alertTextTitle')}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{t('stream.alertTextDesc')}</p>
        <textarea
          value={settings.alertTextTemplate}
          onChange={(e) => setSettings({ ...settings, alertTextTemplate: e.target.value })}
          rows={2}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      {/* Advanced settings */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <h3 className="font-bold text-gray-900 text-sm">{t('stream.advancedSettings')}</h3>
          {advancedOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {advancedOpen && (
          <div className="px-5 pb-5 space-y-5">
            {/* CTA */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">{t('stream.ctaTitle')}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{t('stream.ctaDesc')}</p>
              <input
                type="text"
                value={settings.ctaText}
                onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* CTA opacity */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">{t('stream.ctaOpacityTitle')}</h4>
              <input
                type="range"
                min="0"
                max="100"
                value={ctaOpacityPct}
                onChange={(e) => setSettings({ ...settings, ctaOpacity: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Text color swatches */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">{t('stream.textColorTitle')}</h4>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSettings({ ...settings, textColor: color })}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform ${
                      settings.textColor === color ? "border-gray-800 scale-110" : "border-gray-200"
                    }`}
                  >
                    {settings.textColor === color && (
                      <Check size={14} className={color === "#FFFFFF" ? "text-gray-800" : "text-white"} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">{t('stream.positionTitle')}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{t('stream.positionDesc')}</p>
              <select
                value={settings.position}
                onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>{POSITION_LABELS[pos](t)}</option>
                ))}
              </select>
            </div>

            {/* Sound */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">{t('stream.soundTitle')}</h4>
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
                <button
                  type="button"
                  onClick={playSound}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 shrink-0"
                  aria-label={t('stream.play')}
                >
                  <Play size={14} />
                </button>
                <select
                  value={settings.soundFile}
                  onChange={(e) => setSettings({ ...settings, soundFile: e.target.value })}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                >
                  {SOUND_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {settings.soundFile !== "none" && (
                <audio ref={audioRef} src={`/sounds/${settings.soundFile}`} />
              )}
            </div>

            {/* GIF overlay info */}
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800 text-sm">{t('stream.gifOverlayTitle')}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{t('stream.gifOverlayDesc')}</p>
            </div>
          </div>
        )}
      </div>

      <Button variant="primary" onClick={handleSave} isLoading={saving} className="w-full sm:w-auto">
        {t('common.save')}
      </Button>
    </div>
  );
};

const Integrations = () => {
  const { t } = useLanguage();
  const [activePanel, setActivePanel] = useState(null);

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            {activePanel === "stream-alerts" ? (
              <StreamAlertsPanel onBack={() => setActivePanel(null)} />
            ) : (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t('common.settings')}</h1>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActivePanel("stream-alerts")}
                    className="text-left bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 mb-3">
                      <Radio size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{t('stream.title')}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">{t('stream.description')}</p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Integrations;
