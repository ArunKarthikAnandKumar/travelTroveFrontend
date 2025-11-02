import axiosInstance from '../api/axiosInstance';

// Types for our data structure
export interface LocationData {
  id: string;
  name: string;
  continentId?: string;
  countryId?: string;
  stateId?: string;
}

export interface Attraction {
  id: string;
  name: string;
}

export interface Hotel {
  id: string;
  name: string;
}

export interface Restaurant {
  id: string;
  name: string;
}

export interface DestinationGuide {
  id: string;
  title: string;
  overview: string;
  thumbnail: string;
  continentId: string;
  continent: string;
  countryId: string;
  country: string;
  stateId?: string;
  state?: string;
  cityId: string;
  city: string;
  avgRating: number;
  highlights: string[];
  travelTips: string[];
  bestTimeToVisit: {
    months: string[];
    reason: string;
  };
  attractions: Attraction[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  createdAt: string;
  updatedAt: string;
}

export interface AllDestinationGuidesResponse {
  error: boolean;
  message: string;
  data: {
    destinationData: DestinationGuide[];
    continentData: LocationData[];
    countryData: (LocationData & { continentId: string })[];
    stateData: (LocationData & { countryId: string; continentId: string })[];
    cityData: (LocationData & { stateId?: string; countryId: string; continentId: string })[];
    attractionData: (LocationData & { cityId: string })[];
    hotelData: (LocationData & { cityId: string })[];
    restaurantData: (LocationData & { cityId: string })[];
  };
}

/**
 * Fetches all destination guides along with related location data
 */
export const getAllDestinationGuides = async (): Promise<AllDestinationGuidesResponse['data']> => {
  try {
    const response = await axiosInstance.get('/admin/allDestinationGuides');
    
    if (response.data.error) {
      throw new Error(response.data.message || 'Failed to fetch destination guides');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching destination guides:', error);
    throw error;
  }
};

/**
 * Filters destination guides based on search criteria
 */
export const filterDestinationGuides = (
  guides: DestinationGuide[],
  filters: {
    search?: string;
    continent?: string;
    country?: string;
    state?: string;
    city?: string;
  }
): DestinationGuide[] => {
  return guides.filter(guide => {
    // Filter by search term (case-insensitive)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchTerm) ||
        guide.overview.toLowerCase().includes(searchTerm) ||
        guide.city.toLowerCase().includes(searchTerm) ||
        guide.country.toLowerCase().includes(searchTerm) ||
        guide.state?.toLowerCase().includes(searchTerm) ||
        guide.continent.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Filter by location names (case-insensitive)
    if (filters.continent && guide.continent.toLowerCase() !== filters.continent.toLowerCase()) return false;
    if (filters.country && guide.country.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.state && guide.state?.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (filters.city && guide.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    
    return true;
  });
};

/**
 * Gets a single destination guide by ID
 */
export const getDestinationById = async (id: string): Promise<DestinationGuide> => {
  try {
    const response = await axiosInstance.get(`/destinationGuides/${id}`);
    
    if (response.data.error) {
      throw new Error(response.data.message || 'Destination not found');
    }
    
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching destination with id ${id}:`, error);
    throw error;
  }
};

/**
 * Gets featured/popular destinations
 */
export const getPopularDestinations = async (limit: number = 6): Promise<DestinationGuide[]> => {
  try {
    const response = await getAllDestinationGuides();
    
    // Sort by rating and limit the results
    return response.destinationData
      .filter(dest => dest.avgRating > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    throw error;
  }
};
