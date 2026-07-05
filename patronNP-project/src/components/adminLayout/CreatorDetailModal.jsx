import { useEffect, useState } from "react";
import { X, Wallet, Percent, CreditCard, Users, FileText, Flag } from "lucide-react";
import toast from "react-hot-toast";

import adminService from "../../services/adminService";

const fmt = (n) => `Rs ${Math.round(n || 0).toLocaleString()}`;

const CreatorDetailModal = ({ userId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminService
      .getCreatorDetail(userId)
      .then((res) => setDetail(res.data))
      .catch(() => toast.error("Failed to load creator details"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-patron-white w-full max-w-lg rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-patron-black">Creator details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-patron-gray-100">
            <X size={18} />
          </button>
        </div>

        {loading || !detail ? (
          <div className="py-12 text-center text-sm text-patron-gray-400">Loading...</div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {detail.profilePictureUrl ? (
                <img src={detail.profilePictureUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-patron-gray-100 flex items-center justify-center text-patron-gray-400 font-bold">
                  {detail.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-patron-black">{detail.fullName || detail.username}</p>
                <p className="text-xs text-patron-gray-500">
                  @{detail.username} · {detail.email}
                </p>
              </div>
            </div>

            {detail.bio && <p className="text-sm text-patron-gray-600">{detail.bio}</p>}

            <div className="grid grid-cols-2 gap-3">
              <DetailStat icon={Wallet} label="Gross earnings" value={fmt(detail.grossEarnings)} accent="green" />
              <DetailStat icon={Percent} label="Net to creator" value={fmt(detail.netEarnings)} accent="green" />
              <DetailStat icon={CreditCard} label="Commission + fees" value={fmt(detail.commissionEarnings + detail.gatewayFeeEarnings)} accent="orange" />
              <DetailStat icon={Users} label="Active subscribers" value={detail.subscriberCount} accent="green" />
              <DetailStat icon={FileText} label="Published posts" value={detail.postCount} accent="green" />
              <DetailStat icon={Flag} label="Open flags" value={detail.flagCount} accent="orange" />
            </div>

            <p className="text-xs text-patron-gray-400">
              Joined {new Date(detail.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })} · Status: {detail.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailStat = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-patron-gray-100 rounded-xl p-3">
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${
        accent === "green" ? "bg-patron-green-50 text-patron-green-700" : "bg-patron-orange-50 text-patron-orange-700"
      }`}
    >
      <Icon size={14} />
    </div>
    <p className="text-base font-bold text-patron-black">{value}</p>
    <p className="text-xs text-patron-gray-500">{label}</p>
  </div>
);

export default CreatorDetailModal;
