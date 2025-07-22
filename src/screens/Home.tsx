import { View, Text, StyleSheet, PanResponder } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footer";
import GlobalQuesitions from "../components/GlobalQuestions";
import SliderComponent from "../Pages/SliderScreeen";
import Scroll from "../components/Deshboard/Scroll";
import TextBoxComponent from "../components/Deshboard/TextBoxComponent";
import TileGrid from "../components/Deshboard/TileGrid";
import { useState, useRef } from "react";
import React from "react";
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
          // Swipe Right
          setCurrentIndex((prev) => (prev - 1 + components.length) % components.length);
        } else if (gestureState.dx < -50) {
          // Swipe Left
          setCurrentIndex((prev) => (prev + 1) % components.length);
        }
      },
    })
  ).current;

  const CurrentComponent = components[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <GlobalQuesitions />
      <View style={styles.mainscreen} {...panResponder.panHandlers}>
        <CurrentComponent />
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        position: 'relative',
        backgroundColor: '#F7F9FA',
    },
    mainscreen : {
        flex : 1,
        width : "100%",
        justifyContent : "center"
    }
});
