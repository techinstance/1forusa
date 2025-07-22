import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Social: undefined;
  Activites: undefined;
  Profile: undefined;
};

interface TabItem {
  name: keyof RootStackParamList;
  icon: string;
  label: string;
}

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  const tabs: TabItem[] = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Social', icon: 'users', label: 'Social' },
    { name: 'Activites', icon: 'calendar', label: 'Activities' },
    { name: 'Profile', icon: 'user', label: 'Profile' },
  ];

  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showFooter = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }, 2000);
  };

  const handleTabPress = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
    showFooter(); // Optional: re-trigger the timer
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy, moveY } = gestureState;
        const screenHeight = Dimensions.get('window').height;
        const isSwipeUp = dy < -30;
        const fromBottom = moveY > screenHeight * 0.85; // bottom 15%
        return isSwipeUp && fromBottom;
      },
      onPanResponderRelease: (_, gestureState) => {
        const isSwipeUp = gestureState.dy < -30;
        if (isSwipeUp) {
          showFooter();
        }
      },
    })
  ).current;

  return (
    <>
      {/* Swipe Detection Zone at Bottom */}
      <View style={styles.swipeZone} {...panResponder.panHandlers} />

      {/* Animated Footer */}
      {visible && (
        <Animated.View
          style={[
            styles.footer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = route.name === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => handleTabPress(tab.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabContent, isActive && styles.activeTab]}>
                  <Icon
                    name={tab.icon}
                    size={25}
                    color={isActive ? '#007AFF' : '#8E8E93'}
                    style={styles.tabIcon}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </>
  );
};

export default Footer;

const styles = StyleSheet.create({
  swipeZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // expanded for easier swipe-up detection
    zIndex: 999,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    elevation: 10,
    zIndex: 1000,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 44,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabIcon: {
    marginBottom: 4,
  },
});