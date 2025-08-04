import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { RootStackParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
const Splash = ({ navigation }: SplashProps) => {
  // Check authentication and interest selection status
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const interestSelectionCompleted = await AsyncStorage.getItem(
          'interestSelectionCompleted',
        );

        console.log('🔍 Checking auth status:', {
          userToken: !!userToken,
          interestSelectionCompleted,
        });

        if (userToken) {
          // User is logged in
          if (interestSelectionCompleted === 'true') {
            // User has completed interest selection, go to Home
            console.log(
              '✅ User authenticated and interest selection completed, redirecting to Home',
            );
            navigation.replace('Home');
          } else {
            // User hasn't completed interest selection, go to InterestSelection
            console.log(
              '📝 User authenticated but needs to complete interest selection',
            );
            navigation.replace('InterestSelection');
          }
        } else {
          // User is not logged in, go to Login
          console.log('🔑 User not authenticated, redirecting to Login');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('❌ Error checking auth status:', error);
        // Default to Login if there's an error
        navigation.replace('Login');
      }
    };

    const timeout = setTimeout(() => {
      checkAuthAndRedirect();
    }, 2500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <Text style={styles.logoText}>1forusa</Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  loader: {
    marginTop: 20,
  },
});
