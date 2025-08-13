import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface TileData {
  id: string;
  title: string;
  content: string;
  type: 'good' | 'bad' | 'neutral';
  hiddenContent?: string;
  description?: string;
  requiresInput?: boolean;
  hasCheckboxes?: boolean;
  hasRadio?: boolean;
  options?: string[];
  correctAnswer?: number;
  hasColorButtons?: boolean;
  requiresRepeatClick?: boolean;
  clickCount?: number;
  maxClicks?: number;
  soundEffect?: 'good' | 'bad' | 'neutral';
  animationType?: 'bounce' | 'shake' | 'pulse' | 'flip';
  backgroundImage?: string;
}

interface RevealableTileProps {
  tile: TileData;
  style?: 'click' | 'swipe';
  onReveal?: (tile: TileData) => void;
  onInteraction?: (tile: TileData, data: any) => void;
}

const RevealableTile: React.FC<RevealableTileProps> = ({
  tile,
  style = 'click',
  onReveal,
  onInteraction,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [colorButtonRevealed, setColorButtonRevealed] = useState<
    'good' | 'bad' | null
  >(null);
  const [shakeAnimation, setShakeAnimation] = useState(false);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shakeAnimationValue = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const getColorScheme = () => {
    // For unrevealed tiles, show uniform purple color
    if (!isRevealed) {
      return {
        primary: '#6B73FF', // Purple color from screenshot
        secondary: '#8B93FF',
        background: '#F0F1FF',
        text: '#FFFFFF',
      };
    }

    // For revealed tiles, show the original color scheme
    switch (tile.type) {
      case 'good':
        return {
          primary: '#4CAF50',
          secondary: '#81C784',
          background: '#E8F5E8',
          text: '#2E7D32',
        };
      case 'bad':
        return {
          primary: '#F44336',
          secondary: '#EF5350',
          background: '#FFEBEE',
          text: '#C62828',
        };
      default:
        return {
          primary: '#2196F3',
          secondary: '#64B5F6',
          background: '#E3F2FD',
          text: '#1976D2',
        };
    }
  };

  const colors = getColorScheme();

  // Sound effect simulation
  const playSoundEffect = (type: 'good' | 'bad' | 'neutral' | 'click') => {
    switch (type) {
      case 'good':
        console.log('🔊 Playing success sound: *ding*');
        break;
      case 'bad':
        console.log('🔊 Playing error sound: *buzz*');
        break;
      case 'click':
        console.log('🔊 Playing click sound: *tap*');
        break;
      default:
        console.log('🔊 Playing neutral sound: *pop*');
    }
  };

  // Enhanced animations
  const triggerAnimation = (type: string) => {
    switch (type) {
      case 'bounce':
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1.1,
            useNativeDriver: true,
            tension: 300,
            friction: 5,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 8,
          }),
        ]).start();
        break;
      case 'shake':
        setShakeAnimation(true);
        Animated.sequence([
          Animated.timing(shakeAnimationValue, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimationValue, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimationValue, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimationValue, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start(() => setShakeAnimation(false));
        break;
      case 'pulse':
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnimation, {
              toValue: 1.05,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnimation, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ).start();
        break;
    }
  };

  const handleReveal = () => {
    if (style === 'click') {
      // Play click sound
      playSoundEffect('click');

      // Handle repeat click requirement
      if (tile.requiresRepeatClick && !isRevealed) {
        const newClickCount = clickCount + 1;
        setClickCount(newClickCount);

        const maxClicks = tile.maxClicks || 3;
        if (newClickCount < maxClicks) {
          // Trigger shake animation and show message
          triggerAnimation('shake');
          console.log(`Click ${newClickCount}/${maxClicks} - Keep clicking!`);
          return;
        }
      }

      setIsRevealed(!isRevealed);

      // Trigger specific animation based on tile type
      if (tile.animationType) {
        triggerAnimation(tile.animationType);
      } else {
        // Default flip animation
        Animated.spring(flipAnimation, {
          toValue: isRevealed ? 0 : 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }

      // Play sound based on tile type when revealing
      if (!isRevealed) {
        playSoundEffect(tile.soundEffect || tile.type);
        onReveal?.(tile);
      }
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = width * 0.3;

      if (Math.abs(gestureState.dx) > threshold) {
        // Reveal content
        setIsRevealed(true);

        Animated.parallel([
          Animated.spring(translateX, {
            toValue: gestureState.dx > 0 ? width * 0.7 : -width * 0.7,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.spring(flipAnimation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
        ]).start();

        onReveal?.(tile);
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }
    },
  });

  const flipInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const handleCheckboxToggle = (index: number) => {
    const newSelection = [...selectedCheckboxes];
    newSelection[index] = !newSelection[index];
    setSelectedCheckboxes(newSelection);
  };

  const handleRadioSelect = (index: number) => {
    setSelectedRadio(index);
    if (tile.correctAnswer !== undefined) {
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleSubmit = () => {
    const data = {
      input: userInput,
      checkboxes: selectedCheckboxes,
      radio: selectedRadio,
      colorButtonRevealed,
    };
    onInteraction?.(tile, data);
  };

  const handleColorButtonPress = (type: 'good' | 'bad') => {
    setColorButtonRevealed(type);
    playSoundEffect(type);
    triggerAnimation(type === 'good' ? 'bounce' : 'shake');

    // Show appropriate feedback
    setTimeout(() => {
      console.log(
        `${type === 'good' ? '🎉' : '😞'} You revealed: ${
          type === 'good' ? 'Something positive!' : 'Something to work on!'
        }`,
      );
    }, 300);
  };

  const renderInteractiveContent = () => {
    return (
      <View style={styles.interactiveContainer}>
        {tile.requiresInput && (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Share your thoughts:
            </Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.primary }]}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Enter your response..."
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {tile.hasColorButtons && (
          <View style={styles.colorButtonSection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Choose to reveal:
            </Text>
            <View style={styles.colorButtonContainer}>
              <TouchableOpacity
                style={[styles.colorButton, styles.goodButton]}
                onPress={() => handleColorButtonPress('good')}
              >
                <Icon name="happy-outline" size={24} color="#FFFFFF" />
                <Text style={styles.colorButtonText}>Good News</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.colorButton, styles.badButton]}
                onPress={() => handleColorButtonPress('bad')}
              >
                <Icon name="sad-outline" size={24} color="#FFFFFF" />
                <Text style={styles.colorButtonText}>Challenge</Text>
              </TouchableOpacity>
            </View>

            {colorButtonRevealed && (
              <View
                style={[
                  styles.colorRevealContainer,
                  colorButtonRevealed === 'good'
                    ? styles.goodReveal
                    : styles.badReveal,
                ]}
              >
                <Text
                  style={[
                    styles.colorRevealText,
                    colorButtonRevealed === 'good'
                      ? styles.goodRevealText
                      : styles.badRevealText,
                  ]}
                >
                  {colorButtonRevealed === 'good'
                    ? "🎉 Great job! You're making positive progress!"
                    : '💪 This is an area to focus on. You can improve!'}
                </Text>
              </View>
            )}
          </View>
        )}

        {tile.hasCheckboxes && tile.options && (
          <View style={styles.checkboxSection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Select all that apply:
            </Text>
            {tile.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxRow}
                onPress={() => handleCheckboxToggle(index)}
              >
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: colors.primary },
                    selectedCheckboxes[index] && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  {selectedCheckboxes[index] && (
                    <Icon name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tile.hasRadio && tile.options && (
          <View style={styles.radioSection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Choose one:
            </Text>
            {tile.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.radioRow}
                onPress={() => handleRadioSelect(index)}
              >
                <View
                  style={[
                    styles.radioButton,
                    { borderColor: colors.primary },
                    selectedRadio === index && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  {selectedRadio === index && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            {showFeedback && tile.correctAnswer !== undefined && (
              <View
                style={[
                  styles.feedbackContainer,
                  selectedRadio === tile.correctAnswer
                    ? { backgroundColor: colors.background }
                    : styles.feedbackContainerError,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    selectedRadio === tile.correctAnswer
                      ? { color: colors.primary }
                      : styles.feedbackTextError,
                  ]}
                >
                  {selectedRadio === tile.correctAnswer
                    ? '✅ Correct!'
                    : '❌ Try again!'}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { borderColor: colors.primary }]}
            onPress={() => {
              setIsRevealed(false);
              setClickCount(0);
              setColorButtonRevealed(null);
            }}
          >
            <Text style={[styles.resetButtonText, { color: colors.primary }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const gestureProps = style === 'swipe' ? panResponder.panHandlers : {};

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.tileWrapper, { transform: [{ scale }] }]}
        {...gestureProps}
      >
        {/* Front of tile */}
        <Animated.View
          style={[
            styles.tile,
            { backgroundColor: colors.primary },
            {
              opacity: frontOpacity,
              transform: [
                { rotateY: flipInterpolate },
                { translateX },
                { translateX: shakeAnimation ? shakeAnimationValue : 0 },
                { scale: tile.animationType === 'pulse' ? pulseAnimation : 1 },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.tileContent}
            onPress={handleReveal}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Icon name="help-circle-outline" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.tileTitle}>Tap to Reveal</Text>

            {tile.requiresRepeatClick &&
              clickCount > 0 &&
              clickCount < (tile.maxClicks || 3) && (
                <View style={styles.repeatClickContainer}>
                  <Text style={styles.repeatClickText}>
                    Click {clickCount}/{tile.maxClicks || 3} - Keep clicking!
                  </Text>
                </View>
              )}

            <View style={styles.hintContainer}>
              <Icon
                name={
                  style === 'click'
                    ? 'hand-left-outline'
                    : 'swap-horizontal-outline'
                }
                size={16}
                color="#FFFFFF80"
              />
              <Text style={styles.hintText}>
                {style === 'click' ? 'Tap to reveal' : 'Swipe to reveal'}
                {tile.requiresRepeatClick &&
                  clickCount === 0 &&
                  ` (${tile.maxClicks || 3} times)`}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Back of tile */}
        <Animated.View
          style={[
            styles.tile,
            styles.backTile,
            { backgroundColor: colors.background },
            {
              opacity: backOpacity,
              transform: [{ rotateY: flipInterpolate }, { translateX }],
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.revealedContent}>
              <Text style={[styles.revealedTitle, { color: colors.text }]}>
                {tile.title}
              </Text>
              <Text style={[styles.revealedText, { color: colors.text }]}>
                {tile.hiddenContent || tile.content}
              </Text>

              {tile.description && (
                <Text style={[styles.description, { color: colors.text }]}>
                  {tile.description}
                </Text>
              )}

              {(tile.requiresInput || tile.hasCheckboxes || tile.hasRadio) &&
                renderInteractiveContent()}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Sample data for different tile types
export const sampleTileData: TileData[] = [
  {
    id: '1',
    title: 'Daily Meditation',
    content: 'Practice mindfulness',
    type: 'good',
    hiddenContent:
      "Congratulations! You've maintained a 7-day meditation streak! 🧘‍♀️",
    description: 'Meditation helps reduce stress and improve focus.',
    animationType: 'bounce',
    soundEffect: 'good',
  },
  {
    id: '2',
    title: 'Skipped Workout',
    content: 'Missed exercise today',
    type: 'bad',
    hiddenContent:
      "Don't worry! Tomorrow is a new opportunity to get back on track. 💪",
    description: 'Regular exercise boosts mood and energy levels.',
    animationType: 'shake',
    soundEffect: 'bad',
  },
  {
    id: '3',
    title: 'Reflection Time',
    content: 'Daily thoughts',
    type: 'neutral',
    hiddenContent: 'Share your thoughts about today',
    requiresInput: true,
    description: 'Take a moment to reflect on your day.',
    animationType: 'pulse',
  },
  {
    id: '4',
    title: 'Wellness Check',
    content: 'How are you feeling?',
    type: 'neutral',
    hiddenContent: 'Select your current wellness areas',
    hasCheckboxes: true,
    options: [
      'Physical Health',
      'Mental Health',
      'Social Connections',
      'Sleep Quality',
    ],
    description: 'Regular check-ins help track your overall wellness.',
    animationType: 'bounce',
  },
  {
    id: '5',
    title: 'Nutrition Quiz',
    content: 'Test your knowledge',
    type: 'neutral',
    hiddenContent: 'Which is the healthiest breakfast option?',
    hasRadio: true,
    options: ['Sugary cereal', 'Oatmeal with fruits', 'Donuts', 'Energy drink'],
    correctAnswer: 1,
    description: 'Learn about healthy eating habits.',
    animationType: 'flip',
    soundEffect: 'neutral',
  },
  {
    id: '6',
    title: 'Power Click',
    content: 'Keep clicking!',
    type: 'good',
    hiddenContent: 'Amazing! You completed the power click challenge! 🎉',
    description: 'Click multiple times to unlock the reward.',
    requiresRepeatClick: true,
    clickCount: 0,
    maxClicks: 3,
    animationType: 'pulse',
    soundEffect: 'good',
  },
];

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  tileWrapper: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  tileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#FFFFFF80',
    marginLeft: 4,
  },
  revealedContent: {
    flex: 1,
  },
  revealedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  revealedText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  interactiveContainer: {
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  checkboxSection: {
    marginBottom: 16,
  },
  radioSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  feedbackContainer: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  feedbackContainerError: {
    backgroundColor: '#FFEBEE',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackTextError: {
    color: '#F44336',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  repeatClickContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 8,
  },
  repeatClickText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  colorButtonSection: {
    marginBottom: 16,
  },
  colorButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },
  goodButton: {
    backgroundColor: '#4CAF50',
  },
  badButton: {
    backgroundColor: '#F44336',
  },
  colorButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  colorRevealContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  goodReveal: {
    backgroundColor: '#E8F5E8',
  },
  badReveal: {
    backgroundColor: '#FFEBEE',
  },
  colorRevealText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  goodRevealText: {
    color: '#2E7D32',
  },
  badRevealText: {
    color: '#C62828',
  },
});

export default RevealableTile;
