import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Slider, { MarkerProps } from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { width } = Dimensions.get('window');
import img1 from "../../img/img1.png";
import img2 from "../../img/img2.png";
import img3 from "../../img/img3.png";
import img4 from "../../img/img4.png";
import img5 from "../../img/img5.png";
import img6 from "../../img/img6.png";



type content = {
  data : string,
  color : string,
  img : File,
}

const SliderComponent = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);

 const contents = [
  {
    data: "Living paycheck to paycheck? It's tough, but you're not alone.",
    color: 'gray',
    img: img1
  },
  {
    data: "Debt feels heavy, but facing it is the first step.",
    color: 'darkred',
    img: img2
  },
  {
    data: "You're starting to track your spending — awareness is power.",
    color: 'orange',
    img: img3
  },
  {
    data: "You're budgeting and saving — great discipline!",
    color: 'yellowgreen',
    img: img4
  },
  {
    data: "You're investing wisely and building security.",
    color: 'green',
    img: img5
  },
  {
    data: "Financial freedom is in sight — you're in control now.",
    color: 'gold',
    img: img6
  }
];

  const [currentContent, setCurrentContent] = useState<content>(contents[0]);

  useEffect(() => {
    const newIndex = Math.min(Math.floor(sliderValue * (contents.length - 1)), contents.length - 1);
    setContentIndex(newIndex);
    setCurrentContent(contents[newIndex]);
    console.log(currentContent.img);
  }, [sliderValue]);

  const handleLoop = () => {
    setSliderValue(0);
    setContentIndex(0);
    setCurrentContent(contents[0]);
  };

  const renderStepMarker = useCallback(({ stepMarked }: MarkerProps) => {
    return stepMarked ? (
      <View style={styles.outerTrue}>
      </View>
    ) : (
      <View style={styles.outer}>
      </View>
    );
  }, []);

  if(!currentContent){
    return <Text>Loading...</Text>
  }

  return (
    
    <View style={styles.container}>
      <View style={styles.contentBox}>
        
        <Image source={currentContent.img}  style={{width : "100%",height : "80%" }} />
        <Text style={{ color: "white", margin :4 ,textAlign : "center",fontSize : 18 } }>
          {currentContent.data}
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
        thumbTintColor="#FE9900"
        step={1 / (contents.length - 1)}
        StepMarker={renderStepMarker}
      />
      <TouchableOpacity style={styles.button} onPress={handleLoop}>
        <MaterialCommunityIcons name="restore" color="#000" size={24} />
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
    height: "70%",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'black',
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
    width: 160,
    // transform: [{ rotate: '-90deg' }],
    transform: [{ scale: 2 }],
    marginVertical: 20,

  },
  button: {
    marginTop: 20,
    borderRadius: 5,
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
