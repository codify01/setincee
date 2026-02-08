import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const ExploreSkeleton: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Skeleton width={120} height={26} />
          <Skeleton width={200} height={16} style={styles.mt8} />
        </View>
        <Skeleton width={28} height={28} borderRadius={14} />
      </View>

      <Skeleton width={'100%'} height={52} borderRadius={26} style={styles.mt12} />

      <View style={styles.row}>
        <Skeleton width={110} height={40} borderRadius={20} />
        <Skeleton width={110} height={40} borderRadius={20} />
        <Skeleton width={110} height={40} borderRadius={20} />
      </View>

      <View style={styles.section}>
        <Skeleton width={200} height={22} />
        <View style={styles.row}>
          <Skeleton width={260} height={220} borderRadius={16} />
          <Skeleton width={260} height={220} borderRadius={16} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={180} height={22} />
        <Skeleton width={'100%'} height={110} borderRadius={16} style={styles.mt12} />
        <Skeleton width={'100%'} height={110} borderRadius={16} style={styles.mt12} />
        <Skeleton width={'100%'} height={110} borderRadius={16} style={styles.mt12} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    marginTop: 16,
    gap: 12,
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
});

export default ExploreSkeleton;
