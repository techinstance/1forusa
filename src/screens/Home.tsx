import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import SliderComponent from '../components/elements/SliderComponent';
import Scroll from '../components/elements/Scroll';
import TextBoxComponent from '../components/elements/TextBoxComponent';
import TileGrid from '../components/elements/TileGrid';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: HomeProps) => {
  const components = [SliderComponent, Scroll, TextBoxComponent, TileGrid];
  const [currentIndex, setCurrentIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          setCurrentIndex(
            prev => (prev - 1 + components.length) % components.length,
          );
        } else if (gestureState.dx < -50) {
          setCurrentIndex(prev => (prev + 1) % components.length);
        }
      },
    }),
  ).current;

  const CurrentComponent = components[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.mainscreen} {...panResponder.panHandlers}>
        <CurrentComponent navigation={navigation} />
      </View>

      {/* Floating Button to Navigate to TileGrid */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('TileGrid')}
      >
        <Text style={styles.floatingButtonText}>🎯</Text>
      </TouchableOpacity>
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
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 24,
  },
});
