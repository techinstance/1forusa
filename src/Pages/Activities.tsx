import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

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
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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

  // Additional text inputs for each activity
  const [additionalInputs, setAdditionalInputs] = useState<{
    [key: string]: ListItem[];
  }>({
    '1': [{ id: '1', text: '' }],
    '2': [{ id: '1', text: '' }],
    '3': [{ id: '1', text: '' }],
    '4': [{ id: '1', text: '' }],
    '5': [{ id: '1', text: '' }],
    '6': [{ id: '1', text: '' }],
    '7': [{ id: '1', text: '' }],
    '8': [{ id: '1', text: '' }],
    '9': [{ id: '1', text: '' }],
  });

  // Feeling inputs for each activity
  const [feelings, setFeelings] = useState<{ [key: string]: string }>({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
  });

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
      const itemIndex = items.findIndex(item => item.id === id);
      if (text.trim() && itemIndex === items.length - 1) {
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

  // Additional inputs helper
  const renderAdditionalInputs = (activityId: string) => {
    const inputs = additionalInputs[activityId] || [];

    const updateAdditionalInput = (id: string, text: string) => {
      setAdditionalInputs(prev => ({
        ...prev,
        [activityId]: prev[activityId].map(item =>
          item.id === id ? { ...item, text } : item,
        ),
      }));

      // Add new input if current is being filled and it's the last one
      const itemIndex = inputs.findIndex(item => item.id === id);
      if (text.trim() && itemIndex === inputs.length - 1) {
        setAdditionalInputs(prev => ({
          ...prev,
          [activityId]: [
            ...prev[activityId],
            { id: Date.now().toString(), text: '' },
          ],
        }));
      }
    };

    const removeAdditionalInput = (id: string) => {
      if (inputs.length > 1) {
        setAdditionalInputs(prev => ({
          ...prev,
          [activityId]: prev[activityId].filter(item => item.id !== id),
        }));
      }
    };

    const addNewInput = () => {
      setAdditionalInputs(prev => ({
        ...prev,
        [activityId]: [
          ...prev[activityId],
          { id: Date.now().toString(), text: '' },
        ],
      }));
    };

    return (
      <View style={styles.additionalInputsContainer}>
        <View style={styles.additionalInputsHeader}>
          <Text style={styles.additionalInputsTitle}>Additional Notes</Text>
          <TouchableOpacity onPress={addNewInput} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add More</Text>
          </TouchableOpacity>
        </View>

        {inputs.map((item, index) => (
          <View key={item.id} style={styles.listItemContainer}>
            <TextInput
              label={`Note ${index + 1}`}
              value={item.text}
              onChangeText={text => updateAdditionalInput(item.id, text)}
              mode="outlined"
              style={[styles.input, styles.listInput]}
              multiline
            />
            {inputs.length > 1 && (
              <TouchableOpacity
                onPress={() => removeAdditionalInput(item.id)}
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

  // Feeling box helper
  const renderFeelingBox = (activityId: string) => {
    return (
      <View style={styles.feelingContainer}>
        <Text style={styles.feelingTitle}>💭 How are you feeling?</Text>
        <TextInput
          label="Express your current feeling..."
          value={feelings[activityId] || ''}
          onChangeText={text =>
            setFeelings(prev => ({ ...prev, [activityId]: text }))
          }
          mode="outlined"
          style={[styles.input, styles.feelingInput]}
          multiline
          numberOfLines={3}
        />
      </View>
    );
  };

  // Carousel functions
  const handleScroll = (event: any) => {
    const slideSize = screenWidth * 0.85;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const renderActivityCard = ({ item }: { item: Activity }) => (
    <View style={styles.carouselCard}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <ScrollView
        style={styles.cardScrollView}
        contentContainerStyle={styles.cardScrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.cardContent}>{item.content}</View>
      </ScrollView>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.pagination}>
      {activities.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex
              ? styles.paginationDotActive
              : styles.paginationDotInactive,
          ]}
          onPress={() => {
            flatListRef.current?.scrollToIndex({ index, animated: true });
            setCurrentIndex(index);
          }}
        />
      ))}
    </View>
  );

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
          {renderAdditionalInputs('1')}
          {renderFeelingBox('1')}
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
          {renderAdditionalInputs('2')}
          {renderFeelingBox('2')}
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
          {renderAdditionalInputs('3')}
          {renderFeelingBox('3')}
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
          {renderAdditionalInputs('4')}
          {renderFeelingBox('4')}
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
          {renderAdditionalInputs('5')}
          {renderFeelingBox('5')}
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
          {renderAdditionalInputs('6')}
          {renderFeelingBox('6')}
        </React.Fragment>
      ),
    },
    {
      id: '7',
      title: '🏆 What I Completed Today',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img1.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          {renderListInputs('Completed', completed, setCompleted)}
          <Button icon="paperclip" mode="text">
            Attach
          </Button>
          {renderAdditionalInputs('7')}
          {renderFeelingBox('7')}
        </React.Fragment>
      ),
    },
    {
      id: '8',
      title: '❓ My Requests & Questions',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img2.png')}
            style={styles.activityImage}
            resizeMode="cover"
          />
          {renderListInputs('Request', requests, setRequests)}
          <Button icon="paperclip" mode="text">
            Attach
          </Button>
          {renderAdditionalInputs('8')}
          {renderFeelingBox('8')}
        </React.Fragment>
      ),
    },
    {
      id: '9',
      title: '📊 Dashboard Snapshot',
      content: (
        <React.Fragment>
          <Image
            source={require('../components/assets/img/img3.png')}
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
          {renderAdditionalInputs('9')}
          {renderFeelingBox('9')}
        </React.Fragment>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Activities</Text>
        <Text style={styles.subtitle}>
          Track your progress and stay focused
        </Text>
      </View>

      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={activities}
          renderItem={renderActivityCard}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={screenWidth * 0.85}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContentContainer}
          keyExtractor={item => item.id}
          removeClippedSubviews={false} // Prevent content clipping
          initialNumToRender={3} // Render more items initially
          maxToRenderPerBatch={3} // Render more items per batch
        />
      </View>

      {renderPaginationDots()}

      <View style={styles.bottomSpacing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 5,
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
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselContentContainer: {
    paddingHorizontal: screenWidth * 0.075,
  },
  carouselCard: {
    width: screenWidth * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    height: 650, // Fixed height for consistent card size
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardScrollView: {
    flex: 1,
  },
  cardScrollContent: {
    paddingBottom: 20, // Extra padding at bottom
    flexGrow: 1,
  },
  cardContent: {
    gap: 12,
    minHeight: 500, // Minimum height to ensure content fits
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 2,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paginationDotInactive: {
    backgroundColor: '#C7C7CC',
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
    width: 230,
    height: 300,
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
  additionalInputsContainer: {
    marginTop: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  additionalInputsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  additionalInputsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  feelingContainer: {
    marginTop: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  feelingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d63384',
    marginBottom: 8,
    textAlign: 'center',
  },
  feelingInput: {
    backgroundColor: '#fff',
  },
});

export default Activities;
