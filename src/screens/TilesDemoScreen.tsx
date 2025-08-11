import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InteractiveProfileTiles from '../components/InteractiveProfileTiles';

const TilesDemoScreen: React.FC = () => {
  // Sample data for demo
  const [dailyGoals, setDailyGoals] = useState(['Exercise for 30 minutes', 'Read for 1 hour', 'Meditate']);
  const [weeklyGoals, setWeeklyGoals] = useState(['Complete project milestone', 'Improve sleep schedule', 'Learn new skill']);
  const [notToDoList, setNotToDoList] = useState(['Skip breakfast', 'Procrastinate on important tasks', 'Stay up late']);
  const [completedActivities, setCompletedActivities] = useState(['Morning workout', 'Healthy breakfast', '', '', '']);
  const [userRequests, setUserRequests] = useState(['How to improve focus?', 'Best meditation apps?', '', '', '']);
  const [yesterdayGoalsComplete, setYesterdayGoalsComplete] = useState([true, false, true]);
  const [goalAchievementPlan, setGoalAchievementPlan] = useState('Focus on morning routine and time-blocking techniques');

  const handleSaveProfile = () => {
    Alert.alert(
      'Profile Saved!',
      'All your progress and goals have been saved successfully.',
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const resetData = () => {
    Alert.alert(
      'Reset Demo Data',
      'This will reset all the demo data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setDailyGoals(['', '', '']);
            setWeeklyGoals(['', '', '']);
            setNotToDoList(['', '', '']);
            setCompletedActivities(['', '', '', '', '']);
            setUserRequests(['', '', '', '', '']);
            setYesterdayGoalsComplete([false, false, false]);
            setGoalAchievementPlan('');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Interactive Profile Tiles Demo</Text>
        <Text style={styles.headerSubtitle}>
          Experience the new tile-based interface with click-to-reveal, color-coded feedback, and interactive forms
        </Text>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetData}>
          <Icon name="refresh-outline" size={16} color="#FF6B35" />
          <Text style={styles.resetButtonText}>Reset Demo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features Demonstrated:</Text>
          
          <View style={styles.featureItem}>
            <Icon name="hand-left-outline" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Click tiles to reveal content</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="color-palette-outline" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Red/Green color coding based on completion</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="create-outline" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Interactive forms and text inputs</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="checkmark-circle-outline" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Progress tracking and completion status</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="analytics-outline" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Mixed tile sizes and responsive grid layout</Text>
          </View>
        </View>

        <InteractiveProfileTiles
          dailyGoals={dailyGoals}
          setDailyGoals={setDailyGoals}
          weeklyGoals={weeklyGoals}
          setWeeklyGoals={setWeeklyGoals}
          notToDoList={notToDoList}
          setNotToDoList={setNotToDoList}
          completedActivities={completedActivities}
          setCompletedActivities={setCompletedActivities}
          userRequests={userRequests}
          setUserRequests={setUserRequests}
          yesterdayGoalsComplete={yesterdayGoalsComplete}
          setYesterdayGoalsComplete={setYesterdayGoalsComplete}
          goalAchievementPlan={goalAchievementPlan}
          setGoalAchievementPlan={setGoalAchievementPlan}
          onSaveProfile={handleSaveProfile}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  resetButtonText: {
    fontSize: 12,
    color: '#FF6B35',
    marginLeft: 4,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});

export default TilesDemoScreen;
