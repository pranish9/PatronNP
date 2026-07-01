import { useState, useEffect, useCallback } from 'react'
import { Search, Heart } from 'lucide-react'
import Layout from '../components/creatorLayout/Layout'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { useLanguage } from '../hooks/useLanguage'
import { Link } from 'react-router-dom'
import { searchCreators, getTopCreators } from '../services/searchService'
import useDebounce from '../utils/useDebounce'

export const Explore = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [topCreators, setTopCreators] = useState([])
  const [loadingTop, setLoadingTop] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 350)

  useEffect(() => {
    getTopCreators(0, 10)
      .then((data) => setTopCreators(data.content || []))
      .catch(() => setTopCreators([]))
      .finally(() => setLoadingTop(false))
  }, [])

  const runSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const data = await searchCreators(query.trim(), 0, 20)
      setSearchResults(data.content || [])
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    runSearch(debouncedQuery)
  }, [debouncedQuery, runSearch])

  const filteredCreators = searchQuery ? searchResults : topCreators

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
          {loadingTop || isSearching ? (
            <Card className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">Loading...</p>
            </Card>
          ) : filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCreators.map((creator, i) => (
                <CreatorCard
                  key={creator.username}
                  creator={creator}
                  rank={!searchQuery ? i + 1 : null}
                />
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

const CreatorCard = ({ creator, rank }) => {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <Card className="group hover:shadow-lg transition-all space-y-4">
      {/* Profile Picture */}
      <div className="relative">
        <img
          src={creator.profilePictureUrl || 'https://via.placeholder.com/100'}
          alt={creator.displayName || creator.username}
          className="w-full h-32 object-cover rounded-lg"
        />
        {rank && (
          <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">
            #{rank}
          </span>
        )}
      </div>

      {/* Info */}
      <Link to={`/${creator.username}`} className="space-y-2 hover:opacity-80 transition">
        <h3 className="font-semibold text-lg truncate">{creator.displayName || creator.username}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">@{creator.username}</p>
        {creator.bio && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{creator.bio}</p>
        )}
      </Link>

      {/* Supporters */}
      <p className="text-xs text-slate-500">👥 {(creator.supporterCount || 0).toLocaleString()} supporters</p>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <Link to={`/${creator.username}`} className="flex-1">
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
