import { useCallback, useEffect, useState } from 'react';
import { getProfileTab } from '@/utils/axiosIntances';

export interface ProfileUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
}

export interface ProfileActivity {
  tripsCreated: number;
  placesVisited: number;  
  favorites: number;
  reviews: number;
}

export interface ProfileTabData {
  user: ProfileUser;
  activity: ProfileActivity;
}

export const useProfileTabData = () => {
  const [data, setData] = useState<ProfileTabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfileTab();
      const payload = response?.data?.data ?? response?.data;
      setData(payload || null);
      console.log(payload);
      
    } catch (err) {
      setError('Failed to fetch profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
