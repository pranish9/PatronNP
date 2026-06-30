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
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [transactions, setTransactions] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  useEffect(() => {
    getMyTransactions(0, 10)
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

  // Mock data tailored for Chart.js implementation
  const stats = {
    totalEarnings: 1000,
    supportersCount: 10,
    membershipCount: 100,
    shopCount: 10,
  }

  // Chart configs mimicking clean financial metrics
  const chartData = {
    labels: ['May 15', 'May 20', 'May 25', 'May 30', 'Jun 05', 'Jun 10'],
    datasets: [
      {
        fill: true,
        label: 'Earnings',
        data: [100, 30, 20, 93, 5, 100], // Matches the zero state shown in the image safely
        borderColor: '#10b981', // Emerald green brand color
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { min: 0, max: 500, ticks: { stepSize: 2 } },
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
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">Hi, PRANISH RAJ TUADHAR</h2>
                  <p className="text-sm text-gray-400 font-medium">buymeacoffee.com/pranishxgrowth</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button className="flex items-center gap-2 bg-[#212121] text-white hover:bg-black text-xs font-semibold px-4 py-2 rounded-full transition-all">
                  <Share2 size={14} />
                  Share page
                </button>
              </div>
            </div>

            {/* Earnings Section & ChartJS Visualizer */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-900">Earnings</h3>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-md border border-gray-200">
                  Last 30 days
                </span>
              </div>

              <div className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                NPR {totalEarnings.toLocaleString()}
              </div>

              {/* Minimalist Legend Pills */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-200"></span> ${stats.supportersCount} Supporters</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-pink-200"></span> ${stats.membershipCount} Membership</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-200"></span> ${stats.shopCount} Shop</span>
              </div>

              {/* Dynamic Chart Area */}
              <div className="h-48 w-full pt-4 border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Recent transactions */}
            {loadingTransactions ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="border border-gray-100 rounded-2xl py-12 text-center bg-white shadow-xs max-w-xl mx-auto">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-100">
                  <Heart size={20} />
                </div>
                <h4 className="text-base font-bold text-gray-900">You don't have any supporters yet</h4>
                <p className="text-xs text-gray-400 mt-1">Share your page with your audience to get started.</p>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900">Recent transactions</h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {transactions.map((t) => {
                    const categoryIcon =
                      t.category === "SHOP" ? (
                        <ShoppingBag size={14} />
                      ) : t.category === "MEMBERSHIP" ? (
                        <Lock size={14} />
                      ) : (
                        <Gift size={14} />
                      )
                    const statusColor =
                      t.status === "SUCCESS"
                        ? "text-emerald-600 bg-emerald-50"
                        : t.status === "PENDING"
                        ? "text-amber-600 bg-amber-50"
                        : "text-red-600 bg-red-50"
                    return (
                      <div
                        key={t.transactionUuid}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 shrink-0">
                          {categoryIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {t.supporterName || "Anonymous"}
                            {t.message && (
                              <span className="text-gray-400 font-normal"> — "{t.message}"</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {t.provider} · {t.category || "TIP"} ·{" "}
                            {new Date(t.createdAt).toLocaleDateString("en-NP", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900">
                            NPR {t.amount?.toLocaleString()}
                          </p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusColor}`}>
                            {t.status}
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
            <h3 className="text-lg font-bold text-gray-800">More ways to earn</h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              
              {/* Membership Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <Lock size={16} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Membership</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Monthly membership for your biggest fans and supporters.</p>
                </div>
                <button className="mt-6 w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-gray-100 transition-colors py-2 px-4 rounded-full border border-gray-100">
                  <span>View</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Shop Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <ShoppingBag size={16} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Shop</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Introducing Shop, the creative way to sell digital goodies.</p>
                </div>
                <button className="mt-6 w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-gray-100 transition-colors py-2 px-4 rounded-full border border-gray-100">
                  <span>Enable</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Exclusive Posts Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <FileText size={16} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Exclusive posts</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Publish your best content exclusively for your supporters.</p>
                </div>
                <button className="mt-6 w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-gray-100 transition-colors py-2 px-4 rounded-full border border-gray-100">
                  <span>Write a post</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>

            </div>
          </div>

          {/* Traditional Global Action Utilities (Bottom Bar Layout Placement) */}
          <div className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl">
            <div className="text-xs text-gray-400 font-medium">
              Logged in as: <span className="text-gray-700 font-semibold">{user?.email || 'Creator'}</span>
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