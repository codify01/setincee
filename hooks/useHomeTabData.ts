import { useCallback, useEffect, useState } from 'react';
import { getHomeTab } from '@/utils/axiosIntances';

export interface HomeCategory {
  id: string;
  title: string;
  image: string;
}

export interface HomeTrendingItem {
  id: string;
  name: string;
  image: string;
}

export interface HomeRecommendedPlace {
  _id: string;
  name: string;
  description: string;
  rating?: number;
  images: string[];
}

export interface HomeNearbyPlace {
  id: string;
  name: string;
  distance: string;
  image: string;
  rating?: number;
}

export interface HomeRecentTrip {
  id: string;
  name: string;
  date: string;
  image: string;
}

export interface HomeTabData {
  user: { _id: string; firstName: string };
  categories: HomeCategory[];
  trending: HomeTrendingItem[];
  recommendedPlaces: HomeRecommendedPlace[];
  nearbyPlaces: HomeNearbyPlace[];
  recentTrips: HomeRecentTrip[];
}

export const useHomeTabData = (coords?: { lat?: number; lng?: number }) => {
  const [data, setData] = useState<HomeTabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHomeTab(coords);
      const payload = response?.data?.data ?? response?.data;
      setData(payload || null);
    } catch (err) {
      setError('Failed to fetch home data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [coords?.lat, coords?.lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
