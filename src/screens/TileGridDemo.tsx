import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  // Dimensions,
  SafeAreaView,
} from 'react-native';

// const { width: screenWidth } = Dimensions.get('window');

interface Tile {
  id: string;
  title: string;
  icon: string;
  color: string;
  isSelected: boolean;
  size: 'small' | 'large';
}

const TileGridDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tiles, setTiles] = useState<Tile[]>([
    {
      id: '1',
      title: 'Fitness',
      icon: '💪',
      color: '#FF6B6B',
      isSelected: true,
      size: 'large',
    },
    {
      id: '2',
      title: 'Sleep',
      icon: '😴',
      color: '#4ECDC4',
      isSelected: false,
      size: 'small',
    },
    {
      id: '3',
      title: 'Meditation',
      icon: '🧘',
      color: '#45B7D1',
      isSelected: true,
      size: 'small',
    },
    {
      id: '4',
      title: 'Music',
      icon: '🎵',
      color: '#96CEB4',
      isSelected: false,
      size: 'large',
    },
    {
      id: '5',
      title: 'Water',
      icon: '💧',
      color: '#FFEAA7',
      isSelected: false,
      size: 'small',
    },
    {
      id: '6',
      title: 'Reading',
      icon: '📚',
      color: '#DDA0DD',
      isSelected: true,
      size: 'small',
    },
  ]);

  const [animatedHearts, setAnimatedHearts] = useState<
    Array<{ id: string; x: number; y: number; animation: Animated.Value }>
  >([]);
  const animationCounter = useRef(0);

  const handleTilePress = (tileId: string, event: any) => {
    // Toggle selection
    setTiles(prev =>
      prev.map(tile =>
        tile.id === tileId ? { ...tile, isSelected: !tile.isSelected } : tile,
      ),
    );

    // Add heart animation
    const { pageX, pageY } = event.nativeEvent;
    const heartId = `heart_${animationCounter.current++}`;
    const animation = new Animated.Value(0);

    setAnimatedHearts(prev => [
      ...prev,
      { id: heartId, x: pageX - 15, y: pageY - 15, animation },
    ]);

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimatedHearts(prev => prev.filter(h => h.id !== heartId));
    });
  };

  const renderTile = (tile: Tile) => {
    const tileSize = tile.size === 'large' ? 140 : 65;

    return (
      <TouchableOpacity
        key={tile.id}
        style={[
          styles.tile,
          {
            width: tileSize,
            height: tileSize,
            backgroundColor: tile.isSelected ? tile.color : '#FFFFFF',
          },
          tile.isSelected && styles.selectedTile,
        ]}
        onPress={event => handleTilePress(tile.id, event)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tileIcon,
            { fontSize: tile.size === 'large' ? 36 : 20 },
          ]}
        >
          {tile.icon}
        </Text>
        <Text
          style={[
            styles.tileLabel,
            {
              color: tile.isSelected ? '#FFFFFF' : '#333333',
              fontSize: tile.size === 'large' ? 12 : 9,
            },
          ]}
        >
          {tile.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search wellness activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Wellness Journey</Text>

        {/* Large Tiles Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalSection}
        >
          <View style={styles.horizontalRow}>
            {tiles.filter(tile => tile.size === 'large').map(renderTile)}
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>Quick Activities</Text>

        {/* Small Tiles Grid */}
        <View style={styles.verticalGrid}>
          {tiles.filter(tile => tile.size === 'small').map(renderTile)}
        </View>
      </ScrollView>

      {/* Animated Hearts */}
      {animatedHearts.map(heart => {
        const translateY = heart.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        });
        const opacity = heart.animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 0],
        });

        return (
          <Animated.View
            key={heart.id}
            style={[
              styles.animatedHeart,
              {
                left: heart.x,
                top: heart.y,
                transform: [{ translateY }],
                opacity,
              },
            ]}
          >
            <Text style={styles.heartIcon}>❤️</Text>
          </Animated.View>
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    marginTop: 10,
  },
  horizontalSection: {
    marginBottom: 25,
  },
  horizontalRow: {
    flexDirection: 'row',
    gap: 15,
    paddingRight: 20,
  },
  verticalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  tile: {
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  selectedTile: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tileIcon: {
    marginBottom: 4,
  },
  tileLabel: {
    fontWeight: '600',
    textAlign: 'center',
  },
  animatedHeart: {
    position: 'absolute',
    zIndex: 1000,
  },
  heartIcon: {
    fontSize: 30,
  },
});

export default TileGridDemo;
