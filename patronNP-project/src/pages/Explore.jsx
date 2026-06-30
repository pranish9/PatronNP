import { useState } from 'react'
import { Search, Heart } from 'lucide-react'
import Layout from '../components/creatorLayout/Layout'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { useLanguage } from '../hooks/useLanguage'
import { Link } from 'react-router-dom'

export const Explore = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock creators data
  const creators = [
    {
      id: 1,
      username: 'johndoe',
      displayName: 'John Doe',
      bio: 'Photography & Travel',
      followers: 1250,
      profilePicture: 'https://via.placeholder.com/100',
      verified: true,
    },
    {
      id: 2,
      username: 'sarasmith',
      displayName: 'Sara Smith',
      bio: 'Digital Artist',
      followers: 890,
      profilePicture: 'https://via.placeholder.com/100',
      verified: false,
    },
    {
      id: 3,
      username: 'techguru',
      displayName: 'Tech Guru',
      bio: 'Tech Reviews & Tutorials',
      followers: 2100,
      profilePicture: 'https://via.placeholder.com/100',
      verified: true,
    },
    {
      id: 4,
      username: 'musiclover',
      displayName: 'Music Lover',
      bio: 'Music Producer',
      followers: 650,
      profilePicture: 'https://via.placeholder.com/100',
      verified: false,
    },
  ]

  const filteredCreators = creators.filter(creator =>
    creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="py-8 sm:py-12 px-4 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('common.explore')} {t('creator.supportedCreators')}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Discover and support amazing creators from Nepal
          </p>
        </div>

        {/* Search */}
        <div className="max-w-6xl mx-auto">
          <Input
            type="text"
            placeholder={t('common.search')}
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Creators Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {t('common.search')} results not found
              </p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}

const CreatorCard = ({ creator }) => {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <Card className="group hover:shadow-lg transition-all space-y-4">
      {/* Profile Picture */}
      <div className="relative">
        <img 
          src={creator.profilePicture}
          alt={creator.displayName}
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>

      {/* Info */}
      <Link to={`/@${creator.username}`} className="space-y-2 hover:opacity-80 transition">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg truncate">{creator.displayName}</h3>
          {creator.verified && <span className="text-blue-500">✓</span>}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">@{creator.username}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{creator.bio}</p>
      </Link>

      {/* Followers */}
      <p className="text-xs text-slate-500">👥 {creator.followers.toLocaleString()}</p>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <Link to={`/@${creator.username}`} className="flex-1">
          <Button size="sm" variant="secondary" className="w-full">
            View Profile
          </Button>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsSaved(!isSaved)}
          className={isSaved ? 'text-pink-600' : ''}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </Button>
      </div>
    </Card>
  )
}

export default Explore
