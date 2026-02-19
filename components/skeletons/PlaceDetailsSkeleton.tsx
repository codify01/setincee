import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const PlaceDetailsSkeleton: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <Skeleton width="100%" height={360} borderRadius={0} />
      <View className="px-5 pt-6">
        <Skeleton width={220} height={28} />
        <Skeleton width={140} height={18} style={styles.mt8} />

        <View className="flex-row justify-between mt-6">
          <Skeleton width={120} height={48} borderRadius={12} />
          <Skeleton width={120} height={48} borderRadius={12} />
          <Skeleton width={120} height={48} borderRadius={12} />
        </View>

        <View className="mt-8">
          <Skeleton width={120} height={20} />
          <Skeleton width="100%" height={16} style={styles.mt8} />
          <Skeleton width="90%" height={16} style={styles.mt8} />
          <Skeleton width="85%" height={16} style={styles.mt8} />
        </View>

        <View className="mt-8">
          <Skeleton width={160} height={20} />
          <Skeleton width="100%" height={160} borderRadius={16} style={styles.mt12} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
});

export default PlaceDetailsSkeleton;
