import api from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (email, password) => {
  try {
    // Clear any existing user data first
    console.log('🧹 Clearing old user data...');
    await AsyncStorage.multiRemove(['userId', 'userToken', 'userData']);

    const response = await api.post('/auth/login', { email, password });

    console.log('Login response:', response.data.user);
    // Store user data including ID for later use
    if (response.data && response.data.user) {
      await AsyncStorage.setItem(
        'userId',
        response.data.user.id || response.data.user._id,
      );
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify(response.data.user),
      );
      console.log('✅ New login data stored successfully');
    }
    return response.data;
  } catch (error) {
    const errMessages =
      error?.response?.data?.errMessages || 'Something went wrong';
    throw new Error(errMessages);
  }
};

const signup = async (name, email, password, confirmPassword) => {
  try {
    console.log('🚀 Starting signup process...');
    console.log('📊 Signup data:', {
      name,
      email,
      password: '***',
      confirmPassword: '***',
    });

    // Clear any existing user data first
    console.log('🧹 Clearing old user data...');
    await AsyncStorage.multiRemove(['userId', 'userToken', 'userData']);

    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });

    console.log('✅ Signup API response:', response.data);

    // Store new user data including ID for later use
    if (response.data && response.data.user) {
      console.log('💾 Storing new user data in AsyncStorage...');
      await AsyncStorage.setItem(
        'userId',
        response.data.user.id || response.data.user._id,
      );
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify(response.data.user),
      );
      console.log('✅ New user data stored successfully');
      console.log('👤 New user stored:', {
        id: response.data.user.id || response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
      });
    } else {
      console.log('⚠️ No user data in response to store');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Signup error details:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error message:', error.message);

    const errMessages =
      error?.response?.data?.errMessages ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong in signup';
    throw new Error(errMessages);
  }
};

const getUserProfile = async id => {
  try {
    const user = await api.get(`/auth/profile/${id}`);
    return user.data;
  } catch (error) {
    const errMessages =
      error?.response?.data?.errMessages || 'Something went wrong';
    throw new Error(errMessages);
  }
};

// New function to get current user profile using token
const getCurrentUserProfile = async () => {
  try {
    const token = await getUserToken();
    console.log(
      '🔑 Using token for profile fetch:',
      token ? 'Token found' : 'No token',
    );

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Set authorization header
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Profile fetched successfully with token');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching profile with token:', error.message);
    const errMessages =
      error?.response?.data?.errMessages || 'Something went wrong';
    throw new Error(errMessages);
  }
};

// Helper function to get stored user ID
const getCurrentUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Helper function to get stored user token
const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
};

// Helper function to get stored user data
const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Helper function to clear all user data (logout)
const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['userId', 'userToken', 'userData']);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

// Debug function to check all AsyncStorage data
const debugAsyncStorage = async () => {
  try {
    console.log('🔍 === AsyncStorage Debug Information ===');

    // Get all keys in AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📂 All AsyncStorage keys:', allKeys);

    // Check specific auth-related data
    const userId = await AsyncStorage.getItem('userId');
    const userToken = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');

    console.log('👤 UserId in storage:', userId);
    console.log('🔑 UserToken in storage:', userToken ? 'EXISTS' : 'NOT FOUND');
    console.log('📋 UserData in storage:', userData ? 'EXISTS' : 'NOT FOUND');

    // Try to parse userData if it exists
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('✅ Parsed user data:', parsedUserData);
      } catch (parseError) {
        console.error('❌ Error parsing userData:', parseError);
      }
    }

    // Test if AsyncStorage is working
    await AsyncStorage.setItem('testKey', 'testValue');
    const testValue = await AsyncStorage.getItem('testKey');
    console.log(
      '🧪 AsyncStorage test:',
      testValue === 'testValue' ? 'WORKING' : 'FAILED',
    );

    console.log('🔍 === End AsyncStorage Debug ===');

    return {
      userId,
      userToken: userToken ? 'EXISTS' : null,
      userData: userData ? JSON.parse(userData) : null,
      allKeys,
      asyncStorageWorking: testValue === 'testValue',
    };
  } catch (error) {
    console.error('❌ Error debugging AsyncStorage:', error);
    return null;
  }
};

// Function to manually set test user data
const setTestUserData = async () => {
  try {
    console.log('🧪 Setting test user data...');

    const testUserId = '688e148cb3dbe9b89300e88e';
    const testToken = 'test-token-12345';
    const testUserData = {
      id: testUserId,
      name: 'Test User',
      email: 'test@example.com',
      profileImage: 'https://via.placeholder.com/120',
    };

    await AsyncStorage.setItem('userId', testUserId);
    await AsyncStorage.setItem('userToken', testToken);
    await AsyncStorage.setItem('userData', JSON.stringify(testUserData));

    console.log('✅ Test user data set successfully');
    console.log('📋 Test data:', testUserData);

    // Verify it was stored
    const storedUserId = await AsyncStorage.getItem('userId');
    console.log('🔍 Verification - stored userId:', storedUserId);

    return true;
  } catch (error) {
    console.error('❌ Error setting test user data:', error);
    return false;
  }
};

export {
  login,
  signup,
  getUserProfile,
  getCurrentUserProfile,
  getCurrentUserId,
  getUserToken,
  getStoredUserData,
  logout,
  debugAsyncStorage,
  setTestUserData,
};
