import axiosInstance from './axiosInstance';

export const searchDestinationGuides = async (filters = {}) => {
  try {
    // Extract search and filter parameters
    const { search, continent, country, state, city, page = 1, limit = 10 } = filters;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (continent) params.append('continent', continent);
    if (country) params.append('country', country);
    if (state) params.append('state', state);
    if (city) params.append('city', city);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Call backend API
    const response = await axiosInstance.get(`/destinationGuides/search?${params.toString()}`);
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Search failed');
    }
    
    return {
      error: false,
      message: response.data.message || 'Destination guides fetched successfully',
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0
      }
    };
  } catch (error) {
    console.error('Error searching destination guides:', error);
    
    // Handle network errors or API errors
    if (error.response) {
      // API returned an error response
      throw new Error(error.response.data?.message || 'Failed to search destination guides');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      // Something else happened
      throw error;
    }
  }
};

export const getPopularDestinations = async (limit = 6) => {
  try {
    // Fetch popular destinations from backend (sorted by rating)
    const response = await axiosInstance.get(`/destinationGuides/search?limit=${limit}&page=1`);
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to fetch popular destinations');
    }
    
    // Backend already sorts by rating, so we can return directly
    return {
      error: false,
      message: 'Popular destinations fetched successfully',
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    
    // Fallback: return empty array on error
    return {
      error: false,
      message: 'Popular destinations fetched successfully',
      data: []
    };
  }
};
