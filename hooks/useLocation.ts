import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  location: Location.LocationObjectCoords | null;
  locationText: string | null;
  loading: boolean;
  error: string | null;
}

export const useLocation = (): LocationState => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locationText, setLocationText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setError('Permission to access location was denied');
            setLoading(false);
          }
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(currentLocation.coords);
          try {
            const results = await Location.reverseGeocodeAsync({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
            const place = results?.[0];
            const city = place?.city || place?.subregion || place?.region;
            const region = place?.region;
            const country = place?.country;
            const formatted = [city, region, country].filter(Boolean).join(', ');
            if (formatted) {
              setLocationText(formatted);
            }
          } catch {
            // Best-effort only; location text is optional.
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch location');
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, locationText, loading, error };
};
