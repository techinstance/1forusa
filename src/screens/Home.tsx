import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import Footer from '../components/Footer';
import GlobalQuesitions from '../components/GlobalQuestions';
import SliderComponent from '../components/elements/SliderComponent';
import Scroll from '../components/elements/Scroll';
import TextBoxComponent from '../components/elements/TextBoxComponent';
import TileGrid from '../components/elements/TileGrid';

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
          setCurrentIndex(
            prev => (prev - 1 + components.length) % components.length,
          );
        } else if (gestureState.dx < -50) {
          setCurrentIndex(prev => (prev + 1) % components.length);
        }
      },
    }),
  ).current;

  const CurrentComponent = components[currentIndex];

  // Notification toggle preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    goals: true,
    subscriptions: true,
    feeds: true,
  });

  // Save preferences when changed
  useEffect(() => {
    AsyncStorage.setItem(
      'notificationPrefs',
      JSON.stringify(notificationPrefs),
    );
  }, [notificationPrefs]);

  // Load preferences on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('notificationPrefs');
      if (saved) {
        setNotificationPrefs(JSON.parse(saved));
      }
    })();
  }, []);

  useEffect(() => {
    async function scheduleMultipleNotifications() {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus < 1) {
        console.log('❌ Notification permission denied');
        return;
      }

      const channelId = await notifee.createChannel({
        id: 'motivation',
        name: 'Motivation',
        importance: AndroidImportance.HIGH,
      });

      const allMessages = [
        { text: 'Time to write your Goals!', category: 'goals' },
        { text: 'Avoid distractions – stay focused!', category: 'goals' },
        {
          text: 'You’ve got a new subscription tip!',
          category: 'subscriptions',
        },
        { text: 'Latest feed is now live!', category: 'feeds' },
        { text: 'A motivational boost for you!', category: 'goals' },
      ];

      const allowedMessages = allMessages.filter(
        msg => notificationPrefs[msg.category],
      );

      if (allowedMessages.length === 0) return;

      const intervals = [1, 5, 20, 30, 60]; // in minutes

      // Schedule up to 5 random notifications
      for (let i = 0; i < 5; i++) {
        const randomMsg =
          allowedMessages[Math.floor(Math.random() * allowedMessages.length)];

        const randomInterval =
          intervals[Math.floor(Math.random() * intervals.length)];

        const triggerTime = new Date(Date.now() + randomInterval * 60 * 1000);

        await notifee.createTriggerNotification(
          {
            title: '✨ Stay Motivated!',
            body: randomMsg.text,
            android: {
              channelId,
              smallIcon: 'ic_launcher',
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: triggerTime.getTime(),
          },
        );

        console.log(
          `📅 Scheduled "${randomMsg.text}" in ${randomInterval} min`,
        );
      }
    }

    scheduleMultipleNotifications();
  }, [notificationPrefs]);

  return (
    <SafeAreaView style={styles.container}>
      <GlobalQuesitions />
      {/* Toggle Switches */}
      <View style={styles.toggleWrapper}>
        {Object.entries(notificationPrefs).map(([key, value]) => (
          <View key={key} style={styles.toggleRow}>
            <Text style={styles.toggleText}>{key}</Text>
            <Switch
              value={value}
              onValueChange={newValue =>
                setNotificationPrefs(prev => ({ ...prev, [key]: newValue }))
              }
            />
          </View>
        ))}
      </View>

      <View style={styles.mainscreen} {...panResponder.panHandlers}>
        <CurrentComponent />
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F7F9FA',
  },
  mainscreen: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  toggleWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#333',
  },
});
