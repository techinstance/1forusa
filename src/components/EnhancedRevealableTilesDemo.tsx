import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RevealableTile, { sampleTileData } from './RevealableTile';

const EnhancedRevealableTilesDemo: React.FC = () => {
  const [selectedVariation, setSelectedVariation] = useState<'all' | 'click' | 'swipe' | 'interactive'>('all');

  const variations = [
    {
      id: 'all',
      title: 'All Variations',
      icon: 'apps-outline',
      description: 'Show all tile types and variations',
    },
    {
      id: 'click',
      title: 'Click Variations',
      icon: 'hand-left-outline',
      description: 'Click-to-reveal with animations and sounds',
    },
    {
      id: 'swipe',
      title: 'Swipe Variations',
      icon: 'swap-horizontal-outline',
      description: 'Swipe-based reveals with gestures',
    },
    {
      id: 'interactive',
      title: 'Interactive Forms',
      icon: 'create-outline',
      description: 'Forms, checkboxes, radio buttons, and color choices',
    },
  ];

  const getFilteredTiles = () => {
    switch (selectedVariation) {
      case 'click':
        return sampleTileData.filter(tile => 
          tile.animationType || tile.requiresRepeatClick || tile.soundEffect
        );
      case 'swipe':
        return sampleTileData.slice(0, 3); // First 3 tiles for swipe demo
      case 'interactive':
        return sampleTileData.filter(tile => 
          tile.requiresInput || tile.hasCheckboxes || tile.hasRadio || tile.hasColorButtons
        );
      default:
        return sampleTileData;
    }
  };

  const handleTileReveal = (tile: any) => {
    console.log('🎯 Tile revealed:', tile.title);
    Alert.alert('Tile Revealed!', `You revealed: ${tile.title}`);
  };

  const handleTileInteraction = (tile: any, data: any) => {
    console.log('🎮 Tile interaction:', tile.title, data);
    
    let message = `Interaction with "${tile.title}":\n`;
    if (data.input) message += `• Text: ${data.input}\n`;
    if (data.checkboxes?.some((c: boolean) => c)) {
      message += `• Checkboxes: ${data.checkboxes.filter((c: boolean) => c).length} selected\n`;
    }
    if (data.radio !== null) message += `• Radio: Option ${data.radio + 1}\n`;
    if (data.colorButtonRevealed) message += `• Color: ${data.colorButtonRevealed}\n`;

    Alert.alert('Interaction Recorded!', message);
  };

  const renderVariationSelector = () => {
    return (
      <View style={styles.variationSelector}>
        <Text style={styles.selectorTitle}>Choose Tile Variation:</Text>
        <View style={styles.variationButtons}>
          {variations.map((variation) => (
            <TouchableOpacity
              key={variation.id}
              style={[
                styles.variationButton,
                selectedVariation === variation.id && styles.selectedVariation,
              ]}
              onPress={() => setSelectedVariation(variation.id as any)}
            >
              <Icon 
                name={variation.icon} 
                size={20} 
                color={selectedVariation === variation.id ? '#FFFFFF' : '#666'} 
              />
              <Text style={[
                styles.variationButtonText,
                selectedVariation === variation.id && styles.selectedVariationText,
              ]}>
                {variation.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.variationDescription}>
          {variations.find(v => v.id === selectedVariation)?.description}
        </Text>
      </View>
    );
  };

  const renderFeaturesList = () => {
    return (
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>🚀 Implemented Features:</Text>
        
        <View style={styles.featureItem}>
          <Icon name="color-palette-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Red/Green color coding for good/bad tiles</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="hand-left-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Click-to-animate with bounce, shake, pulse effects</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="volume-high-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Sound effects simulation (console logs)</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="image-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Text and content behind tiles</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="repeat-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Repeat click requirement with progress</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="create-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Text boxes for user input</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="checkbox-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Checkboxes for multiple selection</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="radio-button-on-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Radio buttons with correct answers</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="color-filter-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Color buttons (red/green) for content reveal</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="swap-horizontal-outline" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Swipe gestures (left/right/top/bottom)</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enhanced Revealable Tiles</Text>
        <Text style={styles.headerSubtitle}>
          All variations implemented: click-to-reveal, animations, sounds, forms, and more!
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderVariationSelector()}
        {renderFeaturesList()}
        
        <View style={styles.tilesContainer}>
          <Text style={styles.tilesTitle}>
            Interactive Tiles ({getFilteredTiles().length} tiles)
          </Text>
          
          {getFilteredTiles().map((tile) => (
            <RevealableTile
              key={tile.id}
              tile={tile}
              style={selectedVariation === 'swipe' ? 'swipe' : 'click'}
              onReveal={handleTileReveal}
              onInteraction={handleTileInteraction}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  variationSelector: {
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
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  variationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  variationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    minWidth: '45%',
    gap: 6,
  },
  selectedVariation: {
    backgroundColor: '#2196F3',
  },
  variationButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  selectedVariationText: {
    color: '#FFFFFF',
  },
  variationDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  tilesContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tilesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default EnhancedRevealableTilesDemo;
