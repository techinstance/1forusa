import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface SwipeRevealComponentProps {
  title: string;
  hiddenContent: string;
  icon: string;
  color: string;
  onReveal?: () => void;
}

const SwipeRevealComponent: React.FC<SwipeRevealComponentProps> = ({
  title,
  hiddenContent,
  icon,
  color,
  onReveal,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (translationX > width * 0.3 && !isRevealed) {
        // Reveal content
        setIsRevealed(true);
        onReveal?.();

        Animated.parallel([
          Animated.spring(translateX, {
            toValue: width * 0.7,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
        ]).start();
      } else if (translationX < -width * 0.3 && isRevealed) {
        // Hide content
        setIsRevealed(false);

        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 0.9,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
        ]).start();
      } else {
        // Snap back to current state
        Animated.spring(translateX, {
          toValue: isRevealed ? width * 0.7 : 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }
    }
  };

  const resetCard = () => {
    setIsRevealed(false);
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Hidden Content Background */}
      <Animated.View
        style={[
          styles.hiddenContent,
          { backgroundColor: color + '20' },
          { opacity, transform: [{ scale }] },
        ]}
      >
        <Icon name="lock-open-outline" size={24} color={color} />
        <Text style={[styles.hiddenText, { color }]}>{hiddenContent}</Text>
        <TouchableOpacity onPress={resetCard} style={styles.closeButton}>
          <Icon name="close-circle-outline" size={20} color={color} />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Card */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: color },
            { transform: [{ translateX }] },
          ]}
        >
          <View style={styles.cardContent}>
            <Icon name={icon} size={32} color="#FFFFFF" />
            <Text style={styles.title}>{title}</Text>
            <View style={styles.swipeHint}>
              <Icon
                name="chevron-forward-outline"
                size={16}
                color="#FFFFFF80"
              />
              <Text style={styles.hintText}>Swipe to reveal</Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hiddenContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
  },
  hiddenText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  card: {
    height: 140,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  hintText: {
    fontSize: 12,
    color: '#FFFFFF80',
    marginLeft: 4,
  },
});

export default SwipeRevealComponent;
