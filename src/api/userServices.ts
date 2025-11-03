import axios from 'axios';
import { BASE_URL } from '../utils/constatnts';
import { getToken } from '../utils/token';

// Create authenticated instance
const authenticatedAxios = axios.create({
  baseURL: BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
authenticatedAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Types
export interface Review {
  userId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface DestinationReview {
  rating: number;
  comment?: string;
}

export interface Itinerary {
  id: string;
  type: string;
  title: string;
  durationDays: number;
  thumbnail: string;
  continentId: string;
  continent: string;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  days: any[];
  inclusions: string[];
  exclusions: string[];
  priceRange: string;
  bestTimeToVisit: string[];
  tags: string[];
  reviews: Review[];
  avgRating: number;
}

export interface TravelGroup {
  _id: string;
  itineraryId: string;
  itenaryName: string;
  name: string;
  description: string;
  thumbnail: string;
  maxMembers: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  pricePerPerson: number;
  status: string;
  isPrivate: boolean;
  groupAdmin: string;
  members: any[];
}

// Destination Guides
export const getDetailedDestination = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/api/admin/destinationGuides/getDestinationGuide/${id}`);
  return response.data;
};

export const addDestinationReview = async (id: string, review: DestinationReview) => {
  const response = await authenticatedAxios.post(`/admin/destinationGuides/addReview/${id}`, review);
  return response.data;
};

// Favorites
export const addDestinationToFavorites = async (destinationId: string) => {
  const response = await authenticatedAxios.post('/favorites/addDestination', { destinationId });
  return response.data;
};

export const removeDestinationFromFavorites = async (destinationId: string) => {
  const response = await authenticatedAxios.delete(`/favorites/removeDestination/${destinationId}`);
  return response.data;
};

export const addItineraryToFavorites = async (itineraryId: string) => {
  const response = await authenticatedAxios.post('/favorites/addItinerary', { itineraryId });
  return response.data;
};

export const removeItineraryFromFavorites = async (itineraryId: string) => {
  const response = await authenticatedAxios.delete(`/favorites/removeItinerary/${itineraryId}`);
  return response.data;
};

export const getMyFavorites = async () => {
  const response = await authenticatedAxios.get('/favorites/myFavorites');
  return response.data;
};

// Itineraries
export const getAllItineraries = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allItineraries`);
  return response.data;
};

export const getItineraryById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/api/admin/getItinerary/${id}`);
  return response.data;
};

export const createUserItinerary = async (itineraryData: FormData) => {
  const response = await authenticatedAxios.post('/admin/user/createItinerary', itineraryData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const addItineraryReview = async (id: string, review: DestinationReview) => {
  const response = await authenticatedAxios.post(`/admin/addReview/${id}`, review);
  return response.data;
};

// Travel Groups
export const getAllTravelGroups = async (filters?: any) => {
  const response = await axios.get(`${BASE_URL}/api/admin/getAllTravelGroups`, { params: filters });
  return response.data;
};

export const getTravelGroupById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/api/admin/getTravelGroup/${id}`);
  return response.data;
};

export const createTravelGroup = async (groupData: FormData | any) => {
  // If it's already a plain object, send as JSON; otherwise send as FormData
  const isFormData = groupData instanceof FormData;
  const response = await authenticatedAxios.post('/admin/user/createTravelGroup', groupData, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const joinTravelGroup = async (groupId: string) => {
  const response = await authenticatedAxios.post(`/admin/${groupId}/join`);
  return response.data;
};

export const inviteToTravelGroup = async (groupId: string, userId: string) => {
  const response = await authenticatedAxios.post(`/admin/${groupId}/invite`, { userId });
  return response.data;
};

// User Profile
export const getUserProfile = async () => {
  const response = await authenticatedAxios.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (profileData: {
  userName?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  password?: string;
}) => {
  const response = await authenticatedAxios.put('/user/profile', profileData);
  return response.data;
};

// Newsletter
export const subscribeNewsletter = async (email: string) => {
  const response = await axios.post(`${BASE_URL}/api/newsletter/subscribe`, { email });
  return response.data;
};

// Contact Us
export const submitContactForm = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await axios.post(`${BASE_URL}/api/contact`, contactData);
  return response.data;
};

// Location Data for Creating Itinerary
export const fetchLocationDataForItinerary = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allItineraries`);
  return response.data;
};

export const fetchAllContinents = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allContinents`);
  return response.data;
};

export const fetchAllCountries = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allCountrys`);
  return response.data;
};

export const fetchAllStates = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allStates`);
  return response.data;
};

export const fetchAllCities = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allCities`);
  return response.data;
};

export const fetchAllAttractions = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allAttractions`);
  return response.data;
};

export const fetchAllHotels = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allHotels`);
  return response.data;
};

export const fetchAllRestaurants = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/allRestaurants`);
  return response.data;
};

export default authenticatedAxios;

