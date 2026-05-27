import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchItems } from '../services/searchService';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const data = await searchItems(query);
      setResults(data);
      setLoading(false);
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">
          Found {results.length} results for "<strong>{query}</strong>"
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      {item.rating && (
                        <span className="text-sm text-yellow-500">★ {item.rating}</span>
                      )}
                      {item.category && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try searching for something different or browse our categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
