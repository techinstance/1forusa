import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Switch,
  HelperText,
  Button,
} from 'react-native-paper';
import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [gender, setGender] = useState('');
  const [timezone, setTimezone] = useState('');
  const [showGenderOnly, setShowGenderOnly] = useState(false);

  // Notification toggle preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    goals: true,
    subscriptions: true,
    feeds: true,
  });

  useEffect(() => {
    if (zipcode.length === 5) calculateTimezone(zipcode);
  }, [zipcode]);

  // Save notification preferences when changed
  useEffect(() => {
    AsyncStorage.setItem(
      'notificationPrefs',
      JSON.stringify(notificationPrefs),
    );
  }, [notificationPrefs]);

  // Load notification preferences on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('notificationPrefs');
      if (saved) {
        setNotificationPrefs(JSON.parse(saved));
      }
    })();
  }, []);

  // Schedule notifications based on preferences
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

     const res = await fetch('http://10.0.2.2:5050/api/messages')
    const allowedMessages = await res.json();

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
      console.log('✅ Notifications scheduled successfully', allowedMessages);
    }

    scheduleMultipleNotifications();
  }, [notificationPrefs]);

  const calculateTimezone = (zip: string) => {
    const first = zip[0];
    const zone =
      first === '9'
        ? 'PT'
        : first === '8'
        ? 'MT'
        : first === '6' || first === '7'
        ? 'CT'
        : 'ET';
    setTimezone(`${zone} (auto detected)`);
  };

  const handleSave = () => {
    console.log({
      name,
      email,
      zipcode,
      timezone,
      gender,
      showGenderOnly,
    });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text variant="headlineMedium" style={styles.header}>
        My Profile
      </Text>

      <View style={styles.card}>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Zip Code"
          value={zipcode}
          onChangeText={setZipcode}
          keyboardType="number-pad"
          mode="outlined"
          style={styles.input}
        />

        {timezone ? (
          <HelperText type="info" visible={true}>
            Timezone: {timezone}
          </HelperText>
        ) : null}

        <TextInput
          label="Gender"
          value={gender}
          onChangeText={setGender}
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            Show questions to my gender only?
          </Text>
          <Switch value={showGenderOnly} onValueChange={setShowGenderOnly} />
        </View>

        {/* Notification Preferences */}
        <Text variant="titleMedium" style={styles.notificationHeader}>
          Notification Preferences
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Goals notifications</Text>
          <Switch
            value={notificationPrefs.goals}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, goals: value }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Subscriptions notifications</Text>
          <Switch
            value={notificationPrefs.subscriptions}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, subscriptions: value }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Feeds notifications</Text>
          <Switch
            value={notificationPrefs.feeds}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, feeds: value }))
            }
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        >
          Save Profile
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFF3EB',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    color: '#FF6B00',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  input: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  notificationHeader: {
    color: '#FF6B00',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 6,
  },
});
