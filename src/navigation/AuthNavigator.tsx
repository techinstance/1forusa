import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import ForgotPassword from '../components/auth/ForgotPassword';
import OTPVerification from '../components/auth/OTPVerification';
import ResetPassword from '../components/auth/ResetPassword';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string; otp: string };
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
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FF6B00',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login"
        options={{ headerShown: false }}
      >
        {(props) => (
          <Login
            {...props}
            onSignUpPress={() => props.navigation.navigate('SignUp')}
            onForgotPress={() => props.navigation.navigate('ForgotPassword')}
            onLoginSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="SignUp"
        options={{ headerShown: false }}
      >
        {(props) => (
          <SignUp
            {...props}
            onLoginPress={() => props.navigation.navigate('Login')}
            onSignUpSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="ForgotPassword"
        options={{ title: 'Forgot Password' }}
      >
        {(props) => (
          <ForgotPassword
            {...props}
            onNext={(email) => props.navigation.navigate('OTPVerification', { email })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="OTPVerification"
        options={{ title: 'Verify OTP' }}
      >
        {(props) => (
          <OTPVerification
            {...props}
            email={props.route.params.email}
            onSuccess={(otp) => props.navigation.navigate('ResetPassword', { 
              email: props.route.params.email,
              otp
            })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="ResetPassword"
        options={{ title: 'Reset Password' }}
      >
        {(props) => (
          <ResetPassword
            {...props}
            email={props.route.params.email}
            otp={props.route.params.otp}
            onDone={() => props.navigation.navigate('Login')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
