import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { searchCreators, PAGE_SIZE } from '../../services/searchService';
import useDebounce from '../../utils/useDebounce';
import useInfiniteScroll from '../../utils/useInfiniteScroll';
import SearchResultsList from './SearchResultsList';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 350);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const runSearch = useCallback(async (query, pageToLoad) => {
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchCreators(query.trim(), pageToLoad, PAGE_SIZE);
      setResults((prev) => (pageToLoad === 0 ? data.content : [...prev, ...data.content]));
      setHasMore(!data.last);
      setPage(pageToLoad);
    } catch {
      if (pageToLoad === 0) setResults([]);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery, 0);
  }, [debouncedQuery, runSearch]);

  const loadMore = useCallback(() => {
    if (!isSearching) runSearch(debouncedQuery, page + 1);
  }, [debouncedQuery, page, isSearching, runSearch]);

  const sentinelRef = useInfiniteScroll({ hasMore, loading: isSearching, onLoadMore: loadMore });

  const goToCreator = (username) => {
    navigate(`/${username}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-[60] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-500 transition-all">
            <SearchIcon size={20} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators by name or username..."
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
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() ? (
            <>
              <SearchResultsList
                results={results}
                isLoading={isSearching && page === 0}
                onResultClick={(creator) => goToCreator(creator.username)}
              />
              {hasMore && <div ref={sentinelRef} className="h-8" />}
              {isSearching && page > 0 && (
                <p className="text-center text-xs text-gray-400 pb-4">Loading more...</p>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-gray-400 text-sm">
              Start typing to find a creator
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
