import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Simple 4 Tiles Data
const simpleTileData = [
  {
    id: 'tile1',
    title: 'Wellness',
    content:
      'Focus on your mental and physical health through daily practices like meditation, exercise, and proper nutrition.',
    emoji: '🧘‍♀️',
  },
  {
    id: 'tile2',
    title: 'Growth',
    content:
      'Continuous learning and personal development help you become the best version of yourself.',
    emoji: '🌱',
  },
  {
    id: 'tile3',
    title: 'Connection',
    content:
      'Building meaningful relationships and maintaining social connections are essential for happiness.',
    emoji: '❤️',
  },
  {
    id: 'tile4',
    title: 'Purpose',
    content:
      'Finding your life purpose and pursuing meaningful goals gives direction and fulfillment to your journey.',
    emoji: '🎯',
  },
];

interface UltraTileSystemProps {
  onTileInteraction?: (tileId: string, data: any) => void;
}

const UltraTileSystem: React.FC<UltraTileSystemProps> = ({
  onTileInteraction,
}) => {
  const [selectedTile, setSelectedTile] = useState<any>(null);

  // Handle Tile Click
  const handleTileClick = (tile: any) => {
    setSelectedTile(tile);
    onTileInteraction?.(tile.id, { clicked: true, timestamp: Date.now() });
  };

  // Render Individual Tile
  const renderTile = (tile: any, _index: number) => {
    const isSelected = selectedTile?.id === tile.id;

    return (
      <TouchableOpacity
        key={tile.id}
        style={[styles.tile, isSelected && styles.selectedTile]}
        onPress={() => handleTileClick(tile)}
        activeOpacity={0.8}
      >
        <Text style={styles.tileEmoji}>{tile.emoji}</Text>
        <Text style={styles.tileTitle}>{tile.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tiles Grid */}
      <View style={styles.tilesGrid}>
        <FlatList
          data={simpleTileData}
          renderItem={({ item, index }) => renderTile(item, index)}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* Content Box */}
      <View style={styles.contentBox}>
        {selectedTile ? (
          <>
            <Text style={styles.contentTitle}>{selectedTile.title}</Text>
            <Text style={styles.contentText}>{selectedTile.content}</Text>
          </>
        ) : (
          <Text style={styles.placeholderText}>
            Click on any tile to see its content here
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  tilesGrid: {
    marginBottom: 20,
  },
  gridContainer: {
    justifyContent: 'center',
  },
  tile: {
    width: (width - 48) / 2, // Account for padding and gap
    height: (width - 48) / 2,
    backgroundColor: '#4CAF50', // Same green color for all tiles
    borderRadius: 12,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTile: {
    backgroundColor: '#2E7D32', // Darker green when selected
    elevation: 6,
  },
  tileEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 8,
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 50,
  },
});

export default UltraTileSystem;
