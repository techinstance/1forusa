import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface FABAction {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  mainIcon?: string;
  mainColor?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'large';
  onPress?: () => void; // For backward compatibility
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [],
  mainIcon = 'add-outline',
  mainColor = '#1DA1F2',
  position = 'bottom-right',
  size = 'large',
  onPress, // For simple FAB without actions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (onPress && actions.length === 0) {
      onPress();
      return;
    }

    const toValue = isOpen ? 0 : 1;

    Animated.parallel([
      Animated.spring(animation, {
        toValue,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  const getPositionStyle = () => {
    const offset = 20;
    switch (position) {
      case 'bottom-left':
        return { bottom: offset + 90, left: offset }; // Account for footer
      case 'top-right':
        return { top: offset + 50, right: offset };
      case 'top-left':
        return { top: offset + 50, left: offset };
      default:
        return { bottom: offset + 90, right: offset }; // Account for footer
    }
  };

  const mainButtonSize = size === 'large' ? 60 : 48;
  const actionButtonSize = size === 'large' ? 48 : 40;

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.container, getPositionStyle()]}>
      {/* Action Buttons */}
      {actions.map((action, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [
            0,
            position.includes('bottom') ? -(70 + index * 60) : 70 + index * 60,
          ],
        });

        const opacity = animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.5, 1],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.actionButton,
              {
                width: actionButtonSize,
                height: actionButtonSize,
                borderRadius: actionButtonSize / 2,
                backgroundColor: action.color || '#FFFFFF',
                transform: [{ translateY }, { scale }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionTouchable}
              onPress={() => {
                action.onPress();
                toggleMenu();
              }}
              activeOpacity={0.8}
            >
              <Icon
                name={action.icon}
                size={size === 'large' ? 24 : 20}
                color={action.color ? '#FFFFFF' : '#333'}
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Main Button */}
      <TouchableOpacity
        style={[
          styles.mainButton,
          {
            width: mainButtonSize,
            height: mainButtonSize,
            borderRadius: mainButtonSize / 2,
            backgroundColor: mainColor,
          },
        ]}
        onPress={toggleMenu}
        activeOpacity={0.8}
        accessibilityLabel="Floating action button"
      >
        {actions.length > 0 ? (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon
              name={mainIcon}
              size={size === 'large' ? 28 : 24}
              color="#FFFFFF"
            />
          </Animated.View>
        ) : (
          <Icon
            name={mainIcon}
            size={size === 'large' ? 28 : 24}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>

      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

// Example usage with wellness actions
export const wellnessActions: FABAction[] = [
  {
    icon: 'timer-outline',
    label: 'Start Timer',
    onPress: () => console.log('Timer started'),
    color: '#4CAF50',
  },
  {
    icon: 'heart-outline',
    label: 'Log Mood',
    onPress: () => console.log('Mood logged'),
    color: '#E91E63',
  },
  {
    icon: 'water-outline',
    label: 'Track Water',
    onPress: () => console.log('Water tracked'),
    color: '#2196F3',
  },
  {
    icon: 'book-outline',
    label: 'Add Note',
    onPress: () => console.log('Note added'),
    color: '#FF9800',
  },
];

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: -height,
    left: -width,
    width: width * 2,
    height: height * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  mainButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 10,
  },
  actionButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingActionButton;
