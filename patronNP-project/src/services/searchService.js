// Search Service - Mock and API approaches

// Mock data for trending items
const mockTrendingItems = [
  'Web Design',
  'Graphic Design',
  'Photography',
  'Video Editing',
  'Content Writing',
  'Social Media Management',
  'SEO Optimization',
  'Digital Marketing',
];

// Mock search results
const mockSearchDatabase = {
  'web design': [
    {
      id: 1,
      title: 'Modern Web Design Services',
      description: 'Professional web design for businesses',
      category: 'Service',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Responsive Website Development',
      description: 'Mobile-first responsive websites',
      category: 'Service',
      rating: 4.9,
    },
  ],
  'graphic design': [
    {
      id: 3,
      title: 'Logo Design Services',
      description: 'Custom logo creation',
      category: 'Service',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Branding and Design',
      description: 'Complete branding solutions',
      category: 'Service',
      rating: 4.8,
    },
  ],
  'photography': [
    {
      id: 5,
      title: 'Professional Photography',
      description: 'Event and portrait photography',
      category: 'Service',
      rating: 4.9,
    },
  ],
};

/**
 * Get trending items
 * @returns {Array} Array of trending item names
 */
export const getTrendingItems = () => {
  return mockTrendingItems;
};

/**
 * Search for items - Mock approach
 * Replace with API call in production
 *
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchItems = async (query) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      
      // Search in mock database
      if (mockSearchDatabase[lowerQuery]) {
        resolve(mockSearchDatabase[lowerQuery]);
      } else {
        // Return generic results
        resolve([
          {
            id: 99,
            title: `Search results for "${query}"`,
            description: `Showing results matching "${query}"`,
            category: 'General',
            rating: 0,
          },
        ]);
      }
    }, 500);
  });
};

/**
 * API Integration approach (for production)
 * Uncomment and modify as needed
 */

/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const searchItemsAPI = async (query, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getTrendingItemsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Trending fetch error:', error);
    return mockTrendingItems;
  }
};
*/
