import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

interface TileData {
  id: string;
  title: string;
  color: string;
  icon: string;
}

const TileGrid = () => {
  const tiles: TileData[] = [
    { id: '1', title: 'Goals', color: '#4CAF50', icon: '🎯' },
    { id: '2', title: 'Health', color: '#2196F3', icon: '💪' },
    { id: '3', title: 'Learning', color: '#FF9800', icon: '📚' },
    { id: '4', title: 'Finance', color: '#9C27B0', icon: '💰' },
    { id: '5', title: 'Social', color: '#F44336', icon: '👥' },
    { id: '6', title: 'Travel', color: '#00BCD4', icon: '✈️' },
    { id: '7', title: 'Career', color: '#795548', icon: '💼' },
    { id: '8', title: 'Hobbies', color: '#607D8B', icon: '🎨' },
  ];

  const handleTilePress = (tile: TileData) => {
    console.log(`Pressed tile: ${tile.title}`);
  };

  const renderTile = ({ item }: { item: TileData }) => (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: item.color }]}
      onPress={() => handleTilePress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.tileTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tile Grid Component</Text>
      <FlatList
        data={tiles}
        renderItem={renderTile}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  grid: {
    alignItems: 'center',
  },
  tile: {
    width: 140,
    height: 120,
    margin: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  tileTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TileGrid;
