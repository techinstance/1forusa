import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Switch, Button, Avatar } from 'react-native-paper';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getStoredUserData, getUserProfile } from '../Services/authServices';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profileImage: 'https://via.placeholder.com/120',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from AsyncStorage on component mount
  useEffect(() => {
    const checkStoredUserId = async () => {
      console.log('🔍 Checking for stored user ID...');
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('📋 Found userId in AsyncStorage:', storedUserId);

        if (storedUserId) {
          console.log('✅ Setting userId from AsyncStorage:', storedUserId);
          setUserId(storedUserId);

          // Fetch user profile data immediately
          try {
            console.log('🌐 Fetching user profile for ID:', storedUserId);
            const userProfileData = await getUserProfile(storedUserId);
            console.log('✅ Profile data received:', userProfileData);

            if (userProfileData) {
              // Handle different response structures
              let userData;
              if (userProfileData.user) {
                userData = userProfileData.user;
              } else if (userProfileData.data && userProfileData.data.user) {
                userData = userProfileData.data.user;
              } else if (userProfileData.data) {
                userData = userProfileData.data;
              } else {
                userData = userProfileData;
              }

              console.log('👤 Setting user info:', userData);
              setUserInfo({
                name: userData?.name || userData?.username || 'Guest User',
                email: userData?.email || 'No email',
                profileImage:
                  userData?.profileImage ||
                  userData?.avatar ||
                  userData?.image ||
                  'https://via.placeholder.com/120',
              });
              setIsLoading(false);
            }
          } catch (apiError) {
            console.error('❌ Error fetching profile:', apiError);
            setProfileError('Failed to load profile');
            setIsLoading(false);
          }
        } else {
          console.log('❌ No userId found in AsyncStorage');
          // Try to get from stored user data as fallback
          const storedUserData = await getStoredUserData();
          console.log('📋 Found stored user data:', storedUserData);

          if (storedUserData && (storedUserData.id || storedUserData._id)) {
            const id = storedUserData.id || storedUserData._id;
            console.log('✅ Found user ID in stored data, setting:', id);
            setUserId(id);
            // Also store it in AsyncStorage for future use
            await AsyncStorage.setItem('userId', id);
            console.log('💾 Stored user ID in AsyncStorage');
          } else {
            console.log('❌ No user data found anywhere');
            setUserId(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error checking stored user ID:', error);
        setIsLoading(false);
      }
    };

    checkStoredUserId();
  }, []);

  // Function to refresh user data


  // Refresh data when screen comes into focus (after signup/login)




  useEffect(() => {
    const fetchuserprofile = async () => {
      if (!userId) {
        return;
      }

      try {
        // First try to use stored user data for faster loading
        const storedUserData = await getStoredUserData();
        if (
          storedUserData &&
          (storedUserData.id === userId || storedUserData._id === userId)
        ) {
          setUserInfo({
            name:
              storedUserData?.name || storedUserData?.username || 'Guest User',
            email: storedUserData?.email || 'No email',
            profileImage:
              storedUserData?.profileImage ||
              storedUserData?.avatar ||
              storedUserData?.image ||
              'https://via.placeholder.com/120',
          });
          setIsLoading(false);

          // Still fetch from API to get any updates, but don't block UI
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(
              `http://10.0.2.2:5050/api/auth/profile/${userId}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const profile = await response.json();

            let userData;
            if (profile && profile.user) {
              userData = profile.user;
            } else if (profile && profile.data && profile.data.user) {
              userData = profile.data.user;
            } else if (profile && profile.data) {
              userData = profile.data;
            } else {
              userData = profile;
            }

            // Update with fresh data if different
            if (
              userData &&
              (userData.name !== storedUserData.name ||
                userData.email !== storedUserData.email)
            ) {
              console.log('� Updating with fresh profile data');
              setUserInfo({
                name: userData?.name || userData?.username || 'Guest User',
                email: userData?.email || 'No email',
                profileImage:
                  userData?.profileImage ||
                  userData?.avatar ||
                  userData?.image ||
                  'https://via.placeholder.com/120',
              });
            }
          } catch (apiError: any) {
            console.log(
              '⚠️ API fetch failed, but using stored data:',
              apiError?.message || 'Unknown error',
            );
          }
        } else {
          // No stored data or ID mismatch, fetch from API
          const token = await AsyncStorage.getItem('userToken');
          const response = await fetch(
            `http://10.0.2.2:5050/api/auth/profile/${userId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const profile = await response.json();

          let userData;
          if (profile && profile.user) {
            userData = profile.user;
          } else if (profile && profile.data && profile.data.user) {
            userData = profile.data.user;
          } else if (profile && profile.data) {
            userData = profile.data;
          } else {
            userData = profile;
          }

          setUserInfo({
            name: userData?.name || userData?.username || 'Guest User',
            email: userData?.email || 'No email',
            profileImage:
              userData?.profileImage ||
              userData?.avatar ||
              userData?.image ||
              'https://via.placeholder.com/120',
          });

          setIsLoading(false);
        }
      } catch (error) {
        setProfileError('Failed to load profile');
        console.error('❌ Profile fetch error:', error);
        setIsLoading(false);
      }
    };

    fetchuserprofile();
  }, [userId]); // Now depends on userId state

  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [showGenderOnly, setShowGenderOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const [dailyGoals, setDailyGoals] = useState(['', '', '']);
  const [goalAchievementPlan, setGoalAchievementPlan] = useState('');
  const [yesterdayGoalsComplete, setYesterdayGoalsComplete] = useState([
    false,
    false,
    false,
  ]);

  const [weeklyGoals, setWeeklyGoals] = useState(['', '', '']);

  const [notToDoList, setNotToDoList] = useState(['', '', '']);

  const [completedActivities, setCompletedActivities] = useState([
    '',
    '',
    '',
    '',
    '',
  ]);

  const [userRequests, setUserRequests] = useState(['', '', '', '', '']);

  const [notificationPrefs, setNotificationPrefs] = useState({
    goals: true,
    subscriptions: true,
    feeds: true,
    oneMinuteActivities: true,
    fiveMinuteActivities: true,
    weeklyGoals: true,
  });

  useEffect(() => {
    AsyncStorage.setItem(
      'notificationPrefs',
      JSON.stringify(notificationPrefs),
    );
  }, [notificationPrefs]);

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

      const res = await fetch('http://10.0.2.2:5050/api/messages');
      const allowedMessages = await res.json();

      if (allowedMessages.length === 0) return;

      const intervals = [1, 5, 20, 30, 60];

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

  const handleSaveProfile = () => {
    console.log('Profile saved:', {
      userId,
      dailyGoals,
      weeklyGoals,
      notToDoList,
      completedActivities,
      userRequests,
      isPublicProfile,
      showGenderOnly,
      notificationPrefs,
    });
  };

  const carouselData = [
    {
      id: 'daily-goals',
      title: "📋 Daily Goals & Yesterday's Completion",
      component: () => (
        <View>
          <Text style={styles.subHeader}>Yesterday's Goal Completion:</Text>
          {yesterdayGoalsComplete.map((completed, index) => (
            <View key={`yesterday-${index}`} style={styles.switchRow}>
              <Text style={styles.switchLabel}>Goal {index + 1} completed</Text>
              <Switch
                value={completed}
                onValueChange={value => {
                  const newYesterdayGoals = [...yesterdayGoalsComplete];
                  newYesterdayGoals[index] = value;
                  setYesterdayGoalsComplete(newYesterdayGoals);
                }}
              />
            </View>
          ))}

          <Text style={styles.subHeader}>Today's Goals:</Text>
          {dailyGoals.map((goal, index) => (
            <TextInput
              key={`daily-${index}`}
              label={`Daily Goal ${index + 1}`}
              value={goal}
              onChangeText={text => {
                const newGoals = [...dailyGoals];
                newGoals[index] = text;
                setDailyGoals(newGoals);
              }}
              mode="outlined"
              style={styles.input}
              placeholder="Enter your daily goal..."
            />
          ))}

          <TextInput
            label="How will you achieve these goals?"
            value={goalAchievementPlan}
            onChangeText={setGoalAchievementPlan}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Describe your plan to achieve today's goals..."
          />
        </View>
      ),
    },
    {
      id: 'weekly-goals',
      title: '🎯 Weekly Goals (Mandatory)',
      component: () => (
        <View>
          {weeklyGoals.map((goal, index) => (
            <TextInput
              key={`weekly-${index}`}
              label={`Weekly Goal ${index + 1}`}
              value={goal}
              onChangeText={text => {
                const newGoals = [...weeklyGoals];
                newGoals[index] = text;
                setWeeklyGoals(newGoals);
              }}
              mode="outlined"
              style={styles.input}
              placeholder="Enter your weekly goal..."
            />
          ))}
        </View>
      ),
    },
    {
      id: 'not-todo',
      title: '🚫 Not To Do List (Mandatory)',
      component: () => (
        <View>
          {notToDoList.map((item, index) => (
            <TextInput
              key={`notdo-${index}`}
              label={`Avoid ${index + 1}`}
              value={item}
              onChangeText={text => {
                const newList = [...notToDoList];
                newList[index] = text;
                setNotToDoList(newList);
              }}
              mode="outlined"
              style={styles.input}
              placeholder="What should you avoid doing..."
            />
          ))}
        </View>
      ),
    },
    {
      id: 'completed',
      title: '✅ I Completed Today',
      component: () => (
        <View>
          {completedActivities.map((activity, index) => (
            <TextInput
              key={`completed-${index}`}
              label={`Completed Activity ${index + 1}`}
              value={activity}
              onChangeText={text => {
                const newActivities = [...completedActivities];
                newActivities[index] = text;
                setCompletedActivities(newActivities);
              }}
              mode="outlined"
              style={styles.input}
              placeholder="What did you complete today..."
            />
          ))}
        </View>
      ),
    },
    {
      id: 'requests',
      title: '❓ My Requests/Questions',
      component: () => (
        <View>
          {userRequests.map((request, index) => (
            <TextInput
              key={`request-${index}`}
              label={`Request/Question ${index + 1}`}
              value={request}
              onChangeText={text => {
                const newRequests = [...userRequests];
                newRequests[index] = text;
                setUserRequests(newRequests);
              }}
              mode="outlined"
              style={styles.input}
              placeholder="Your question or request..."
            />
          ))}
        </View>
      ),
    },
  ];

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={styles.carouselCard}>
      <Text variant="titleMedium" style={styles.sectionHeader}>
        {item.title}
      </Text>
      {item.component()}
    </View>
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={120}
          source={{
            uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }}
          style={styles.profileImage}
        />
        <View style={styles.userInfoContainer}>
          {isLoading ? (
            <Text variant="bodyMedium" style={styles.loadingText}>
              Loading profile...
            </Text>
          ) : (
            <>
              <Text variant="headlineMedium" style={styles.userName}>
                {userInfo.name || 'Guest User'}
              </Text>
              <Text variant="bodyLarge" style={styles.userEmail}>
                {userInfo.email || 'No email'}
              </Text>
              {profileError && (
                <Text variant="bodySmall" style={styles.errorText}>
                  Error: {profileError}
                </Text>
              )}
            </>
          )}
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Debug button to check AsyncStorage */}
          <TouchableOpacity
            style={[
              styles.editProfileButton,
              { backgroundColor: '#007bff', marginTop: 8 },
            ]}
            onPress={async () => {
              console.log('🔍 === Manual AsyncStorage Check ===');
              try {
                const storedUserId = await AsyncStorage.getItem('userId');
                const userToken = await AsyncStorage.getItem('userToken');
                const userData = await AsyncStorage.getItem('userData');
                const allKeys = await AsyncStorage.getAllKeys();

                console.log('📋 All AsyncStorage keys:', allKeys);
                console.log('👤 storedUserId:', storedUserId);
                console.log(
                  '🔑 userToken:',
                  userToken ? 'EXISTS' : 'NOT FOUND',
                );
                console.log(
                  '📊 userData:',
                  userData ? JSON.parse(userData) : 'NOT FOUND',
                );
                console.log('🎯 Current userId state:', userId);

                if (storedUserId && storedUserId !== userId) {
                  console.log('🔄 Force updating userId state...');
                  setUserId(storedUserId);
                  setProfileError(null);
                  setIsLoading(true);
                }
              } catch (error) {
                console.error('❌ Error checking AsyncStorage:', error);
              }
            }}
          >
            <Text style={styles.editProfileText}>Debug Storage</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Profile Settings
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Set profile as public</Text>
          <Switch value={isPublicProfile} onValueChange={setIsPublicProfile} />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            Show questions to my gender only
          </Text>
          <Switch value={showGenderOnly} onValueChange={setShowGenderOnly} />
        </View>
      </View>

      <View style={styles.carouselContainer}>
        <Text variant="titleMedium" style={styles.carouselTitle}>
          Personal Growth Journey
        </Text>

        <View style={styles.pageIndicators}>
          {carouselData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pageIndicator,
                currentPage === index && styles.activePageIndicator,
              ]}
              onPress={() => {
                setCurrentPage(index);
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
            />
          ))}
        </View>

        <FlatList
          ref={flatListRef}
          data={carouselData}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            const pageIndex = Math.round(
              event.nativeEvent.contentOffset.x /
                Dimensions.get('window').width,
            );
            setCurrentPage(pageIndex);
          }}
          style={styles.carousel}
        />
      </View>

      <View style={styles.card}>
        <Text variant="titleMedium" style={styles.sectionHeader}>
          🔔 Push Notification Settings
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Daily Goals notifications</Text>
          <Switch
            value={notificationPrefs.goals}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, goals: value }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>1-Minute Activity reminders</Text>
          <Switch
            value={notificationPrefs.oneMinuteActivities}
            onValueChange={value =>
              setNotificationPrefs(prev => ({
                ...prev,
                oneMinuteActivities: value,
              }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>5-Minute Activity reminders</Text>
          <Switch
            value={notificationPrefs.fiveMinuteActivities}
            onValueChange={value =>
              setNotificationPrefs(prev => ({
                ...prev,
                fiveMinuteActivities: value,
              }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Weekly Goals reminders</Text>
          <Switch
            value={notificationPrefs.weeklyGoals}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, weeklyGoals: value }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Subscription notifications</Text>
          <Switch
            value={notificationPrefs.subscriptions}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, subscriptions: value }))
            }
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Feed notifications</Text>
          <Switch
            value={notificationPrefs.feeds}
            onValueChange={value =>
              setNotificationPrefs(prev => ({ ...prev, feeds: value }))
            }
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSaveProfile}
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
        >
          Save Profile Settings
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
  profileHeader: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    marginRight: 20,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    color: '#FF6B00',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    color: '#666',
    marginBottom: 12,
  },
  editProfileButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  carouselContainer: {
    width: '100%',
    marginBottom: 16,
  },
  carouselTitle: {
    color: '#FF6B00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activePageIndicator: {
    backgroundColor: '#FF6B00',
    width: 24,
  },
  carousel: {
    height: 400,
  },
  carouselCard: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  sectionHeader: {
    color: '#FF6B00',
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 18,
  },
  subHeader: {
    color: '#333',
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
    fontSize: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
