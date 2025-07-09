import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import GlobalStyles from '../common/GlobalStyle';
import { resetPassword } from '../../api/auth';

const generateStrongPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const isStrongPassword = (value: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);

interface ResetPasswordProps {
  email: string;
  otp: string;
  onDone?: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email, otp, onDone = () => {} }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (): string => {
    if (!newPassword) return 'Weak';
    if (newPassword.length < 8) return 'Weak';
    if (isStrongPassword(newPassword)) return 'Strong';
    return 'Medium';
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (getPasswordStrength() === 'Weak') {
      Alert.alert('Weak Password', 'Password must include uppercase, lowercase, number & symbol (min 8 chars)');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      Alert.alert('Success', 'Password reset successful! You can now login with your new password.');
      onDone();
    } catch (e) {
      const error = e as Error;
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const strengthColor = strength === 'Strong' ? '#4CAF50' : strength === 'Medium' ? '#FF9800' : '#F44336';

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={GlobalStyles.title}>Reset Password</Text>

        <View style={[
          styles.inputWrapper, 
          newPassword ? (isStrongPassword(newPassword) ? styles.success : styles.error) : undefined
        ]}>
          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
          />
        </View>

        <View style={styles.rowBetween}>
          <Text style={[styles.passwordHint, { color: strengthColor }]}>
            Strength: {strength}
          </Text>
          <TouchableOpacity onPress={() => setNewPassword(generateStrongPassword())}>
            <Text style={styles.generateBtn}>Generate Strong Password</Text>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.inputWrapper, 
          confirmPassword ? (confirmPassword === newPassword ? styles.success : styles.error) : undefined
        ]}>
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
          />
        </View>

        <Button 
          title={loading ? 'Resetting...' : 'Reset Password'} 
          onPress={handleReset} 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  success: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 6,
  },
  error: {
    borderColor: '#F44336',
    borderWidth: 1,
    borderRadius: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  passwordHint: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  generateBtn: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ResetPassword;
