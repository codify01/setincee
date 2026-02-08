import { useCallback, useEffect, useState } from 'react';
import { getTripsTab } from '@/utils/axiosIntances';

export interface TripItem {
  id: string;
  name: string;
  destination: string;
  duration: string;
  travelers: number;
  image: string;
  placesCount?: number;
}

export interface TripsTabData {
  trips: TripItem[];
}

export const useTripsTabData = () => {
  const [data, setData] = useState<TripsTabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTripsTab();
      const payload = response?.data?.data ?? response?.data;
      setData(payload || null);
    } catch (err) {
      setError('Failed to fetch trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await getTripsTab();
      const payload = response?.data?.data ?? response?.data;
      setData(payload || null);
    } catch (err) {
      setError('Failed to fetch trips. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, refreshing, refresh };
};
