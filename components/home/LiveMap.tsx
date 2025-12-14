import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Props {
  location: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
}

const LiveMap: React.FC<Props> = ({ location, loading, error }) => {
  return (
    <View className="h-72 rounded-xl overflow-hidden border border-neutral-300">
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : location ? (
        <>
          {/* <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="You are here" />
        </MapView> */}
        </>
      ) : (
        <Text className="text-center mt-4 text-red-500">{error}</Text>
      )}
    </View>
  );
};

export default LiveMap;
