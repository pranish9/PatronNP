import { useState, useEffect } from 'react'
import { Settings, TrendingUp, Users, Heart, LogOut, Share2, Lock, ShoppingBag, FileText, ChevronRight, Gift } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import Layout from '../components/creatorLayout/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { useLanguage } from '../hooks/useLanguage'
import useAuthStore from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { getMyTransactions } from '../services/transactionService'
import LanguageSwitcher from '../components/LanguageSwitcher'

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export const Dashboard = () => {
  const { t } = useLanguage()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [transactions, setTransactions] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  const username = localStorage.getItem("username") || ""
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
      return null
    }
  })()
  const displayName = storedUser?.username || username || t('creator.creatorPage')
  const pageUrl = username ? `patronnp.com/${username}` : ""

  useEffect(() => {
    getMyTransactions(0, 50)
      .then((data) => {
        setTransactions(data.transactions?.content || [])
        setTotalEarnings(data.totalEarnings || 0)
      })
      .catch(() => {})
      .finally(() => setLoadingTransactions(false))
  }, [])

  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin", { replace: true });
  };

  const successfulTransactions = transactions.filter((t) => t.status === "SUCCESS")

  // Real category totals, computed from actual successful transactions
  const stats = successfulTransactions.reduce(
    (acc, t) => {
      const category = t.category || "TIP"
      const amount = t.amount || 0
      if (category === "SHOP") acc.shopAmount += amount
      else if (category === "MEMBERSHIP") acc.membershipAmount += amount
      else acc.supportersAmount += amount
      return acc
    },
    { supportersAmount: 0, membershipAmount: 0, shopAmount: 0 }
  )

  // Real chart data: daily total of successful earnings, grouped from actual transactions
  const dailyTotals = successfulTransactions.reduce((acc, t) => {
    const day = new Date(t.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })
    acc[day] = (acc[day] || 0) + (t.amount || 0)
    return acc
  }, {})

  const sortedDays = Object.keys(dailyTotals).sort(
    (a, b) => new Date(a) - new Date(b)
  )

  const chartData = {
    labels: sortedDays,
    datasets: [
      {
        fill: true,
        label: t('creator.earnings'),
        data: sortedDays.map((d) => dailyTotals[d]),
        borderColor: '#10b981', // Emerald green brand color
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.4,
      },
    ],
  }

  const chartMax = Math.max(...sortedDays.map((d) => dailyTotals[d]), 100)

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { min: 0, max: chartMax * 1.2, ticks: { stepSize: Math.ceil(chartMax / 5) || 1 } },
      x: { grid: { display: false } }
    }
  }

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Workspace Frame */}
          <div className="bg-white rounded-1xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-8">
            
            {/* Creator Header Profile Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  P
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">{t('dashboard.greeting', { name: displayName })}</h2>
                  {pageUrl && <p className="text-sm text-gray-400 font-medium">{pageUrl}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button className="flex items-center gap-2 bg-[#212121] text-white hover:bg-black text-xs font-semibold px-4 py-2 rounded-full transition-all">
                  <Share2 size={14} />
                  {t('dashboard.sharePage')}
                </button>
              </div>
            </div>

            {/* Earnings Section & ChartJS Visualizer */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-900">{t('creator.earnings')}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-md border border-gray-200">
                  {t('dashboard.last30Days')}
                </span>
              </div>

              <div className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                NPR {totalEarnings.toLocaleString()}
              </div>

              {/* Minimalist Legend Pills — real category totals from successful transactions */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-200"></span> NPR {stats.supportersAmount.toLocaleString()} {t('dashboard.supportersLabel')}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-pink-200"></span> NPR {stats.membershipAmount.toLocaleString()} {t('dashboard.membershipLabel')}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-200"></span> NPR {stats.shopAmount.toLocaleString()} {t('dashboard.shopLabel')}</span>
              </div>

              {/* Dynamic Chart Area — real daily earnings from successful transactions */}
              <div className="h-48 w-full pt-4 border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                {sortedDays.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    {t('dashboard.noActivity')}
                  </div>
                )}
              </div>
            </div>

            {/* Recent transactions */}
            {loadingTransactions ? (
              <div className="py-12 text-center text-gray-400 text-sm">{t('dashboard.loadingTransactions')}</div>
            ) : transactions.length === 0 ? (
              <div className="border border-gray-100 rounded-2xl py-12 text-center bg-white shadow-xs max-w-xl mx-auto">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-100">
                  <Heart size={20} />
                </div>
                <h4 className="text-base font-bold text-gray-900">{t('dashboard.noSupportersYet')}</h4>
                <p className="text-xs text-gray-400 mt-1">{t('dashboard.sharePageToStart')}</p>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900">{t('dashboard.recentTransactions')}</h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {transactions.slice(0, 10).map((txn) => {
                    const categoryIcon =
                      txn.category === "SHOP" ? (
                        <ShoppingBag size={14} />
                      ) : txn.category === "MEMBERSHIP" ? (
                        <Lock size={14} />
                      ) : (
                        <Gift size={14} />
                      )
                    const statusColor =
                      txn.status === "SUCCESS"
                        ? "text-emerald-600 bg-emerald-50"
                        : txn.status === "PENDING"
                        ? "text-amber-600 bg-amber-50"
                        : "text-red-600 bg-red-50"
                    const statusLabel =
                      txn.status === "SUCCESS"
                        ? t('dashboard.statusSuccess')
                        : txn.status === "PENDING"
                        ? t('dashboard.statusPending')
                        : t('dashboard.statusFailed')
                    const categoryLabel =
                      txn.category === "SHOP"
                        ? t('dashboard.categoryShop')
                        : txn.category === "MEMBERSHIP"
                        ? t('dashboard.categoryMembership')
                        : t('dashboard.categoryTip')
                    return (
                      <div
                        key={txn.transactionUuid}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 shrink-0">
                          {categoryIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {txn.supporterName || t('dashboard.anonymous')}
                            {txn.message && (
                              <span className="text-gray-400 font-normal"> — "{txn.message}"</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {txn.provider} · {categoryLabel} ·{" "}
                            {new Date(txn.createdAt).toLocaleDateString("en-NP", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900">
                            NPR {txn.amount?.toLocaleString()}
                          </p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Monetization Feature Grid Blocks ("More ways to earn") */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">{t('dashboard.moreWaysToEarn')}</h3>

            <div className="grid sm:grid-cols-3 gap-4">

              {/* Membership Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <Lock size={16} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{t('dashboard.membershipLabel')}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{t('dashboard.membershipCardDesc')}</p>
                </div>
                <button className="mt-6 w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-gray-100 transition-colors py-2 px-4 rounded-full border border-gray-100">
                  <span>{t('dashboard.view')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Shop Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <ShoppingBag size={16} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{t('dashboard.shopLabel')}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{t('dashboard.shopCardDesc')}</p>
                </div>
                <button className="mt-6 w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-gray-100 transition-colors py-2 px-4 rounded-full border border-gray-100">
                  <span>{t('dashboard.enable')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Exclusive Posts Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <FileText size={16} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{t('dashboard.exclusivePosts')}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{t('dashboard.exclusivePostsDesc')}</p>
                </div>
                <button className="mt-6 w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-gray-100 transition-colors py-2 px-4 rounded-full border border-gray-100">
                  <span>{t('dashboard.writeAPost')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>

            </div>
          </div>

          {/* Traditional Global Action Utilities (Bottom Bar Layout Placement) */}
          <div className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl">
            <div className="text-xs text-gray-400 font-medium">
              {t('dashboard.loggedInAs')} <span className="text-gray-700 font-semibold">{storedUser?.email || displayName}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Settings size={16} />
              </Button>
              <Button variant="secondary" size="sm" className="text-xs py-1.5 flex items-center gap-1.5" onClick={handleLogout}>
                <LogOut size={14} />
                {t('common.logout')}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard;