import { Heart, Share2, MessageCircle, MapPin, Link as LinkIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import { useLanguage } from '../hooks/useLanguage'

export const CreatorProfile = () => {
  const { username } = useParams()
  const { t } = useLanguage()

  // Mock creator data - replace with actual API call
  const creator = {
    username: username || 'johndoe',
    displayName: 'John Doe',
    bio: 'Content creator, photographer, and digital nomad. 📸 Exploring the world one frame at a time!',
    profilePicture: 'https://via.placeholder.com/120',
    coverBanner: 'https://via.placeholder.com/1200x300',
    followers: 1250,
    earnings: 'NP',
    social: {
      instagram: '@johndoe',
      twitter: '@johndoe',
      youtube: '@johndoe',
      website: 'https://johndoe.com',
    },
  }

  const recentSupporters = [
    { id: 1, name: 'Anonymous', amount: 500 },
    { id: 2, name: 'Sita P.', amount: 1000 },
    { id: 3, name: 'Ram S.', amount: 750 },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Cover Banner */}
        <div className="h-40 md:h-64 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 relative -mx-4 sm:mx-0">
          <img 
            src={creator.coverBanner} 
            alt="cover" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Section */}
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-20 relative z-10">
            <div>
              <img 
                src={creator.profilePicture}
                alt={creator.displayName}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold">{creator.displayName}</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">@{creator.username}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{creator.bio}</p>
              
              <div className="flex gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                <span>👥 {creator.followers.toLocaleString()} {t('creator.followers')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="md">
                <Share2 size={20} />
              </Button>
            </div>
          </div>

          {/* Social Links & Support */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Support Options */}
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart size={24} className="text-pink-600" />
                  {t('creator.supportCreator')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Support this creator with your tip and help them create more amazing content!
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[500, 1000, 2000].map((amount) => (
                    <Button key={amount} variant="secondary" size="md" className="flex-1">
                      Rs. {amount}
                    </Button>
                  ))}
                </div>

                <Button size="full" className="mb-3">
                  <Heart size={20} />
                  Send Support
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  Minimum: Rs. 100
                </p>
              </Card>

              {/* Social Links */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">{t('onboarding.step2')}</h3>
                <div className="space-y-2">
                  {creator.social.instagram && (
                    <SocialLink icon="📷" label="Instagram" value={creator.social.instagram} />
                  )}
                  {creator.social.twitter && (
                    <SocialLink icon="𝕏" label="Twitter" value={creator.social.twitter} />
                  )}
                  {creator.social.youtube && (
                    <SocialLink icon="▶️" label="YouTube" value={creator.social.youtube} />
                  )}
                  {creator.social.website && (
                    <SocialLink icon="🔗" label="Website" value={creator.social.website} />
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Supporters */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">{t('creator.recentSupporters')}</h3>
                <div className="space-y-3">
                  {recentSupporters.map((supporter) => (
                    <div key={supporter.id} className="flex justify-between items-center py-2">
                      <p className="text-sm font-medium">{supporter.name}</p>
                      <p className="text-sm text-purple-600 font-semibold">Rs. {supporter.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Info Card */}
              <Card className="bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold mb-2">💡 Tip</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Support your favorite creators securely using eSewa, Khalti, or bank transfer.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const SocialLink = ({ icon, label, value }) => (
  <a 
    href={`https://${value}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
  >
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
    <LinkIcon size={16} className="text-slate-400" />
  </a>
)

export default CreatorProfile
