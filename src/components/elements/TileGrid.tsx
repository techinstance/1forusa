import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const motivationalMessages = [
  'You got this!',
  'Keep going!',
  'Believe in yourself!',
  'One step at a time.',
  'Stay focused.',
  'Dream big.',
  'Push your limits!',
  'Never give up.',
  'Small wins matter.',
  'Keep showing up.',
  "You're stronger than you think.",
  'Success takes effort.',
];

const TILE_COUNT = motivationalMessages.length;

const TileGrid = () => {
  const [tiles, setTiles] = useState(
    Array.from({ length: TILE_COUNT }, () => ({
      revealed: false,
      content: '',
      timer: null as NodeJS.Timeout | null,
    }))
  );

  const [animations] = useState(() =>
    Array.from({ length: TILE_COUNT }, () => new Animated.Value(0))
  );

  const getRandomMessage = (exclude: string = '') => {
    const filtered = motivationalMessages.filter((msg) => msg !== exclude);
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const revealTile = (index: number) => {
    const newTiles = [...tiles];
    const currentTile = newTiles[index];

    // Cancel existing timer
    if (currentTile.timer) clearTimeout(currentTile.timer);

    const newMessage = getRandomMessage(currentTile.content);
    currentTile.revealed = true;
    currentTile.content = newMessage;

    setTiles(newTiles);

    Animated.timing(animations[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Auto-close after 2 seconds
    const timer = setTimeout(() => {
      const updatedTiles = [...newTiles];
      updatedTiles[index].revealed = false;
      updatedTiles[index].timer = null;
      setTiles(updatedTiles);

      Animated.timing(animations[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 2000);

    currentTile.timer = timer;
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
