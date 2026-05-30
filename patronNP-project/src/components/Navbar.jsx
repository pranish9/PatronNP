import { ChevronDown, Menu, X, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import useAuthStore from '../stores/authStore'
import useThemeStore from '../stores/themeStore'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const navigate = useNavigate()
  const { currentLanguage, changeLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useThemeStore()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [isDark])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ne', name: 'नेपाली' },
    { code: 'hi', name: 'हिन्दी' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
              PN
            </div>
            <span className="font-bold text-lg hidden sm:inline">PatronNP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">
              {t('common.explore')}
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">
                {t('common.profile')}
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-medium"
              >
                {currentLanguage.toUpperCase()}
                <ChevronDown size={16} />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code)
                        setIsLanguageOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        currentLanguage === lang.code
                          ? 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex gap-2">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition font-medium"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                >
                  {t('auth.signUp')}
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition font-medium"
              >
                {t('common.logout')}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/explore"
              className="block px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {t('common.explore')}
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                {t('common.profile')}
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                >
                  {t('auth.signUp')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
