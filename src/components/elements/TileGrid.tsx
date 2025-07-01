import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const motivationalMessages = [
  "You got this!",
  "Keep going!",
  "Believe in yourself!",
  "One step at a time.",
  "Stay focused.",
  "Dream big.",
  "Push your limits!",
  "Never give up.",
  "Small wins matter.",
  "Keep showing up.",
  "You're stronger than you think.",
  "Success takes effort.",
];

const TileGrid = () => {
  const [tiles, setTiles] = useState(
    motivationalMessages.map((msg) => ({ revealed: false, content: msg }))
  );

  const [animations] = useState(() =>
    motivationalMessages.map(() => new Animated.Value(0))
  );

  const revealTile = (index: number) => {
    const newTiles = [...tiles];
    newTiles[index].revealed = !newTiles[index].revealed;
    setTiles(newTiles);

    Animated.timing(animations[index], {
      toValue: newTiles[index].revealed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getBackgroundColor = (index: number) => {
    return animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['#ff4d4d', '#4caf50'], // red to green
    });
  };

  return (
    <View style={styles.container}>
      {tiles.map((tile, index) => (
        <TouchableOpacity key={index} onPress={() => revealTile(index)} style={styles.tile}>
          <Animated.View style={[styles.tileInner, { backgroundColor: getBackgroundColor(index) }]}>
            {tile.revealed && <Text style={styles.content}>{tile.content}</Text>}
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const TILE_SIZE = Dimensions.get('window').width / 3.5;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 8,
  },
  tileInner: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  content: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TileGrid;
