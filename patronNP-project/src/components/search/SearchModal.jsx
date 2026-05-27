import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react';
import { getTrendingItems } from '../../services/searchService';
import SearchResultsList from './SearchResultsList';

const SearchModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState([]);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const trendingData = getTrendingItems();
    setTrending(trendingData);
  }, []);

  const handleSearch = useCallback((query) => {
    if (!query.trim()) {
      setShowResults(false);
      setResults([]);
      return;
    }

    setIsSearching(true);
    // Simulate search with debounce
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: 'Example 1', description: 'Sample result', category: 'Service' },
        { id: 2, title: 'Example 2', description: 'Another result', category: 'Person' },
        { id: 3, title: 'Example 3', description: 'More results', category: 'Product' },
      ];
      setResults(mockResults);
      setShowResults(true);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results/${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const handleTrendingClick = (item) => {
    navigate(`/results/${encodeURIComponent(item)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Search Header */}
        <form onSubmit={handleSubmit} className="p-6 border-b">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg">
            <SearchIcon size={20} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search services, people, or items..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </form>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {showResults ? (
            <SearchResultsList
              results={results}
              isLoading={isSearching}
              onResultClick={(item) => {
                navigate(`/results/${encodeURIComponent(searchQuery)}`);
                onClose();
              }}
            />
          ) : (
            <div className="p-6">
              {/* Trending Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Trending Now</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(item)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Searches</h3>
                <p className="text-gray-500 text-sm">No recent searches</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
