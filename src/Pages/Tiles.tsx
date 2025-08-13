import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import InteractiveTileGrid, {
  defaultWellnessTiles,
} from '../components/InteractiveTileGrid';

const Tiles: React.FC = () => {
  const handleTileInteraction = (tile: any) => {
    console.log('Tile interaction:', tile);
  };

  // Use only first 4 tiles with same color
  const simplifiedTiles = defaultWellnessTiles.slice(0, 4).map(tile => ({
    ...tile,
    color: '#4CAF50', // Same green color for all tiles
  }));

  return (
    <SafeAreaView style={styles.container}>
      <InteractiveTileGrid
        tiles={simplifiedTiles}
        onTilePress={handleTileInteraction}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default Tiles;
