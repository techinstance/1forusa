import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  onAuthSuccess: () => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthSuccess }) => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <Login
            {...props}
            onSignUpPress={() => props.navigation.navigate('SignUp')}
            onLoginSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => (
          <SignUp
            {...props}
            onLoginPress={() => props.navigation.navigate('Login')}
            onSignUpSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
