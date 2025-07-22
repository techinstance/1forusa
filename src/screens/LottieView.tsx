import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieAsset = () => (
  <LottieView source={require('../assets/animation.json')} autoPlay loop style={{ width: 200, height: 200 }} />
);

export default LottieAsset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});