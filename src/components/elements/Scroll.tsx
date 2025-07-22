import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const Scroll = () => {
  const [tiles, setTiles] = useState([
    { id: 1, title: 'Tile 1', content: 'Content 1', revealed: false, text: 'Click again' },
    { id: 2, title: 'Tile 2', content: 'Content 2', revealed: false, text: 'Touch again' },
    { id: 3, title: 'Tile 3', content: 'Content 3', revealed: false, text: 'Try again' },
    { id: 4, title: 'Tile 4', content: 'Content 4', revealed: false, text: 'Do again' },
    { id: 5, title: 'Tile 5', content: 'Content 5', revealed: false, text: 'Feel again' },
  ]);

  const toggleTile = (id : any) => {
    setTiles(tiles.map(tile =>
      tile.id === id
        ? { ...tile, revealed: !tile.revealed, text: tile.revealed ? 'Click again' : tile.text }
        : tile
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>combined feed scrollable</Text>
      {tiles.map(tile => (
        <TouchableOpacity key={tile.id} onPress={() => toggleTile(tile.id)} style={styles.tile}>
          <View style={[styles.tileContent, tile.revealed && { backgroundColor: '#90EE90' }]}>
            <Text style={styles.tileTitle}>{tile.title}</Text>
            {tile.revealed && <Text style={styles.tileText}>{tile.content}</Text>}
            <Text style={styles.repeatText}>{tile.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
    backgroundColor: '#8B4513',
    padding: 10,
  },
  tile: {
    marginBottom: 10,
  },
  tileContent: {
    backgroundColor: '#3CB371',
    padding: 15,
    borderRadius: 5,
  },
  tileTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  tileText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 5,
  },
  repeatText: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 5,
  },
});

export default Scroll;