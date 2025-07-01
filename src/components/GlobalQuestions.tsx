import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const GlobalQuesitions = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
        <Icon name="close" size={16} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.text}>Today's number of steps taken?</Text>
    </View>
  );
};

export default GlobalQuesitions;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(255, 135, 0, 0.9)", // Using your brand color with opacity
    borderRadius: 10,
    position: "relative",
    elevation: 3, // for Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#00000050",
    borderRadius: 12,
    padding: 4,
  },
});
