import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';
import { register } from '../../api/auth';

interface SignUpProps {
  onLoginPress?: () => void;
  onSignUpSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ 
  onLoginPress = () => {},
  onSignUpSuccess = () => {}
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isStrongPassword = (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);

  const handleSignUp = async () => {
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!confirmPassword) missingFields.push('Password Confirmation');

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Fields',
        `Please fill in the following: ${missingFields.join(', ')}`
      );
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, confirmPassword });
      Alert.alert('Account created!', 'You can now log in.');
      onSignUpSuccess();
      onLoginPress();
    } catch (e) {
      const error = e as Error;
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={GlobalStyles.row}>
          <Text style={GlobalStyles.title}>Sign Up</Text>
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={GlobalStyles.link}>Log In →</Text>
          </TouchableOpacity>
        </View>

        <Input
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          style={!name ? styles.errorBorder : undefined}
        />

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={!email || !isValidEmail(email) ? styles.errorBorder : undefined}
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={!password || !isStrongPassword(password) ? styles.errorBorder : undefined}
        />

        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          style={!confirmPassword || password !== confirmPassword ? styles.errorBorder : undefined}
        />

        <Text style={styles.passwordHint}>
          Password must be at least 8 characters with uppercase, lowercase, number, and special character.
        </Text>

        <Button
          title={loading ? 'Creating Account…' : 'Sign Up'}
          onPress={handleSignUp}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorBorder: {
    borderColor: 'red',
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    marginTop: -10,
  },
});

export default SignUp;
