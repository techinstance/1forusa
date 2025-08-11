import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface TileData {
  id: string;
  title: string;
  icon: string;
  color: string;
  hiddenContent: string;
  description: string;
}

interface InteractiveTileGridProps {
  tiles: TileData[];
  onTilePress?: (tile: TileData) => void;
}

const InteractiveTile: React.FC<{
  tile: TileData;
  onPress: () => void;
  isRevealed: boolean;
}> = ({ tile, onPress, isRevealed }) => {
  const animatedValue = React.useRef(
    new Animated.Value(isRevealed ? 1 : 0),
  ).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isRevealed ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isRevealed, animatedValue]);

  const flipInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity
      style={styles.tileContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.tileWrapper}>
        {/* Front of card */}
        <Animated.View
          style={[
            styles.tile,
            { backgroundColor: tile.color },
            {
              opacity: frontOpacity,
              transform: [{ rotateY: flipInterpolate }],
            },
          ]}
        >
          <Icon name={tile.icon} size={40} color="#FFFFFF" />
          <Text style={styles.tileTitle}>{tile.title}</Text>
          <View style={styles.clickHint}>
            <Icon name="hand-left-outline" size={16} color="#FFFFFF80" />
            <Text style={styles.hintText}>Tap to reveal</Text>
          </View>
        </Animated.View>

        {/* Back of card */}
        <Animated.View
          style={[
            styles.tile,
            styles.backTile,
            { backgroundColor: tile.color + 'E6' },
            {
              opacity: backOpacity,
              transform: [{ rotateY: flipInterpolate }],
            },
          ]}
        >
          <Icon name="information-circle-outline" size={32} color="#FFFFFF" />
          <Text style={styles.hiddenTitle}>{tile.title}</Text>
          <Text style={styles.hiddenContent}>{tile.hiddenContent}</Text>
          <Text style={styles.description}>{tile.description}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const InteractiveTileGrid: React.FC<InteractiveTileGridProps> = ({
  tiles,
  onTilePress,
}) => {
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set());
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  const handleTilePress = (tileId: string) => {
    const tile = tiles.find(t => t.id === tileId);
    if (tile) {
      setSelectedTile(tile);
      setRevealedTiles(prev => new Set(prev).add(tileId));
      if (onTilePress) {
        onTilePress(tile);
      }
    }
  };

  const renderTile = ({ item }: { item: TileData }) => (
    <InteractiveTile
      tile={item}
      onPress={() => handleTilePress(item.id)}
      isRevealed={revealedTiles.has(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Content Box at Top */}
      <View style={styles.contentBox}>
        {selectedTile ? (
          <View style={styles.contentDisplay}>
            <Text style={styles.contentTitle}>{selectedTile.title}</Text>
            <Text style={styles.contentText}>{selectedTile.hiddenContent}</Text>
            <Text style={styles.contentDescription}>
              {selectedTile.description}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>
              Click on any tile to reveal content
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.gridTitle}>Interactive Wellness Grid</Text>
      <Text style={styles.subtitle}>
        Tap any tile to discover hidden content
      </Text>

      <FlatList
        data={tiles}
        renderItem={renderTile}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />

      <View style={styles.resetContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setRevealedTiles(new Set());
            setSelectedTile(null);
          }}
        >
          <Icon name="refresh-outline" size={20} color="#007AFF" />
          <Text style={styles.resetText}>Reset All Tiles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Default tiles data with wellness theme
export const defaultWellnessTiles: TileData[] = [
  {
    id: '1',
    title: 'Mindfulness',
    icon: 'leaf-outline',
    color: '#4CAF50',
    hiddenContent: 'Practice being present in the moment',
    description: 'Daily meditation and breathing exercises for mental clarity',
  },
  {
    id: '2',
    title: 'Fitness',
    icon: 'fitness-outline',
    color: '#FF5722',
    hiddenContent: 'Strengthen your body and mind',
    description: '30 minutes of physical activity to boost energy and mood',
  },
  {
    id: '3',
    title: 'Nutrition',
    icon: 'nutrition-outline',
    color: '#FF9800',
    hiddenContent: 'Fuel your body with the right foods',
    description: 'Balanced meals with fruits, vegetables, and whole grains',
  },
  {
    id: '4',
    title: 'Sleep',
    icon: 'moon-outline',
    color: '#3F51B5',
    hiddenContent: 'Rest and recharge for tomorrow',
    description: '7-9 hours of quality sleep for optimal recovery',
  },
  {
    id: '5',
    title: 'Social',
    icon: 'people-outline',
    color: '#E91E63',
    hiddenContent: 'Connect with friends and family',
    description: 'Build meaningful relationships and support networks',
  },
  {
    id: '6',
    title: 'Learning',
    icon: 'book-outline',
    color: '#9C27B0',
    hiddenContent: 'Expand your knowledge and skills',
    description: 'Read, study, or learn something new every day',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentDisplay: {
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 18,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  contentDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  gridTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  grid: {
    flexGrow: 1,
  },
  tileContainer: {
    flex: 1,
    margin: 8,
    maxWidth: (width - 48) / 2,
  },
  tileWrapper: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backfaceVisibility: 'hidden',
  },
  backTile: {
    padding: 12,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  clickHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  hintText: {
    fontSize: 10,
    color: '#FFFFFF80',
    marginLeft: 4,
  },
  hiddenTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  hiddenContent: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  description: {
    fontSize: 10,
    color: '#FFFFFF90',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },
  resetContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  resetText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default InteractiveTileGrid;
