import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import Footer from '../components/Footer';
import GlobalQuesitions from '../components/GlobalQuestions';
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
    <SafeAreaView style={styles.container}>
      <GlobalQuesitions />
      <View style={styles.mainscreen} {...panResponder.panHandlers}>
        <CurrentComponent navigation={navigation} />
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F7F9FA',
  },
  mainscreen: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
});
