import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App"; // Adjust path as needed

type AnimatedValues = {
  Home: Animated.Value;
  Social: Animated.Value;
  Activities: Animated.Value;
  Profile: Animated.Value;
};

const Footer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const animatedValues: AnimatedValues = {
    Home: useRef(new Animated.Value(1)).current,
    Social: useRef(new Animated.Value(1)).current,
    Activities: useRef(new Animated.Value(1)).current,
    Profile: useRef(new Animated.Value(1)).current,
  };

  const handlePressIn = (key: keyof AnimatedValues) => {
    Animated.spring(animatedValues[key], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (key: keyof AnimatedValues) => {
    Animated.spring(animatedValues[key], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderTab = (label: keyof AnimatedValues, icon: string, screen: keyof RootStackParamList) => (
    <TouchableOpacity
      style={styles.subContainer}
      onPressIn={() => handlePressIn(label)}
      onPressOut={() => handlePressOut(label)}
      onPress={() => navigation.navigate(screen)}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: animatedValues[label] }] }]}>
        <Icon name={icon} size={26} color="#ff8700" />
      </Animated.View>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderTab("Home", "home", "Home")}
      {renderTab("Social", "users", "Socail")}
      {renderTab("Activities", "tasks", "Activites")}
      {renderTab("Profile", "user", "Profile")}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    height: 82,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  subContainer: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 50,
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 20,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#ffcc80",
  },
  text: {
    color: "#ff8700",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: "System",
  },
});
