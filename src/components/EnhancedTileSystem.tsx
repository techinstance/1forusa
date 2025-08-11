import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RevealableTile, { sampleTileData } from './RevealableTile';

const { width } = Dimensions.get('window');

interface EnhancedTileSystemProps {
  onTileInteraction?: (tileId: string, data: any) => void;
  onTileReveal?: (tileId: string) => void;
}

const EnhancedTileSystem: React.FC<EnhancedTileSystemProps> = ({
  onTileInteraction,
  onTileReveal,
}) => {
  const [selectedSection, setSelectedSection] = useState<'click' | 'swipe' | 'mixed'>('mixed');
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set());
  const [selectedTile, setSelectedTile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState({
    completedTiles: 0,
    totalInteractions: 0,
    streak: 0,
  });

  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const handleTileReveal = (tile: any) => {
    setRevealedTiles(prev => new Set([...prev, tile.id]));
    setSelectedTile(tile);
    setUserProgress(prev => ({
      ...prev,
      completedTiles: prev.completedTiles + 1,
      streak: prev.streak + 1,
    }));
    onTileReveal?.(tile.id);

    // Celebration animation for good tiles
    if (tile.type === 'good') {
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleTileInteraction = (tile: any, data: any) => {
    setUserProgress(prev => ({
      ...prev,
      totalInteractions: prev.totalInteractions + 1,
    }));
    
    onTileInteraction?.(tile.id, data);
    
    // Show feedback based on interaction
    if (data.input || data.checkboxes?.some((c: boolean) => c) || data.radio !== null) {
      Alert.alert(
        'Response Recorded!',
        'Thank you for your input. Your progress has been saved.',
        [{ text: 'Continue', style: 'default' }]
      );
    }
  };

  const changeSectionWithAnimation = (section: 'click' | 'swipe' | 'mixed') => {
    Animated.timing(slideAnimation, {
      toValue: section === 'click' ? -width : section === 'swipe' ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSelectedSection(section);
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your tile progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setRevealedTiles(new Set());
            setUserProgress({
              completedTiles: 0,
              totalInteractions: 0,
              streak: 0,
            });
          },
        },
      ]
    );
  };

  const renderProgressBar = () => {
    const progress = revealedTiles.size / sampleTileData.length;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <TouchableOpacity onPress={resetProgress} style={styles.resetButton}>
            <Icon name="refresh-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` }
            ]} 
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.statText}>{userProgress.completedTiles} Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="flash" size={16} color="#FF9800" />
            <Text style={styles.statText}>{userProgress.streak} Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="analytics" size={16} color="#2196F3" />
            <Text style={styles.statText}>{userProgress.totalInteractions} Interactions</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSectionSelector = () => {
    return (
      <View style={styles.sectionSelector}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            selectedSection === 'click' && styles.sectionButtonActive
          ]}
          onPress={() => changeSectionWithAnimation('click')}
        >
          <Icon 
            name="hand-left-outline" 
            size={18} 
            color={selectedSection === 'click' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[
            styles.sectionButtonText,
            selectedSection === 'click' && styles.sectionButtonTextActive
          ]}>
            Click to Reveal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            selectedSection === 'swipe' && styles.sectionButtonActive
          ]}
          onPress={() => changeSectionWithAnimation('swipe')}
        >
          <Icon 
            name="swap-horizontal-outline" 
            size={18} 
            color={selectedSection === 'swipe' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[
            styles.sectionButtonText,
            selectedSection === 'swipe' && styles.sectionButtonTextActive
          ]}>
            Swipe to Reveal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            selectedSection === 'mixed' && styles.sectionButtonActive
          ]}
          onPress={() => changeSectionWithAnimation('mixed')}
        >
          <Icon 
            name="grid-outline" 
            size={18} 
            color={selectedSection === 'mixed' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[
            styles.sectionButtonText,
            selectedSection === 'mixed' && styles.sectionButtonTextActive
          ]}>
            Mixed Feed
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTileSection = (tiles: any[], style: 'click' | 'swipe') => {
    return (
      <ScrollView 
        style={styles.tileContainer}
        showsVerticalScrollIndicator={false}
      >
        {tiles.map((tile) => (
          <RevealableTile
            key={tile.id}
            tile={tile}
            style={style}
            onReveal={handleTileReveal}
            onInteraction={handleTileInteraction}
          />
        ))}
      </ScrollView>
    );
  };

  const renderMixedFeed = () => {
    const mixedTiles = [...sampleTileData].map((tile, index) => ({
      ...tile,
      preferredStyle: index % 2 === 0 ? 'click' : 'swipe' as 'click' | 'swipe',
    }));

    return (
      <ScrollView 
        style={styles.tileContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.feedHeader}>
          <Icon name="newspaper-outline" size={24} color="#333" />
          <Text style={styles.feedTitle}>Interactive Wellness Feed</Text>
        </View>
        
        {mixedTiles.map((tile, index) => (
          <View key={tile.id} style={styles.feedItem}>
            {index % 3 === 0 && (
              <View style={styles.feedDivider}>
                <Icon name="time-outline" size={16} color="#999" />
                <Text style={styles.feedDividerText}>Recent Activity</Text>
              </View>
            )}
            
            <RevealableTile
              tile={tile}
              style={tile.preferredStyle}
              onReveal={handleTileReveal}
              onInteraction={handleTileInteraction}
            />
            
            {revealedTiles.has(tile.id) && (
              <View style={styles.completionBadge}>
                <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.completionText}>Completed</Text>
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.feedFooter}>
          <Text style={styles.feedFooterText}>
            You've explored {revealedTiles.size} of {sampleTileData.length} wellness activities
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      {renderProgressBar()}
      
      {/* Grid Layout for Tiles */}
      <View style={styles.tilesGridContainer}>
        <FlatList
          data={sampleTileData}
          renderItem={({ item }) => (
            <View style={styles.tileWrapper}>
              <RevealableTile
                tile={item}
                style="click"
                onReveal={handleTileReveal}
                onInteraction={(tile, data) => {
                  setUserProgress(prev => ({
                    ...prev,
                    totalInteractions: prev.totalInteractions + 1,
                  }));
                  onTileInteraction?.(tile.id, data);
                }}
              />
            </View>
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Content Section Below */}
      {selectedTile && (
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Content here</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{selectedTile.hiddenContent}</Text>
            <Text style={styles.contentDescription}>{selectedTile.description}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    padding: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  sectionSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sectionButtonActive: {
    backgroundColor: '#2196F3',
  },
  sectionButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  sectionButtonTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  tileContainer: {
    flex: 1,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  feedItem: {
    position: 'relative',
  },
  feedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  feedDividerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    fontWeight: '500',
  },
  completionBadge: {
    position: 'absolute',
    top: 12,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 10,
    color: '#4CAF50',
    marginLeft: 2,
    fontWeight: '600',
  },
  feedFooter: {
    padding: 24,
    alignItems: 'center',
  },
  feedFooterText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tilesGridContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tileWrapper: {
    flex: 1,
    margin: 8,
  },
  gridContent: {
    paddingBottom: 16,
  },
  contentSection: {
    backgroundColor: '#2D3748',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  contentBox: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 12,
  },
  contentText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
});

export default EnhancedTileSystem;
