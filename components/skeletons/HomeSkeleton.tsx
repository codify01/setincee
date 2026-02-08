import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const HomeSkeleton: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.headerText}>
          <Skeleton width={180} height={18} />
          <Skeleton width={220} height={18} style={styles.mt8} />
        </View>
      </View>

      <View style={styles.sectionRow}>
        <Skeleton width={220} height={28} />
        <Skeleton width={56} height={56} borderRadius={28} />
      </View>

      <View style={styles.row}>
        <Skeleton width={120} height={42} borderRadius={24} />
        <Skeleton width={120} height={42} borderRadius={24} />
        <Skeleton width={120} height={42} borderRadius={24} />
      </View>

      <Skeleton width={'100%'} height={180} borderRadius={16} style={styles.mt16} />

      <Skeleton width={160} height={22} style={styles.mt24} />
      <View style={styles.row}>
        <Skeleton width={190} height={220} borderRadius={16} />
        <Skeleton width={190} height={220} borderRadius={16} />
      </View>

      <Skeleton width={200} height={22} style={styles.mt24} />
      <View style={styles.row}>
        <Skeleton width={200} height={180} borderRadius={16} />
        <Skeleton width={200} height={180} borderRadius={16} />
      </View>

      <Skeleton width={180} height={22} style={styles.mt24} />
      <Skeleton width={'100%'} height={220} borderRadius={16} />

      <Skeleton width={160} height={22} style={styles.mt24} />
      <View style={styles.row}>
        <Skeleton width={170} height={120} borderRadius={16} />
        <Skeleton width={170} height={120} borderRadius={16} />
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
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  mt8: {
    marginTop: 8,
  },
  mt16: {
    marginTop: 16,
  },
  mt24: {
    marginTop: 24,
  },
});

export default HomeSkeleton;
