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
        <p>No creators found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {results.map((creator) => (
        <button
          key={creator.username}
          onClick={() => onResultClick(creator)}
          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors"
        >
          <img
            src={creator.profilePictureUrl || 'https://placehold.co/48x48'}
            alt={creator.displayName || creator.username}
            className="w-11 h-11 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 truncate">
              {creator.displayName || creator.username}
            </h4>
            <p className="text-sm text-gray-500 truncate">@{creator.username}</p>
          </div>
          {typeof creator.supporterCount === 'number' && (
            <span className="text-xs text-gray-400 shrink-0">
              {creator.supporterCount.toLocaleString()} supporters
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SearchResultsList;
