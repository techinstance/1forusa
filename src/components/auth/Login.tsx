import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import GlobalStyles from '../common/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onSignUpPress?: () => void;
  onForgotPress?: () => void;
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ 
  onSignUpPress = () => {}, 
  onForgotPress = () => {},
  onLoginSuccess = () => {}
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const isGmail = (emailAddress: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailAddress.trim());

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail && !trimmedPassword) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    if (!trimmedEmail) {
      Alert.alert('Missing Email', 'Please enter your Gmail address.');
      return;
    }

    if (!isGmail(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Only valid Gmail addresses are allowed.');
      return;
    }

    if (!trimmedPassword) {
      Alert.alert('Missing Password', 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const { token } = await login({ email: trimmedEmail, password: trimmedPassword });
      if (remember) await AsyncStorage.setItem('token', token);
      await authLogin(token);
      Alert.alert('Welcome!', 'You are logged in 🎉');
      onLoginSuccess();
    } catch (e) {
      const error = e as Error;
      if (error.message.includes('User not found')) {
        Alert.alert(
          'Account Not Found',
          'This email hasn\'t been registered yet. Would you like to sign up?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: onSignUpPress },
          ]
        );
      } else if (error.message.includes('Invalid password')) {
        Alert.alert('Wrong Password', 'Please check your password and try again.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.row}>
        <Text style={GlobalStyles.title}>Log In</Text>
        <TouchableOpacity onPress={onSignUpPress}>
          <Text style={GlobalStyles.link}>Sign Up →</Text>
        </TouchableOpacity>
      </View>

      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={!email.trim() ? styles.errorBorder : undefined}
      />

      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={!password.trim() ? styles.errorBorder : undefined}
      />

      <View style={GlobalStyles.row}>
        <TouchableOpacity
          onPress={() => setRemember(!remember)}
          style={styles.rememberRow}
        >
          <View
            style={[
              styles.checkbox,
              remember ? styles.checkboxChecked : styles.checkboxUnchecked
            ]}
          />
          <Text>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onForgotPress}>
          <Text style={GlobalStyles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <Button
        title={loading ? 'Logging in…' : 'Log In'}
        onPress={handleLogin}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  errorBorder: {
    borderColor: 'red',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#FF6B00',
  },
  checkboxUnchecked: {
    backgroundColor: '#fff',
  },
});

export default Login;
