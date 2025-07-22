import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from "react-native";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type SplashProps = NativeStackScreenProps<RootStackParamList , "Splash">
const Splash = ({ navigation } : SplashProps) => {
  // Optional: Navigate to home after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <Text style={styles.logoText}>1forusa</Text>
      <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
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
