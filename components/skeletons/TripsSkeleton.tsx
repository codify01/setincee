import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const TripsSkeleton: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Skeleton width={140} height={28} />
        <Skeleton width={220} height={16} style={styles.mt8} />
      </View>

      <Skeleton width={'100%'} height={180} borderRadius={16} />
      <Skeleton width={'100%'} height={180} borderRadius={16} />
      <Skeleton width={'100%'} height={180} borderRadius={16} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginTop: 12,
  },
  mt8: {
    marginTop: 8,
  },
});

export default TripsSkeleton;
