import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Skeleton width={96} height={96} borderRadius={48} />
        <Skeleton width={180} height={20} style={styles.mt12} />
        <Skeleton width={120} height={14} style={styles.mt8} />
      </View>

      <View style={styles.card}>
        <Skeleton width={'70%'} height={18} />
        <Skeleton width={'90%'} height={18} style={styles.mt12} />
        <Skeleton width={'85%'} height={18} style={styles.mt12} />
      </View>

      <View style={styles.card}>
        <Skeleton width={'50%'} height={18} />
        <Skeleton width={'100%'} height={18} style={styles.mt12} />
        <Skeleton width={'90%'} height={18} style={styles.mt12} />
        <Skeleton width={'80%'} height={18} style={styles.mt12} />
      </View>

      <View style={styles.card}>
        <Skeleton width={'40%'} height={18} />
        <Skeleton width={'90%'} height={18} style={styles.mt12} />
        <Skeleton width={'80%'} height={18} style={styles.mt12} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
});

export default ProfileSkeleton;
