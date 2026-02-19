import React from 'react';
import { View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

interface Props {
  location: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
  places?: Array<{
    id?: string;
    _id?: string;
    name?: string;
    location?: { latitude?: number; longitude?: number };
    lat?: number;
    lng?: number;
    latitude?: number;
    longitude?: number;
  }>;
  fullScreen?: boolean;
}

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
const mapboxTileUrl = mapboxToken
  ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`
  : null;

const getPlaceCoords = (place: Props['places'][number]) => {
  const lat =
    place?.location?.latitude ??
    place?.latitude ??
    place?.lat;
  const lng =
    place?.location?.longitude ??
    place?.longitude ??
    place?.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
    return { latitude: lat, longitude: lng };
  }
  return null;
};

const LiveMap: React.FC<Props> = ({ location, loading, error, places, fullScreen }) => {
  const placeMarkers =
    places
      ?.map((p) => {
        const coords = getPlaceCoords(p);
        if (!coords) return null;
        return {
          key: p._id ?? p.id ?? `${coords.latitude},${coords.longitude}`,
          title: p.name ?? 'Place',
          coords,
        };
      })
      .filter(Boolean) ?? [];

  const fallbackCenter =
    location ??
    (placeMarkers.length > 0 ? placeMarkers[0]?.coords : null);

  return (
    <SafeAreaView className={fullScreen ? 'flex-1' : 'h-72 rounded-xl overflow-hidden border border-neutral-300'}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : fallbackCenter ? (
        <MapView
          style={{ flex: 1 }}
          mapType="none"
          initialRegion={{
            latitude: fallbackCenter.latitude,
            longitude: fallbackCenter.longitude,
            latitudeDelta: fullScreen ? 0.05 : 0.01,
            longitudeDelta: fullScreen ? 0.05 : 0.01,
          }}
        >
          {mapboxTileUrl ? (
            <UrlTile
              urlTemplate={mapboxTileUrl}
              maximumZ={19}
              tileSize={256}
            />
          ) : (
            <></>
          )}
          {location ? <Marker coordinate={location} title="You are here" /> : null}
          {placeMarkers.map((p) => (
            <Marker key={p.key} coordinate={p.coords} title={p.title} />
          ))}
        </MapView>
      ) : (
        <Text className="text-center mt-4 text-red-500">{error}</Text>
      )}
      {!mapboxTileUrl && !loading ? (
        <Text className="text-center mt-2 text-xs text-neutral-600">
          Missing EXPO_PUBLIC_MAPBOX_TOKEN in .env
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

export default LiveMap;
