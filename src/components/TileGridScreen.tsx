// components/TileGridScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import * as Animatable from 'react-native-animatable';

type Tile = {
  id: string;
  type: 'good' | 'bad';
  text: string;
};

const tilesData: Tile[] = [
  { id: '1', type: 'good', text: 'Save money' },
  { id: '2', type: 'bad', text: 'Overspend' },
  { id: '3', type: 'good', text: 'Invest wisely' },
  { id: '4', type: 'bad', text: 'Ignore budget' },
  { id: '5', type: 'good', text: 'Track expenses' },
  { id: '6', type: 'bad', text: 'Impulsive buys' },
];

const TileGridScreen = () => {
  const [revealed, setRevealed] = useState<{ [key: string]: boolean }>({});

  const handlePress = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const renderTile: ListRenderItem<Tile> = ({ item }) => {
    const isRevealed = revealed[item.id];
    return (
      <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.tileWrapper}>
        <Animatable.View
          animation={isRevealed ? 'bounceIn' : undefined}
          duration={600}
          style={[
            styles.tile,
            isRevealed && (item.type === 'good' ? styles.good : styles.bad),
          ]}
        >
          <Text style={styles.text}>
            {isRevealed ? item.text : '?'}
          </Text>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tilesData}
        numColumns={2}
        renderItem={renderTile}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default TileGridScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  tileWrapper: {
    flex: 1,
    margin: 10,
  },
  tile: {
    height: 100,
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  good: {
    backgroundColor: '#4CAF50',
  },
  bad: {
    backgroundColor: '#F44336',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

