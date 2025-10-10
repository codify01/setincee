import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AX, { getUserProfile } from "@/utils/axiosIntances"; // your axios setup

// Type for the user object
export interface User {
  _id: string;
  profilePicture: string;
  bio: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

// Type for context data
interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (userToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and fetch user on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        const userResponse =  await fetchUser(storedToken);

        console.log("userResponse", userResponse);
        

        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  // Fetch user from API
  const fetchUser = async (authToken: string) => {
    try {
      const response = await getUserProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  // Save token and fetch user
  const login = async (userToken: string) => {
    try {
      await AsyncStorage.setItem("token", userToken);
      setToken(userToken);
      await fetchUser(userToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Clear storage and reset auth

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
