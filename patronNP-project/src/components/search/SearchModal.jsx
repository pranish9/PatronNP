import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react';
import { getTrendingItems } from '../../services/searchService';
import SearchResultsList from './SearchResultsList';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState([]);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Reference for the input to manage focus
  const inputRef = useRef(null);

  // Return null immediately if not open
  if (!isOpen) return null;

  useEffect(() => {
    const trendingData = getTrendingItems();
    setTrending(trendingData);
    
    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
    /* Backdrop with click-to-close */
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-[60] px-4"
      onClick={onClose}
    >
      {/* Modal Content - e.stopPropagation() prevents closing when clicking inside */}
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <form onSubmit={handleSubmit} className="p-4 border-b">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-500 transition-all">
            <SearchIcon size={20} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search services, people, or items..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </form>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto">
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
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Trending Now</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(item)}
                      className="px-4 py-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 text-gray-600 text-sm rounded-full transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Searches</h3>
                <p className="text-gray-400 text-sm italic">No recent searches</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;