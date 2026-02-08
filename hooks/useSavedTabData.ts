import { useCallback, useEffect, useState } from 'react';
import { getSavedTab } from '@/utils/axiosIntances';

export interface SavedItem {
  id: string;
  title: string;
  image?: string;
}

export interface SavedTabData {
  items: SavedItem[];
}

export const useSavedTabData = () => {
  const [data, setData] = useState<SavedTabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSavedTab();
      const payload = response?.data?.data ?? response?.data;
      setData(payload || null);
    } catch (err) {
      setError('Failed to fetch saved items. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
