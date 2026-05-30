import { useState } from 'react'
import { Settings, TrendingUp, Users, Heart, LogOut } from 'lucide-react'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { useLanguage } from '../hooks/useLanguage'
import useAuthStore from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const { t } = useLanguage()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  // Mock data
  const stats = {
    totalEarnings: 15500,
    totalSupporters: 42,
    profileViews: 1205,
    monthlyEarnings: 3200,
  }

  const recentSupporters = [
    { id: 1, name: 'Ram Sharma', amount: 500, date: '2 hours ago' },
    { id: 2, name: 'Sita Poudel', amount: 1000, date: '5 hours ago' },
    { id: 3, name: 'Hari Kc', amount: 750, date: '1 day ago' },
  ]

  return (
    <Layout>
      <div className="py-12 px-4 space-y-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email || 'Creator'}!</h1>
              <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your account</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="md">
                <Settings size={20} />
              </Button>
              <Button variant="secondary" size="md" onClick={handleLogout}>
                <LogOut size={20} />
                {t('common.logout')}
              </Button>
            </div>
          </div>

          {/* Profile Completion Alert */}
          <Alert type="info" title="Profile Setup" message="Complete your profile to publish your creator page" />
        </div>

        {/* Stats Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4">
          <StatsCard 
            icon={<Heart className="text-pink-600" size={24} />}
            label={t('dashboard.earnings')}
            value={`Rs. ${stats.totalEarnings}`}
          />
          <StatsCard 
            icon={<Users className="text-blue-600" size={24} />}
            label={t('dashboard.supporters')}
            value={stats.totalSupporters}
          />
          <StatsCard 
            icon={<TrendingUp className="text-purple-600" size={24} />}
            label={t('dashboard.views')}
            value={stats.profileViews}
          />
          <StatsCard 
            icon={<Heart className="text-red-600" size={24} />}
            label="This Month"
            value={`Rs. ${stats.monthlyEarnings}`}
          />
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-6">
            {['overview', 'supporters', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab stats={stats} t={t} />}
          {activeTab === 'supporters' && <SupportersTab supporters={recentSupporters} t={t} />}
          {activeTab === 'analytics' && <AnalyticsTab t={t} />}
        </div>
      </div>
    </Layout>
  )
}

const StatsCard = ({ icon, label, value }) => (
  <Card className="flex items-start gap-4">
    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </Card>
)

const OverviewTab = ({ stats, t }) => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <Button size="full" variant="outline">Edit Profile</Button>
        <Button size="full" variant="outline">Payment Settings</Button>
        <Button size="full" variant="outline">View Public Page</Button>
      </div>
    </Card>
  </div>
)

const SupportersTab = ({ supporters, t }) => (
  <Card>
    <h3 className="text-xl font-semibold mb-4">{t('creator.recentSupporters')}</h3>
    <div className="space-y-3">
      {supporters.map((supporter) => (
        <div key={supporter.id} className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
          <div>
            <p className="font-medium">{supporter.name}</p>
            <p className="text-sm text-slate-500">{supporter.date}</p>
          </div>
          <p className="font-semibold text-purple-600">Rs. {supporter.amount}</p>
        </div>
      ))}
    </div>
  </Card>
)

const AnalyticsTab = ({ t }) => (
  <Card>
    <h3 className="text-xl font-semibold mb-4">{t('creator.analytics')}</h3>
    <p className="text-slate-600 dark:text-slate-400">Analytics coming soon...</p>
  </Card>
)

export default Dashboard
