import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TileGrid = ({ tiles }: { tiles: { title: string; assetUrl: string }[] }) => (
  <View style={styles.grid}>
    {tiles.map((tile, idx) => (
      <View key={idx} style={styles.tile}>
        <Text>{tile.title}</Text>
        {/* Render asset here */}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  tile: { width: 100, height: 100, margin: 8, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
});

export default TileGrid;