import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserInterest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Save user interests
export const saveUserInterests = async (interests: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('userInterests', JSON.stringify(interests));
    console.log('✅ User interests saved:', interests);
  } catch (error) {
    console.error('❌ Error saving user interests:', error);
    throw error;
  }
};

// Get user interests
export const getUserInterests = async (): Promise<string[]> => {
  try {
    const interests = await AsyncStorage.getItem('userInterests');
    return interests ? JSON.parse(interests) : [];
  } catch (error) {
    console.error('❌ Error getting user interests:', error);
    return [];
  }
};

// Mark interest selection as completed
export const markInterestSelectionCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('interestSelectionCompleted', 'true');
    console.log('✅ Interest selection marked as completed');
  } catch (error) {
    console.error('❌ Error marking interest selection as completed:', error);
    throw error;
  }
};

// Check if interest selection is completed
export const isInterestSelectionCompleted = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem('interestSelectionCompleted');
    return completed === 'true';
  } catch (error) {
    console.error('❌ Error checking interest selection status:', error);
    return false;
  }
};

// Clear interest selection data (useful for logout)
export const clearInterestSelectionData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      'userInterests',
      'interestSelectionCompleted',
    ]);
    console.log('✅ Interest selection data cleared');
  } catch (error) {
    console.error('❌ Error clearing interest selection data:', error);
    throw error;
  }
};

// Get all available interests
export const getAvailableInterests = (): UserInterest[] => {
  return [
    { id: 'trading', name: 'Trading', icon: '📈', color: '#4CAF50' },
    { id: 'cricket', name: 'Cricket', icon: '🏏', color: '#FF9800' },
    { id: 'football', name: 'Football', icon: '⚽', color: '#2196F3' },
    { id: 'fitness', name: 'Fitness', icon: '💪', color: '#E91E63' },
    { id: 'cooking', name: 'Cooking', icon: '👨‍🍳', color: '#FF5722' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: '#00BCD4' },
    { id: 'music', name: 'Music', icon: '🎵', color: '#9C27B0' },
    { id: 'reading', name: 'Reading', icon: '📚', color: '#795548' },
    { id: 'photography', name: 'Photography', icon: '📸', color: '#607D8B' },
    { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#3F51B5' },
    { id: 'art', name: 'Art & Design', icon: '🎨', color: '#FFC107' },
    { id: 'technology', name: 'Technology', icon: '💻', color: '#009688' },
    { id: 'meditation', name: 'Meditation', icon: '🧘‍♂️', color: '#8BC34A' },
    { id: 'movies', name: 'Movies', icon: '🎬', color: '#673AB7' },
    { id: 'business', name: 'Business', icon: '💼', color: '#FF4081' },
    { id: 'education', name: 'Education', icon: '🎓', color: '#CDDC39' },
  ];
};
