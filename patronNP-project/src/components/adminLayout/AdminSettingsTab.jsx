import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";

const Toggle = ({ checked, onChange, label, description, danger }) => (
  <div className="flex items-center justify-between py-3 border-b border-patron-gray-100 last:border-b-0">
    <div className="pr-4">
      <p className="text-sm font-semibold text-patron-black">{label}</p>
      {description && <p className="text-xs text-patron-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
        checked ? (danger ? "bg-patron-orange-500" : "bg-patron-green-600") : "bg-patron-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  </div>
);

const AdminSettingsTab = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [commissionPercent, setCommissionPercent] = useState("");
  const [gatewayFeePercent, setGatewayFeePercent] = useState("");
  const [banner, setBanner] = useState("");

  const load = () => {
    setLoading(true);
    adminService
      .getSettings()
      .then((res) => {
        setSettings(res.data);
        setCommissionPercent((res.data.commissionRate * 100).toString());
        setGatewayFeePercent((res.data.esewaGatewayFeeRate * 100).toString());
        setBanner(res.data.announcementBanner || "");
      })
      .catch(() => toast.error("Failed to load platform settings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleField = async (field, value) => {
    const previous = settings[field];
    setSettings((s) => ({ ...s, [field]: value }));
    try {
      const res = await adminService.updateSettings({ [field]: value });
      setSettings(res.data);
      toast.success("Setting updated");
    } catch (err) {
      setSettings((s) => ({ ...s, [field]: previous }));
      toast.error(err.response?.data?.message || err.response?.data || "Failed to update setting");
    }
  };

  const saveRatesAndBanner = async () => {
    const commission = Number(commissionPercent);
    const gatewayFee = Number(gatewayFeePercent);
    if (Number.isNaN(commission) || commission < 0 || commission > 100) {
      toast.error("Commission rate must be between 0 and 100");
      return;
    }
    if (Number.isNaN(gatewayFee) || gatewayFee < 0 || gatewayFee > 100) {
      toast.error("Gateway fee rate must be between 0 and 100");
      return;
    }
    setSaving(true);
    try {
      const res = await adminService.updateSettings({
        commissionRate: commission / 100,
        esewaGatewayFeeRate: gatewayFee / 100,
        announcementBanner: banner,
      });
      setSettings(res.data);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="bg-patron-white rounded-2xl shadow-sm p-8 text-center text-patron-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {settings.maintenanceMode && (
        <div className="flex items-center gap-2 bg-patron-orange-50 text-patron-orange-700 text-sm font-medium rounded-xl px-4 py-3">
          <AlertTriangle size={16} />
          Maintenance mode is ON — new payments are blocked platform-wide and visitors see a maintenance page.
        </div>
      )}

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
        <h2 className="font-bold text-patron-black mb-1">Platform fees</h2>
        <p className="text-xs text-patron-gray-500 mb-4">
          Applied to every new successful transaction going forward — past transactions keep the rate they were charged at.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-patron-gray-500">Commission rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-patron-gray-500">eSewa gateway fee (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={gatewayFeePercent}
              onChange={(e) => setGatewayFeePercent(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
          </div>
        </div>
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
        <h2 className="font-bold text-patron-black mb-1">Announcement banner</h2>
        <p className="text-xs text-patron-gray-500 mb-3">Shown to every visitor across the site. Leave blank to hide it.</p>
        <textarea
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          rows={2}
          placeholder="e.g. Scheduled downtime this Friday 10pm-11pm NPT"
          className="w-full px-3 py-2 text-sm bg-patron-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30 resize-none"
        />
      </div>

      <button
        onClick={saveRatesAndBanner}
        disabled={saving}
        className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save fees & banner"}
      </button>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
        <h2 className="font-bold text-patron-black mb-1">Feature toggles</h2>
        <p className="text-xs text-patron-gray-500 mb-1">
          Turning one off blocks new purchases of that kind platform-wide — existing orders/subscriptions aren't affected.
        </p>
        <Toggle
          checked={settings.shopEnabled}
          onChange={(v) => toggleField("shopEnabled", v)}
          label="Shop"
          description="Allow new shop purchases"
        />
        <Toggle
          checked={settings.membershipsEnabled}
          onChange={(v) => toggleField("membershipsEnabled", v)}
          label="Memberships"
          description="Allow new membership sign-ups"
        />
        <Toggle
          checked={settings.tipsEnabled}
          onChange={(v) => toggleField("tipsEnabled", v)}
          label="Tips"
          description="Allow new tips/support payments"
        />
      </div>

      <div className="bg-patron-white rounded-2xl shadow-sm border border-patron-gray-200 p-5 sm:p-6">
        <Toggle
          checked={settings.maintenanceMode}
          onChange={(v) => toggleField("maintenanceMode", v)}
          label="Maintenance mode"
          description="Blocks ALL new payments and shows visitors a maintenance page. Admin login still works."
          danger
        />
      </div>
    </div>
  );
};

export default AdminSettingsTab;
