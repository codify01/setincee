import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AX = axios.create({
    baseURL: "https://setince-backend.onrender.com/",
    // baseURL: "http://192.168.0.110:3000/",
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

export const getUserProfile = async () => AX.get('/api/users/profile')


export const getAllPlaces = async () => AX.get('/api/places')
export const getPlaceById = async (id:string) => AX.get(`/api/places/${id}`)

export const getItineraries = async () => AX.get('/api/itineraries')
export const getItineraryById = async (id:string) => AX.get(`/api/itineraries/${id}`)
export const createItinerary = async (data:object) => AX.post('/api/itineraries', data)
export const deleteItinerary = async (id:string) => AX.delete(`/api/itineraries/${id}`)