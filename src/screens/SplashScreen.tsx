import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, StatusBar, Button } from 'react-native';
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import LottieAsset from '../screens/LottieView';

type SplashProps = NativeStackScreenProps<RootStackParamList , "Splash">
const Splash = ({ navigation } : SplashProps) => {
  const [timer, setTimer] = useState(60);

  // Optional: Navigate to home after 2.5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <Text style={styles.logoText}>1forusa</Text>
      <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
      {/* <Text>{`Redirecting in ${timer} seconds...`}</Text> */}
      
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 36,
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 2,
  }
});
