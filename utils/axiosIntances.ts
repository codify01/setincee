import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL in environment.");
}

const AX = axios.create({
    baseURL: apiBaseUrl,
    // headers: {
    //     "Content-Type": "application/json",
    //     "Accept": "application/json",
    // },

    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
})


AX.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const register = async (data:object) => AX.post('/api/auth/register', data)
export const signin = async (data:object) => AX.post('/api/auth/login', data)
export const socialSignin = async (data: { email: string; firstName: string; lastName: string }) =>
  AX.post('/api/auth/social', data)

export const getUserProfile = async () => AX.get('/api/users/profile')

export const getHomeTab = async (params?: { lat?: number; lng?: number }) =>
  AX.get('/api/tabs/home', { params })
export const getExploreTab = async (params?: { lat?: number; lng?: number }) =>
  AX.get('/api/tabs/explore', { params })
export const getTripsTab = async () => AX.get('/api/tabs/trips')
export const getProfileTab = async () => AX.get('/api/tabs/profile')
export const getSavedTab = async () => AX.get('/api/tabs/saved')


export const getAllPlaces = async () => AX.get('/api/places')
export const getPlaceById = async (id:string) => AX.get(`/api/places/${id}`)
export const searchplaces = async (query:string) => AX.get(`/api/places/search?query=${query}`)

export const getItineraries = async () => AX.get('/api/itineraries')
export const getItineraryById = async (id:string) => AX.get(`/api/itineraries/${id}`)
export const createItinerary = async (data:object) => AX.post('/api/itineraries', data)
export const deleteItinerary = async (id:string) => AX.delete(`/api/itineraries/${id}`)

export const getCities = async () => AX.get('/api/cities')
export const createTrip = async (data:object) => AX.post('/api/trips', data)
export const getTripById = async (id:string) => AX.get(`/api/trips/${id}`)

export const createAiTrip = async (prompt: string) =>
  AX.post('/api/ai/trips', { prompt })
