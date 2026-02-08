import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const SavedSkeleton: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Skeleton width={160} height={26} />
      <Skeleton width={'100%'} height={120} borderRadius={16} />
      <Skeleton width={'100%'} height={120} borderRadius={16} />
      <Skeleton width={'100%'} height={120} borderRadius={16} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
});

export default SavedSkeleton;
