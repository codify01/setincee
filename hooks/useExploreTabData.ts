import { useCallback, useEffect, useState } from 'react';
import { getExploreTab } from '@/utils/axiosIntances';

export interface ExploreCategory {
  name: string;
  icon: string;
  value: string;
}

export interface ExploreTrendingItem {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  rating: number;
  reviews: number;
  image: string;
}

export interface ExplorePlaceItem {
  _id: string;
  name: string;
  address: string;
  images: string[];
}

export interface ExploreTabData {
  categories: ExploreCategory[];
  trending: ExploreTrendingItem[];
  places: ExplorePlaceItem[];
}

export const useExploreTabData = (coords?: { lat?: number; lng?: number }) => {
  const [data, setData] = useState<ExploreTabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExploreTab(coords);
      const payload = response?.data?.data ?? response?.data;
      setData(payload || null);
    } catch (err) {
      setError('Failed to fetch explore data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [coords?.lat, coords?.lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
