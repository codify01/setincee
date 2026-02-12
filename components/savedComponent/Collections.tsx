import { View, Text, FlatList, ListRenderItem } from 'react-native';
import React from 'react';
import CollectionCard from './CollectionCard';

interface CollectionItem {
    id: string;
    name: string;
    placesCount: number;
    color: string;
}

interface CollectionsProps {
    collections: CollectionItem[];
    selectedCollection: string | null;
    onSelectCollection: (collectionName: string | null) => void;
}

const Collections: React.FC<CollectionsProps> = ({
    collections,
    selectedCollection,
    onSelectCollection,
}) => {
    const renderCollectionItem: ListRenderItem<CollectionItem> = ({ item }) => (
        <CollectionCard
            name={item.name}
            placesCount={item.placesCount}
            isSelected={selectedCollection === item.name}
            onPress={() => onSelectCollection(selectedCollection === item.name ? null : item.name)}
            color={item.color}
        />
    );

    return (
        <View>
            <View className='flex-row justify-between py-4'>
                <Text className='text-lg font-bold'>Collections</Text>
                <Text className='text-blue-500'>+ New</Text>
            </View>
            <View className='relative right-4'>

            <FlatList
                data={collections}
                renderItem={renderCollectionItem}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
            </View>
        </View>
    );
};

export default Collections;
