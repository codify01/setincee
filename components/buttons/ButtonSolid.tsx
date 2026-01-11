import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { RelativePathString, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  icon?: React.ReactNode;
  title?: string;
  path?: RelativePathString;
  onPress?: () => void;
  loading?: boolean;
}

const ButtonSolid: React.FC<Props> = ({ title, icon, path, onPress, loading }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress ? onPress : path ? () => router.push(path) : undefined}
      style={{ borderRadius: 999 }}
    >
      <LinearGradient
        colors={[ '#9810FA', '#155DFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} 
        style={styles.gradientButton}
      >
        {
          loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              
        <Text className="text-white text-lg font-medium">{title}</Text>
        {icon && <View>{icon}</View>}
            </>
          )
        }
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});

export default ButtonSolid;
