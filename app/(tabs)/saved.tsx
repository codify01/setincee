import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import SavedSkeleton from '@/components/skeletons/SavedSkeleton';
import { useSavedTabData } from '@/hooks/useSavedTabData';

const saved = () => {
  const { data, loading } = useSavedTabData();
  const items = data?.items ?? [];

  if (loading) {
    return <SavedSkeleton />;
  }

  return (
    <View className="flex-1 bg-white px-5 pt-12">
      <Text className="text-3xl font-semibold text-gray-900 mb-4">Saved</Text>
      {items.length === 0 ? (
        <Text className="text-gray-500">No saved items yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center border border-gray-200 rounded-2xl p-3 mb-3">
              {item.image ? (
                <Image source={{ uri: item.image }} className="w-16 h-16 rounded-xl mr-3" />
              ) : (
                <View className="w-16 h-16 rounded-xl mr-3 bg-gray-100" />
              )}
              <Text className="text-base text-gray-900">{item.title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  )
}

export default saved
