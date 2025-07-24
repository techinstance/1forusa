import React, { useState } from 'react';
import { Alert, SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Button from '../common/Button';
import PasswordInput from '../common/PasswordInput'; // Assumed you have this already
import { GlobalStyles } from '../common/GlobalStyle';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    }

    // Proceed with password reset logic
    console.log('Password reset to:', newPassword);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.card}>
        <Text style={GlobalStyles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password below</Text>

        <PasswordInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button title="Reset Your Password" onPress={handleReset} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    marginTop: 8,
  },
});

export default ResetPassword;
