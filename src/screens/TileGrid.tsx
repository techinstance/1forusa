import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Tile {
  id: string;
  title: string;
  icon: string;
  color: string;
  isSelected: boolean;
  size: 'small' | 'large';
}

interface AnimatedElement {
  id: string;
  x: number;
  y: number;
  animation: Animated.Value;
  type: 'heart' | 'sparkle';
}

const TileGridScreen: React.FC = () => {
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
    {
      id: '7',
      title: 'Cooking',
      icon: '🍳',
      color: '#FFB347',
      isSelected: false,
      size: 'large',
    },
    {
      id: '8',
      title: 'Walking',
      icon: '🚶',
      color: '#98D8C8',
      isSelected: false,
      size: 'small',
    },
  ]);

  const [searchResults, setSearchResults] = useState<Tile[]>([
    {
      id: '9',
      title: 'Yoga',
      icon: '🧘‍♀️',
      color: '#F7DC6F',
      isSelected: false,
      size: 'small',
    },
    {
      id: '10',
      title: 'Journal',
      icon: '📝',
      color: '#BB8FCE',
      isSelected: false,
      size: 'small',
    },
    {
      id: '11',
      title: 'Social',
      icon: '👥',
      color: '#85C1E9',
      isSelected: false,
      size: 'small',
    },
  ]);

  const [animatedElements, setAnimatedElements] = useState<AnimatedElement[]>(
    [],
  );
  const animationCounter = useRef(0);

  const handleTilePress = (tileId: string, event: any) => {
    // Toggle tile selection
    setTiles(prev =>
      prev.map(tile =>
        tile.id === tileId ? { ...tile, isSelected: !tile.isSelected } : tile,
      ),
    );

    // Create animated feedback
    const { pageX, pageY } = event.nativeEvent;
    createAnimatedFeedback(pageX, pageY);
  };

  const createAnimatedFeedback = (x: number, y: number) => {
    const elementId = `animation_${animationCounter.current++}`;
    const animation = new Animated.Value(0);
    const type = Math.random() > 0.5 ? 'heart' : 'sparkle';

    const newElement: AnimatedElement = {
      id: elementId,
      x: x - 15,
      y: y - 15,
      animation,
      type,
    };

    setAnimatedElements(prev => [...prev, newElement]);

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimatedElements(prev => prev.filter(el => el.id !== elementId));
    });
  };

  const addTileFromSearch = (searchTile: Tile) => {
    const newTile = { ...searchTile, id: Date.now().toString() };
    setTiles(prev => [...prev, newTile]);
    setSearchResults(prev => prev.filter(tile => tile.id !== searchTile.id));
  };

  const filteredSearchResults = searchResults.filter(tile =>
    tile.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderTile = (tile: Tile, isSearchResult = false) => {
    const tileSize = tile.size === 'large' ? 160 : 75;
    const tileStyle = [
      styles.tile,
      {
        width: tileSize,
        height: tileSize,
        backgroundColor: tile.isSelected ? tile.color : '#FFFFFF',
      },
      tile.isSelected && styles.selectedTile,
    ];

    return (
      <TouchableOpacity
        key={tile.id}
        style={tileStyle}
        onPress={event => !isSearchResult && handleTilePress(tile.id, event)}
        activeOpacity={0.8}
      >
        <View style={styles.tileContent}>
          <Text
            style={[
              styles.tileIcon,
              tile.size === 'large'
                ? styles.tileIconLarge
                : styles.tileIconSmall,
            ]}
          >
            {tile.icon}
          </Text>
          <Text
            style={[
              styles.tileLabel,
              styles.tileLabelDynamic,
              tile.isSelected && styles.tileLabelSelected,
              tile.size === 'large' && styles.tileLabelLarge,
            ]}
          >
            {tile.title}
          </Text>
        </View>
        {isSearchResult && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addTileFromSearch(tile)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderAnimatedElement = (element: AnimatedElement) => {
    const translateY = element.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -50],
    });

    const scale = element.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1.2, 0],
    });

    const opacity = element.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View
        key={element.id}
        style={[
          styles.animatedElement,
          {
            left: element.x,
            top: element.y,
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <Text style={styles.animatedIcon}>
          {element.type === 'heart' ? '❤️' : '✨'}
        </Text>
      </Animated.View>
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
            placeholder="Search activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      {/* Search Results */}
      {searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.searchResultsRow}>
              {filteredSearchResults.map(tile => renderTile(tile, true))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Main Tile Grid */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Activities</Text>

        {/* Horizontal Scrollable Row */}
        <View style={styles.horizontalSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalRow}>
              {tiles
                .filter(tile => tile.size === 'large')
                .map(tile => renderTile(tile))}
            </View>
          </ScrollView>
        </View>

        {/* Vertical Grid */}
        <View style={styles.verticalGrid}>
          {tiles
            .filter(tile => tile.size === 'small')
            .map(tile => (
              <View key={tile.id} style={styles.gridItem}>
                {renderTile(tile)}
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Animated Feedback Elements */}
      {animatedElements.map(renderAnimatedElement)}
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
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchResultsRow: {
    flexDirection: 'row',
    gap: 15,
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
    gap: 15,
  },
  gridItem: {
    width: (screenWidth - 55) / 4, // 4 items per row with gaps
  },
  tile: {
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  selectedTile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tileContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIcon: {
    marginBottom: 4,
  },
  tileIconLarge: {
    fontSize: 40,
  },
  tileIconSmall: {
    fontSize: 24,
  },
  tileLabel: {
    fontWeight: '600',
    textAlign: 'center',
  },
  tileLabelDynamic: {
    color: '#333333',
    fontSize: 10,
  },
  tileLabelSelected: {
    color: '#FFFFFF',
  },
  tileLabelLarge: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animatedElement: {
    position: 'absolute',
    zIndex: 1000,
  },
  animatedIcon: {
    fontSize: 30,
  },
});

export default TileGridScreen;
