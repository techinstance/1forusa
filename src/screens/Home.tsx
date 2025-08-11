import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Alert,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/Ionicons';

import SliderComponent from '../components/elements/SliderComponent';
import Scroll from '../components/elements/Scroll';
import TextBoxComponent from '../components/elements/TextBoxComponent';
import TileGrid from '../components/elements/TileGrid';
import FloatingActionButton, { wellnessActions } from '../components/FloatingActionButton';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: HomeProps) => {
  const components = [SliderComponent, Scroll, TextBoxComponent, TileGrid];
  const [currentIndex, setCurrentIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // New state for variations
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [textInput, setTextInput] = useState('');
  const [checkboxStates, setCheckboxStates] = useState<{[key: string]: boolean}>({});
  const [selectedRadio, setSelectedRadio] = useState<string>('');
  const [currentVariation, setCurrentVariation] = useState<string>('');

  // Variations data
  const swipeVariations = {
    left: [
      {
        type: 'textbox',
        title: '✍️ Reflection Time',
        content: 'What are you grateful for today?',
        placeholder: 'Write your thoughts here...',
      },
      {
        type: 'checkbox',
        title: '✅ Wellness Checklist',
        content: 'Check off your wellness activities:',
        options: [
          { id: 'water', label: 'Drank 8 glasses of water' },
          { id: 'exercise', label: '30 minutes of exercise' },
          { id: 'meditation', label: '10 minutes of meditation' },
          { id: 'sleep', label: '7+ hours of sleep' },
        ]
      }
    ],
    right: [
      {
        type: 'radio',
        title: '🧠 Wellness Quiz',
        content: 'What is the most important factor for mental health?',
        options: [
          { id: 'sleep', label: 'Good sleep', isCorrect: true },
          { id: 'money', label: 'Having money', isCorrect: false },
          { id: 'social', label: 'Social media', isCorrect: false },
          { id: 'work', label: 'Working more', isCorrect: false },
        ]
      },
      {
        type: 'textbox',
        title: '🎯 Goal Setting',
        content: 'What is one small goal you want to achieve today?',
        placeholder: 'My goal for today is...',
      }
    ],
    up: [
      {
        type: 'checkbox',
        title: '🌟 Morning Routine',
        content: 'Complete your morning wellness routine:',
        options: [
          { id: 'stretch', label: 'Morning stretches' },
          { id: 'breakfast', label: 'Healthy breakfast' },
          { id: 'planning', label: 'Plan your day' },
          { id: 'mindfulness', label: 'Mindful breathing' },
        ]
      },
      {
        type: 'radio',
        title: '💡 Knowledge Check',
        content: 'How many minutes of daily exercise do experts recommend?',
        options: [
          { id: '10min', label: '10 minutes', isCorrect: false },
          { id: '30min', label: '30 minutes', isCorrect: true },
          { id: '60min', label: '60 minutes', isCorrect: false },
          { id: '120min', label: '120 minutes', isCorrect: false },
        ]
      }
    ],
    down: [
      {
        type: 'textbox',
        title: '🌙 Evening Reflection',
        content: 'How do you feel about your day?',
        placeholder: 'Today I felt...',
      },
      {
        type: 'checkbox',
        title: '🛌 Wind Down Checklist',
        content: 'Prepare for a good night sleep:',
        options: [
          { id: 'phone', label: 'Put phone away 1 hour before bed' },
          { id: 'tea', label: 'Drink herbal tea' },
          { id: 'journal', label: 'Write in journal' },
          { id: 'room', label: 'Prepare bedroom environment' },
        ]
      }
    ]
  };

  // Play sound simulation
  const playSound = (soundType: string) => {
    console.log(`🔊 Playing ${soundType} sound effect`);
    // Simulate sound with haptic feedback
    Alert.alert('🔊 Sound Effect', `Playing ${soundType} sound!`, [{ text: 'OK' }]);
  };

  const showSwipeReward = (direction: string) => {
    // Scale animation for visual feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Play sound based on direction
    const soundTypes = {
      left: 'reflection',
      right: 'achievement', 
      up: 'energy',
      down: 'calm'
    };
    playSound(soundTypes[direction.toLowerCase() as keyof typeof soundTypes] || 'default');

    // Get random variation for the direction
    const variations = swipeVariations[direction.toLowerCase() as keyof typeof swipeVariations] || [];
    if (variations.length > 0) {
      const randomVariation = variations[Math.floor(Math.random() * variations.length)];
      setModalContent(randomVariation);
      setCurrentVariation(direction);
      setShowModal(true);
      
      // Reset states for new variation
      setTextInput('');
      setCheckboxStates({});
      setSelectedRadio('');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Detect both horizontal and vertical swipes
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Horizontal swipes (left/right) - existing functionality with rewards
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > 50) {
            // Swipe right - go to previous component
            setCurrentIndex(
              prev => (prev - 1 + components.length) % components.length,
            );
            showSwipeReward("Right");
          } else if (gestureState.dx < -50) {
            // Swipe left - go to next component
            setCurrentIndex(prev => (prev + 1) % components.length);
            showSwipeReward("Left");
          }
        }
        // Vertical swipes (up/down) - new functionality with unique rewards
        else if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
          if (gestureState.dy > 50) {
            // Swipe down - cycle through components + special reward
            setCurrentIndex(
              prev => (prev - 1 + components.length) % components.length,
            );
            showSwipeReward("Down");
          } else if (gestureState.dy < -50) {
            // Swipe up - cycle through components + special reward  
            setCurrentIndex(prev => (prev + 1) % components.length);
            showSwipeReward("Up");
          }
        }
      },
    }),
  ).current;

  const CurrentComponent = components[currentIndex];

  // Handle checkbox toggle
  const toggleCheckbox = (id: string) => {
    setCheckboxStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle radio selection
  const selectRadio = (id: string) => {
    setSelectedRadio(id);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (modalContent) {
      let message = '';
      
      if (modalContent.type === 'textbox') {
        message = textInput ? `Great reflection: "${textInput}"` : 'Thanks for taking time to reflect!';
      } else if (modalContent.type === 'checkbox') {
        const completedItems = Object.keys(checkboxStates).filter(key => checkboxStates[key]);
        message = `You completed ${completedItems.length}/${modalContent.options.length} wellness activities!`;
      } else if (modalContent.type === 'radio') {
        const selectedOption = modalContent.options.find((opt: any) => opt.id === selectedRadio);
        if (selectedOption) {
          message = selectedOption.isCorrect ? 
            '🎉 Correct! You know your wellness facts!' : 
            '💭 That\'s a common thought, but the correct answer helps your mental health more!';
        }
      }

      Alert.alert('🌟 Completed!', message, [{ text: 'Awesome!' }]);
      setShowModal(false);
      setModalContent(null);
    }
  };

  // Render variation content
  const renderVariationContent = () => {
    if (!modalContent) return null;

    if (modalContent.type === 'textbox') {
      return (
        <View style={styles.variationContent}>
          <Text style={styles.variationDescription}>{modalContent.content}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={modalContent.placeholder}
            value={textInput}
            onChangeText={setTextInput}
            multiline
          />
        </View>
      );
    }

    if (modalContent.type === 'checkbox') {
      return (
        <View style={styles.variationContent}>
          <Text style={styles.variationDescription}>{modalContent.content}</Text>
          {modalContent.options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={styles.checkboxItem}
              onPress={() => toggleCheckbox(option.id)}
            >
              <Icon
                name={checkboxStates[option.id] ? 'checkbox' : 'square-outline'}
                size={24}
                color={checkboxStates[option.id] ? '#4CAF50' : '#666'}
              />
              <Text style={styles.checkboxLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (modalContent.type === 'radio') {
      return (
        <View style={styles.variationContent}>
          <Text style={styles.variationDescription}>{modalContent.content}</Text>
          {modalContent.options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={styles.radioItem}
              onPress={() => selectRadio(option.id)}
            >
              <Icon
                name={selectedRadio === option.id ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedRadio === option.id ? '#4CAF50' : '#666'}
              />
              <Text style={styles.radioLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Modal for variations */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalContent?.title}</Text>
              {renderVariationContent()}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Animated.View 
        style={[
          styles.mainscreen, 
          { transform: [{ scale: scaleAnim }] }
        ]} 
        {...panResponder.panHandlers}
      >
        <CurrentComponent navigation={navigation} />
      </Animated.View>

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton
        actions={[
          ...wellnessActions,
          {
            icon: 'grid-outline',
            label: 'Wellness Journey',
            onPress: () => navigation.navigate('TileGrid'),
            color: '#FF6B6B',
          },
        ]}
        mainIcon="apps-outline"
        mainColor="#007AFF"
        position="bottom-right"
        size="large"
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  mainscreen: {
    flex: 1,
    width: '100%',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  variationContent: {
    marginBottom: 20,
  },
  variationDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
