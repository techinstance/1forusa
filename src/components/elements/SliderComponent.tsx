import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const SliderComponent = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);
  const contents = [
    { text: "You're starting your journey to success!", type: 'static' },
    { text: "Keep pushing forward to prosperity!", type: 'dynamic' },
    { text: "You're on the path to greatness!", type: 'dynamic' },
    { text: "Success is within your reach!", type: 'dynamic' },
    { text: "Almost there, stay focused!", type: 'dynamic' },
    { 
      text: "Why go back to the start? Keep moving forward!", 
      type: 'static',
      warning: true 
    },
  ];
  const [currentContent, setCurrentContent] = useState(contents[0].text);

  useEffect(() => {
    const newIndex = Math.min(Math.floor(sliderValue * (contents.length - 1)), contents.length - 1);
    setContentIndex(newIndex);
    setCurrentContent(contents[newIndex].text);
  }, [sliderValue]);

  const handleLoop = () => {
    setSliderValue(0);
    setContentIndex(0);
    setCurrentContent(contents[0].text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={[styles.contentText, contents[contentIndex].warning && styles.warningText]}>
          {currentContent}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        value={sliderValue}
        onValueChange={setSliderValue}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#4b6cb7"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#ffffff"
        step={1 / (contents.length - 1)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLoop}>
        <Text style={styles.buttonText}>Reset Journey</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  contentBox: {
    width: width * 0.8,
    height: 300,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#4b6cb7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  contentText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'System',
  },
  warningText: {
    color: '#ffcc00',
    fontWeight: 'bold',
  },
  slider: {
    height: 200,
    width: 160,
    // transform: [{ rotate: '-90deg' }],
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default SliderComponent;
