import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Switch, Card } from 'react-native-paper';

const { width } = Dimensions.get('window');

const ActivitiesScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Activity data states
  const [dailyGoal, setDailyGoal] = useState('');
  const [howToAchieve, setHowToAchieve] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [yesterdayDone, setYesterdayDone] = useState('');
  const [oneMinActivity, setOneMinActivity] = useState('');
  const [fiveMinActivity, setFiveMinActivity] = useState('');
  const [weeklyGoals, setWeeklyGoals] = useState(['', '', '']);
  const [notToDo, setNotToDo] = useState(['', '', '']);
  const [completed, setCompleted] = useState(['', '', '', '', '']);
  const [requests, setRequests] = useState(['', '', '', '', '']);
  const [deepQuestion, setDeepQuestion] = useState('');

  // Timer states
  const [oneMinTimer, setOneMinTimer] = useState(0);
  const [fiveMinTimer, setFiveMinTimer] = useState(0);
  const [oneMinActive, setOneMinActive] = useState(false);
  const [fiveMinActive, setFiveMinActive] = useState(false);
  const oneMinInterval = useRef<NodeJS.Timeout | null>(null);
  const fiveMinInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer functions
  const startOneMinTimer = () => {
    if (oneMinActivity.trim() === '') {
      Alert.alert(
        'Please enter a task',
        'You need to enter a task before starting the timer.',
      );
      return;
    }

    setOneMinTimer(60);
    setOneMinActive(true);

    oneMinInterval.current = setInterval(() => {
      setOneMinTimer(prev => {
        if (prev <= 1) {
          setOneMinActive(false);
          if (oneMinInterval.current) {
            clearInterval(oneMinInterval.current);
          }
          Alert.alert("Time's Up!", '1-minute activity completed! 🎉');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFiveMinTimer = () => {
    if (fiveMinActivity.trim() === '') {
      Alert.alert(
        'Please enter an activity',
        'You need to enter an activity before starting the timer.',
      );
      return;
    }

    setFiveMinTimer(300);
    setFiveMinActive(true);

    fiveMinInterval.current = setInterval(() => {
      setFiveMinTimer(prev => {
        if (prev <= 1) {
          setFiveMinActive(false);
          if (fiveMinInterval.current) {
            clearInterval(fiveMinInterval.current);
          }
          Alert.alert("Time's Up!", '5-minute activity completed! 🎉');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopOneMinTimer = () => {
    setOneMinActive(false);
    setOneMinTimer(0);
    if (oneMinInterval.current) {
      clearInterval(oneMinInterval.current);
    }
  };

  const stopFiveMinTimer = () => {
    setFiveMinActive(false);
    setFiveMinTimer(0);
    if (fiveMinInterval.current) {
      clearInterval(fiveMinInterval.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (oneMinInterval.current) {
        clearInterval(oneMinInterval.current);
      }
      if (fiveMinInterval.current) {
        clearInterval(fiveMinInterval.current);
      }
    };
  }, []);

  const renderListInputs = (
    label: string,
    items: string[],
    setItems: (items: string[]) => void,
  ) =>
    items.map((val, i) => (
      <TextInput
        key={i}
        label={`${label} #${i + 1}`}
        value={val}
        onChangeText={text => {
          const updated = [...items];
          updated[i] = text;
          setItems(updated);
        }}
        mode="outlined"
        style={styles.input}
      />
    ));

  // Activity cards data
  const activityCards = [
    {
      id: '1',
      title: "🎯 Today's Goal",
      content: (
        <>
          <TextInput
            label="What is your goal today?"
            value={dailyGoal}
            onChangeText={setDailyGoal}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="How will you achieve it?"
            value={howToAchieve}
            onChangeText={setHowToAchieve}
            mode="outlined"
            multiline
            style={styles.input}
          />
          <View style={styles.switchRow}>
            <Text>Set as Public</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
        </>
      ),
    },
    {
      id: '2',
      title: "✅ Yesterday's Review",
      content: (
        <TextInput
          label="How did it go?"
          value={yesterdayDone}
          onChangeText={setYesterdayDone}
          mode="outlined"
          style={styles.input}
        />
      ),
    },
    {
      id: '3',
      title: '⚡ 1-Minute Focus',
      content: (
        <>
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
              buttonColor={oneMinActive ? '#FF3B30' : undefined}
            >
              {oneMinActive ? 'Stop Timer' : 'Start 1-Min Timer'}
            </Button>
          </View>
        </>
      ),
    },
    {
      id: '4',
      title: '⏱️ 5-Minute Activity',
      content: (
        <>
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
              buttonColor={fiveMinActive ? '#FF3B30' : undefined}
            >
              {fiveMinActive ? 'Stop Timer' : 'Start 5-Min Timer'}
            </Button>
          </View>
        </>
      ),
    },
    {
      id: '5',
      title: '📅 Weekly Goals',
      content: renderListInputs('Weekly Goal', weeklyGoals, setWeeklyGoals),
    },
    {
      id: '6',
      title: '🚫 Not-To-Do List',
      content: renderListInputs('Avoid', notToDo, setNotToDo),
    },
    {
      id: '7',
      title: '💬 Deep Personal Sharing',
      content: (
        <TextInput
          label="Something to share..."
          value={deepQuestion}
          onChangeText={setDeepQuestion}
          mode="outlined"
          multiline
          style={styles.input}
        />
      ),
    },
    {
      id: '8',
      title: '🏆 What I Completed Today',
      content: (
        <>
          {renderListInputs('Completed', completed, setCompleted)}
          <Button icon="paperclip" mode="text">
            Attach
          </Button>
        </>
      ),
    },
    {
      id: '9',
      title: '❓ My Requests & Questions',
      content: (
        <>
          {renderListInputs('Request', requests, setRequests)}
          <Button icon="paperclip" mode="text">
            Attach
          </Button>
        </>
      ),
    },
    {
      id: '10',
      title: '📊 Dashboard Snapshot',
      content: (
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
                  <Text style={styles.progressEmoji}>⏱️</Text>
                </View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>5-Min Activity</Text>
                  <Text style={styles.progressStatus}>
                    {fiveMinActivity ? '✅ Set' : '⏳ Not Set'}
                  </Text>
                </View>
              </View>

              <View style={styles.progressItem}>
                <View style={styles.progressIcon}>
                  <Text style={styles.progressEmoji}>📅</Text>
                </View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>Weekly Goals</Text>
                  <Text style={styles.progressStatus}>
                    {weeklyGoals.filter(g => g).length}/3 Complete
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.completionBar}>
              <Text style={styles.completionText}>Overall Progress</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        ((dailyGoal ? 1 : 0) +
                          (oneMinActivity ? 1 : 0) +
                          (fiveMinActivity ? 1 : 0) +
                          weeklyGoals.filter(g => g).length / 3) *
                        25
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {Math.round(
                  ((dailyGoal ? 1 : 0) +
                    (oneMinActivity ? 1 : 0) +
                    (fiveMinActivity ? 1 : 0) +
                    weeklyGoals.filter(g => g).length / 3) *
                    25,
                )}
                %
              </Text>
            </View>
          </View>
        </View>
      ),
    },
  ];

  const goToSlide = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const goToNext = () => {
    if (currentIndex < activityCards.length - 1) {
      goToSlide(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const renderActivityCard = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.cardContainer, { transform: [{ scale }], opacity }]}
      >
        <Card style={styles.activityCard}>
          <Card.Title title={item.title} titleStyle={styles.cardTitle} />
          <Card.Content>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.cardContent}
            >
              {item.content}
            </ScrollView>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  const renderDot = (index: number) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotSize = scrollX.interpolate({
      inputRange,
      outputRange: [8, 12, 8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const backgroundColor = scrollX.interpolate({
      inputRange,
      outputRange: ['#C7C7CC', '#007AFF', '#C7C7CC'],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              opacity,
              backgroundColor,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Daily Goal Tracker
      </Text>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={activityCards}
        renderItem={renderActivityCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(newIndex);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
      />

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {activityCards.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingTop: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonDisabled: {
    backgroundColor: '#C7C7CC',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  cardContainer: {
    width,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 3.2,
    shadowRadius: 30,
    elevation: 15,
    minHeight: 550,
    maxHeight: 580,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
    width: width - 50,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardContent: {
    maxHeight: 450,
    paddingHorizontal: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  button: {
    marginTop: 15,
    borderRadius: 15,
    elevation: 3,
  },
  buttonRow: {
    marginTop: 15,
  },
  activeButton: {
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  timerContainer: {
    backgroundColor: 'linear-gradient(135deg, #E3F2FD 0%, #F0F8FF 100%)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 3,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 122, 255, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timerLabel: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  dashboard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E3F2FD',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  dashboardWrapper: {
    marginHorizontal: -5,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  progressGrid: {
    marginBottom: 24,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FBFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  progressEmoji: {
    fontSize: 24,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  progressStatus: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  completionBar: {
    marginTop: 8,
  },
  completionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #007AFF 0%, #40A9FF 100%)',
    borderRadius: 5,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  dot: {
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
