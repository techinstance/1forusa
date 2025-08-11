import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

interface Activity {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface ListItem {
  id: string;
  text: string;
}

const Activities: React.FC = () => {
  // State variables
  const [dailyGoal, setDailyGoal] = useState('');
  const [yesterdayDone, setYesterdayDone] = useState('');
  const [oneMinActivity, setOneMinActivity] = useState('');
  const [fiveMinActivity, setFiveMinActivity] = useState('');
  const [freeWrite, setFreeWrite] = useState('');
  const [deepQuestion, setDeepQuestion] = useState('');
  const [completed, setCompleted] = useState<ListItem[]>([
    { id: '1', text: '' },
  ]);
  const [requests, setRequests] = useState<ListItem[]>([{ id: '1', text: '' }]);

  // Timer states
  const [oneMinTimer, setOneMinTimer] = useState(60);
  const [fiveMinTimer, setFiveMinTimer] = useState(300);
  const [oneMinActive, setOneMinActive] = useState(false);
  const [fiveMinActive, setFiveMinActive] = useState(false);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (oneMinActive && oneMinTimer > 0) {
      interval = setInterval(() => {
        setOneMinTimer(time => time - 1);
      }, 1000);
    } else if (oneMinActive && oneMinTimer === 0) {
      setOneMinActive(false);
      Alert.alert("Time's up!", 'Your 1-minute activity is complete!');
      setOneMinTimer(60);
    }
    return () => clearInterval(interval);
  }, [oneMinActive, oneMinTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (fiveMinActive && fiveMinTimer > 0) {
      interval = setInterval(() => {
        setFiveMinTimer(time => time - 1);
      }, 1000);
    } else if (fiveMinActive && fiveMinTimer === 0) {
      setFiveMinActive(false);
      Alert.alert("Time's up!", 'Your 5-minute activity is complete!');
      setFiveMinTimer(300);
    }
    return () => clearInterval(interval);
  }, [fiveMinActive, fiveMinTimer]);

  // Timer controls
  const startOneMinTimer = () => {
    if (oneMinActivity.trim()) {
      setOneMinActive(true);
    } else {
      Alert.alert('Please enter a task first!');
    }
  };

  const stopOneMinTimer = () => {
    setOneMinActive(false);
    setOneMinTimer(60);
  };

  const startFiveMinTimer = () => {
    if (fiveMinActivity.trim()) {
      setFiveMinActive(true);
    } else {
      Alert.alert('Please enter an activity first!');
    }
  };

  const stopFiveMinTimer = () => {
    setFiveMinActive(false);
    setFiveMinTimer(300);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // List input helpers
  const renderListInputs = (
    placeholder: string,
    items: ListItem[],
    setItems: React.Dispatch<React.SetStateAction<ListItem[]>>,
  ) => {
    const updateItem = (id: string, text: string) => {
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, text } : item)),
      );

      // Add new item if current is being filled and it's the last one
      const currentIndex = items.findIndex(item => item.id === id);
      if (text.trim() && currentIndex === items.length - 1) {
        setItems(prev => [...prev, { id: Date.now().toString(), text: '' }]);
      }
    };

    const removeItem = (id: string) => {
      if (items.length > 1) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    };

    return (
      <View>
        {items.map((item, index) => (
          <View key={item.id} style={styles.listItemContainer}>
            <TextInput
              label={`${placeholder} ${index + 1}`}
              value={item.text}
              onChangeText={text => updateItem(item.id, text)}
              mode="outlined"
              style={[styles.input, styles.listInput]}
            />
            {items.length > 1 && (
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

  const activities: Activity[] = [
    {
      id: '1',
      title: '🎯 My Daily Goal',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img1.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <TextInput
            label="What's your main goal today?"
            value={dailyGoal}
            onChangeText={setDailyGoal}
            mode="outlined"
            style={styles.input}
          />
        </React.Fragment>
      ),
    },
    {
      id: '2',
      title: '✨ What I Did Yesterday',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img2.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <TextInput
            label="Yesterday's accomplishment"
            value={yesterdayDone}
            onChangeText={setYesterdayDone}
            mode="outlined"
            style={styles.input}
          />
        </React.Fragment>
      ),
    },
    {
      id: '3',
      title: '⚡ 1-Minute Focus',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img3.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <TextInput
            label="Quick task"
            value={oneMinActivity}
            onChangeText={setOneMinActivity}
            mode="outlined"
            style={styles.input}
          />
          {oneMinActive && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(oneMinTimer)}</Text>
              <Text style={styles.timerLabel}>Time Remaining</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            <Button
              icon={oneMinActive ? 'stop' : 'timer-outline'}
              mode={oneMinActive ? 'contained' : 'outlined'}
              style={[styles.button, oneMinActive && styles.activeButton]}
              onPress={oneMinActive ? stopOneMinTimer : startOneMinTimer}
            >
              {oneMinActive ? 'Stop' : 'Start 1-Minute'}
            </Button>
          </View>
        </React.Fragment>
      ),
    },
    {
      id: '4',
      title: '🕐 5-Minute Focus',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img4.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <TextInput
            label="Short activity"
            value={fiveMinActivity}
            onChangeText={setFiveMinActivity}
            mode="outlined"
            style={styles.input}
          />
          {fiveMinActive && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(fiveMinTimer)}</Text>
              <Text style={styles.timerLabel}>Time Remaining</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            <Button
              icon={fiveMinActive ? 'stop' : 'clock-outline'}
              mode={fiveMinActive ? 'contained' : 'outlined'}
              style={[styles.button, fiveMinActive && styles.activeButton]}
              onPress={fiveMinActive ? stopFiveMinTimer : startFiveMinTimer}
            >
              {fiveMinActive ? 'Stop' : 'Start 5-Minute'}
            </Button>
          </View>
        </React.Fragment>
      ),
    },
    {
      id: '5',
      title: '📝 Free Writing',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img5.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <TextInput
            label="Free write anything..."
            value={freeWrite}
            onChangeText={setFreeWrite}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        </React.Fragment>
      ),
    },
    {
      id: '6',
      title: '🤔 Deep Question',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img6.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <TextInput
            label="Something to share..."
            value={deepQuestion}
            onChangeText={setDeepQuestion}
            mode="outlined"
            multiline
            style={styles.input}
          />
        </React.Fragment>
      ),
    },
    {
      id: '7',
      title: '🏆 What I Completed Today',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img7.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          {renderListInputs('Completed', completed, setCompleted)}
          <Button icon="paperclip" mode="text">
            Attach
          </Button>
        </React.Fragment>
      ),
    },
    {
      id: '8',
      title: '❓ My Requests & Questions',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img8.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          {renderListInputs('Request', requests, setRequests)}
          <Button icon="paperclip" mode="text">
            Attach
          </Button>
        </React.Fragment>
      ),
    },
    {
      id: '9',
      title: '📊 Dashboard Snapshot',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img9.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          <View style={styles.dashboardWrapper}>
            <View style={styles.dashboard}>
              <Text style={styles.dashboardTitle}>Progress Overview</Text>

              <View style={styles.progressGrid}>
                <View style={styles.progressItem}>
                  <View style={styles.progressIcon}>
                    <Text style={styles.progressEmoji}>🎯</Text>
                  </View>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>Daily Goal</Text>
                    <Text style={styles.progressStatus}>
                      {dailyGoal ? '✅ Completed' : '⏳ Pending'}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressItem}>
                  <View style={styles.progressIcon}>
                    <Text style={styles.progressEmoji}>⚡</Text>
                  </View>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>1-Min Focus</Text>
                    <Text style={styles.progressStatus}>
                      {oneMinActivity ? '✅ Set' : '⏳ Not Set'}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressItem}>
                  <View style={styles.progressIcon}>
                    <Text style={styles.progressEmoji}>🕐</Text>
                  </View>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>5-Min Focus</Text>
                    <Text style={styles.progressStatus}>
                      {fiveMinActivity ? '✅ Set' : '⏳ Not Set'}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressItem}>
                  <View style={styles.progressIcon}>
                    <Text style={styles.progressEmoji}>📝</Text>
                  </View>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>Free Writing</Text>
                    <Text style={styles.progressStatus}>
                      {freeWrite ? '✅ Written' : '⏳ Not Written'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Today's Summary</Text>
                <Text style={styles.summaryText}>
                  {completed.filter(item => item.text.trim()).length} tasks
                  completed
                </Text>
                <Text style={styles.summaryText}>
                  {requests.filter(item => item.text.trim()).length} requests
                  logged
                </Text>
              </View>
            </View>
          </View>
        </React.Fragment>
      ),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Activities</Text>
        <Text style={styles.subtitle}>
          Track your progress and stay focused
        </Text>
      </View>

      <View style={styles.activitiesContainer}>
        {activities.map(activity => (
          <View key={activity.id} style={styles.activityCard}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <View style={styles.activityContent}>{activity.content}</View>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  activitiesContainer: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  activityContent: {
    gap: 8,
  },
  activityImage: {
    width: 120,
    height: 110,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 12,
  },
  input: {
    marginBottom: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  button: {
    minWidth: 140,
  },
  activeButton: {
    backgroundColor: '#ff4444',
  },
  dashboardWrapper: {
    marginTop: 8,
  },
  dashboard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressGrid: {
    gap: 12,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressEmoji: {
    fontSize: 20,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  progressStatus: {
    fontSize: 12,
    color: '#666',
  },
  summarySection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 50,
  },
});

export default Activities;
