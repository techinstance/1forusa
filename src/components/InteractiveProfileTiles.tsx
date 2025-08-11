import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface TileData {
  id: string;
  title: string;
  type: 'good' | 'bad' | 'neutral' | 'input' | 'progress';
  icon: string;
  description?: string;
  isRevealed: boolean;
  isCompleted: boolean;
  data?: any;
}

interface InteractiveProfileTilesProps {
  dailyGoals: string[];
  setDailyGoals: (goals: string[]) => void;
  weeklyGoals: string[];
  setWeeklyGoals: (goals: string[]) => void;
  notToDoList: string[];
  setNotToDoList: (list: string[]) => void;
  completedActivities: string[];
  setCompletedActivities: (activities: string[]) => void;
  userRequests: string[];
  setUserRequests: (requests: string[]) => void;
  yesterdayGoalsComplete: boolean[];
  setYesterdayGoalsComplete: (goals: boolean[]) => void;
  goalAchievementPlan: string;
  setGoalAchievementPlan: (plan: string) => void;
  onSaveProfile: () => void;
}

const InteractiveProfileTiles: React.FC<InteractiveProfileTilesProps> = ({
  dailyGoals,
  setDailyGoals,
  weeklyGoals,
  setWeeklyGoals,
  notToDoList,
  setNotToDoList,
  completedActivities,
  setCompletedActivities,
  userRequests,
  setUserRequests,
  yesterdayGoalsComplete,
  setYesterdayGoalsComplete,
  goalAchievementPlan,
  setGoalAchievementPlan,
  onSaveProfile,
}) => {
  const [tiles, setTiles] = useState<TileData[]>([
    {
      id: 'yesterday-review',
      title: "Yesterday's Goals",
      type: yesterdayGoalsComplete.some(g => g) ? 'good' : 'bad',
      icon: 'checkmark-done-circle',
      description: 'Review how you did yesterday',
      isRevealed: false,
      isCompleted: yesterdayGoalsComplete.every(g => g),
      data: { yesterdayGoalsComplete }
    },
    {
      id: 'daily-goals',
      title: "Today's Goals",
      type: dailyGoals.some(g => g.trim() !== '') ? 'good' : 'neutral',
      icon: 'today',
      description: 'Set your daily targets',
      isRevealed: false,
      isCompleted: dailyGoals.every(g => g.trim() !== ''),
      data: { dailyGoals, goalAchievementPlan }
    },
    {
      id: 'weekly-goals',
      title: 'Weekly Goals',
      type: weeklyGoals.some(g => g.trim() !== '') ? 'good' : 'bad',
      icon: 'calendar',
      description: 'Plan your week ahead',
      isRevealed: false,
      isCompleted: weeklyGoals.every(g => g.trim() !== ''),
      data: { weeklyGoals }
    },
    {
      id: 'not-todo',
      title: 'Avoid These',
      type: notToDoList.some(g => g.trim() !== '') ? 'good' : 'bad',
      icon: 'ban',
      description: 'Things to avoid today',
      isRevealed: false,
      isCompleted: notToDoList.every(g => g.trim() !== ''),
      data: { notToDoList }
    },
    {
      id: 'completed',
      title: 'Completed Today',
      type: completedActivities.some(g => g.trim() !== '') ? 'good' : 'neutral',
      icon: 'trophy',
      description: 'What you achieved',
      isRevealed: false,
      isCompleted: completedActivities.some(g => g.trim() !== ''),
      data: { completedActivities }
    },
    {
      id: 'requests',
      title: 'Questions & Requests',
      type: userRequests.some(g => g.trim() !== '') ? 'good' : 'neutral',
      icon: 'help-circle',
      description: 'Ask for help or guidance',
      isRevealed: false,
      isCompleted: userRequests.some(g => g.trim() !== ''),
      data: { userRequests }
    },
  ]);

  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const getColorScheme = (type: string, isRevealed: boolean, isCompleted: boolean) => {
    if (!isRevealed) {
      return {
        primary: '#E0E0E0',
        secondary: '#BDBDBD',
        background: '#F5F5F5',
        text: '#666',
        icon: '#999',
      };
    }

    switch (type) {
      case 'good':
        return {
          primary: isCompleted ? '#4CAF50' : '#81C784',
          secondary: '#C8E6C9',
          background: '#E8F5E8',
          text: '#2E7D32',
          icon: '#4CAF50',
        };
      case 'bad':
        return {
          primary: '#F44336',
          secondary: '#FFCDD2',
          background: '#FFEBEE',
          text: '#C62828',
          icon: '#F44336',
        };
      default:
        return {
          primary: '#2196F3',
          secondary: '#BBDEFB',
          background: '#E3F2FD',
          text: '#1976D2',
          icon: '#2196F3',
        };
    }
  };

  const handleTilePress = (tileId: string) => {
    // Play click sound effect (you can add actual sound here)
    console.log('🔊 Click sound for tile:', tileId);
    
    setTiles(prevTiles => 
      prevTiles.map(tile => 
        tile.id === tileId 
          ? { ...tile, isRevealed: !tile.isRevealed }
          : tile
      )
    );

    setSelectedTile(selectedTile === tileId ? null : tileId);

    // Haptic feedback simulation
    console.log('📳 Haptic feedback');
  };

  const updateTileData = (tileId: string, newData: any) => {
    setTiles(prevTiles => 
      prevTiles.map(tile => 
        tile.id === tileId 
          ? { 
              ...tile, 
              data: { ...tile.data, ...newData },
              isCompleted: checkCompletion(tileId, newData)
            }
          : tile
      )
    );
  };

  const checkCompletion = (tileId: string, data: any): boolean => {
    switch (tileId) {
      case 'yesterday-review':
        return data.yesterdayGoalsComplete?.every((g: boolean) => g) || false;
      case 'daily-goals':
        return data.dailyGoals?.every((g: string) => g.trim() !== '') && 
               data.goalAchievementPlan?.trim() !== '';
      case 'weekly-goals':
        return data.weeklyGoals?.every((g: string) => g.trim() !== '') || false;
      case 'not-todo':
        return data.notToDoList?.every((g: string) => g.trim() !== '') || false;
      case 'completed':
        return data.completedActivities?.some((g: string) => g.trim() !== '') || false;
      case 'requests':
        return data.userRequests?.some((g: string) => g.trim() !== '') || false;
      default:
        return false;
    }
  };

  const renderTileContent = (tile: TileData) => {
    if (!tile.isRevealed) return null;

    switch (tile.id) {
      case 'yesterday-review':
        return (
          <View style={styles.tileContent}>
            <Text style={styles.contentTitle}>How did yesterday go?</Text>
            {yesterdayGoalsComplete.map((completed, index) => (
              <View key={index} style={styles.switchRow}>
                <Text style={styles.switchLabel}>Goal {index + 1} completed</Text>
                <Switch
                  value={completed}
                  onValueChange={value => {
                    const newGoals = [...yesterdayGoalsComplete];
                    newGoals[index] = value;
                    setYesterdayGoalsComplete(newGoals);
                    updateTileData(tile.id, { yesterdayGoalsComplete: newGoals });
                  }}
                />
              </View>
            ))}
          </View>
        );

      case 'daily-goals':
        return (
          <View style={styles.tileContent}>
            <Text style={styles.contentTitle}>Today's Goals</Text>
            {dailyGoals.map((goal, index) => (
              <TextInput
                key={index}
                placeholder={`Daily Goal ${index + 1}`}
                value={goal}
                onChangeText={text => {
                  const newGoals = [...dailyGoals];
                  newGoals[index] = text;
                  setDailyGoals(newGoals);
                  updateTileData(tile.id, { 
                    dailyGoals: newGoals, 
                    goalAchievementPlan 
                  });
                }}
                style={styles.textInput}
                multiline
              />
            ))}
            <TextInput
              placeholder="How will you achieve these goals?"
              value={goalAchievementPlan}
              onChangeText={text => {
                setGoalAchievementPlan(text);
                updateTileData(tile.id, { 
                  dailyGoals, 
                  goalAchievementPlan: text 
                });
              }}
              style={[styles.textInput, styles.largeInput]}
              multiline
              numberOfLines={3}
            />
          </View>
        );

      case 'weekly-goals':
        return (
          <View style={styles.tileContent}>
            <Text style={styles.contentTitle}>Weekly Goals (Mandatory)</Text>
            {weeklyGoals.map((goal, index) => (
              <TextInput
                key={index}
                placeholder={`Weekly Goal ${index + 1}`}
                value={goal}
                onChangeText={text => {
                  const newGoals = [...weeklyGoals];
                  newGoals[index] = text;
                  setWeeklyGoals(newGoals);
                  updateTileData(tile.id, { weeklyGoals: newGoals });
                }}
                style={styles.textInput}
                multiline
              />
            ))}
          </View>
        );

      case 'not-todo':
        return (
          <View style={styles.tileContent}>
            <Text style={styles.contentTitle}>Not To Do List (Mandatory)</Text>
            {notToDoList.map((item, index) => (
              <TextInput
                key={index}
                placeholder={`Avoid ${index + 1}`}
                value={item}
                onChangeText={text => {
                  const newList = [...notToDoList];
                  newList[index] = text;
                  setNotToDoList(newList);
                  updateTileData(tile.id, { notToDoList: newList });
                }}
                style={styles.textInput}
                multiline
              />
            ))}
          </View>
        );

      case 'completed':
        return (
          <View style={styles.tileContent}>
            <Text style={styles.contentTitle}>What I Completed Today</Text>
            {completedActivities.map((activity, index) => (
              <TextInput
                key={index}
                placeholder={`Completed Activity ${index + 1}`}
                value={activity}
                onChangeText={text => {
                  const newActivities = [...completedActivities];
                  newActivities[index] = text;
                  setCompletedActivities(newActivities);
                  updateTileData(tile.id, { completedActivities: newActivities });
                }}
                style={styles.textInput}
                multiline
              />
            ))}
          </View>
        );

      case 'requests':
        return (
          <View style={styles.tileContent}>
            <Text style={styles.contentTitle}>My Requests & Questions</Text>
            {userRequests.map((request, index) => (
              <TextInput
                key={index}
                placeholder={`Request/Question ${index + 1}`}
                value={request}
                onChangeText={text => {
                  const newRequests = [...userRequests];
                  newRequests[index] = text;
                  setUserRequests(newRequests);
                  updateTileData(tile.id, { userRequests: newRequests });
                }}
                style={styles.textInput}
                multiline
              />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const handleSaveAll = () => {
    Alert.alert(
      'Save Profile',
      'Are you sure you want to save all your progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            onSaveProfile();
            Alert.alert('Success!', 'Your profile has been saved.');
          },
        },
      ]
    );
  };

  const renderProgressIndicator = () => {
    const completedCount = tiles.filter(tile => tile.isCompleted).length;
    const totalCount = tiles.length;
    const progressPercentage = (completedCount / totalCount) * 100;

    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Profile Completion</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedCount} of {totalCount} sections completed ({Math.round(progressPercentage)}%)
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderProgressIndicator()}
      
      <View style={styles.gridContainer}>
        {tiles.map((tile, index) => {
          const colors = getColorScheme(tile.type, tile.isRevealed, tile.isCompleted);
          const isLargeTile = index === 0 || index === 1; // First two tiles are larger
          
          return (
            <View
              key={tile.id}
              style={[
                styles.tileWrapper,
                isLargeTile ? styles.largeTileWrapper : styles.smallTileWrapper
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.tile,
                  { backgroundColor: colors.primary },
                  tile.isRevealed && styles.revealedTile,
                  tile.isCompleted && styles.completedTile,
                ]}
                onPress={() => handleTilePress(tile.id)}
                activeOpacity={0.8}
              >
                <View style={styles.tileHeader}>
                  <Icon 
                    name={tile.icon} 
                    size={isLargeTile ? 32 : 24} 
                    color={colors.icon} 
                  />
                  <Text style={[styles.tileTitle, { color: colors.text }]}>
                    {tile.title}
                  </Text>
                  {tile.isCompleted && (
                    <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                  )}
                </View>
                
                {!tile.isRevealed && (
                  <View style={styles.hintContainer}>
                    <Icon name="hand-left-outline" size={16} color={colors.text} />
                    <Text style={[styles.hintText, { color: colors.text }]}>
                      Tap to reveal
                    </Text>
                  </View>
                )}

                {tile.description && !tile.isRevealed && (
                  <Text style={[styles.tileDescription, { color: colors.text }]}>
                    {tile.description}
                  </Text>
                )}
              </TouchableOpacity>

              {tile.isRevealed && (
                <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                  {renderTileContent(tile)}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAll}>
        <Icon name="save-outline" size={24} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save All Progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  progressContainer: {
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
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  tileWrapper: {
    marginBottom: 12,
  },
  largeTileWrapper: {
    width: (width - 44) / 2, // Half width minus margins and gap
  },
  smallTileWrapper: {
    width: (width - 56) / 3, // Third width minus margins and gaps
  },
  tile: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'space-between',
  },
  revealedTile: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  completedTile: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  tileHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  tileDescription: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  hintText: {
    fontSize: 10,
    marginLeft: 4,
  },
  contentContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tileContent: {
    minHeight: 100,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  largeInput: {
    minHeight: 80,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default InteractiveProfileTiles;
