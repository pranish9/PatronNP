import React from 'react';
import { Loader } from 'lucide-react';

const SearchResultsList = ({ results, isLoading, onResultClick }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={24} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {results.map((item, index) => (
        <button
          key={index}
          onClick={() => onResultClick(item)}
          className="w-full p-4 hover:bg-gray-50 text-left transition-colors"
        >
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          {item.category && (
            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {item.category}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SearchResultsList;
