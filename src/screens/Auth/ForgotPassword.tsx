import React, { useState } from 'react';
import { Alert, SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';

interface ForgotPasswordProps {
  onNext: () => void;
}

const ForgotPassword = ({ onNext }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email.includes('@')) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    // Trigger password reset logic here
    console.log('Password reset link sent to:', email);
    onNext();
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.card}>
        <Text style={GlobalStyles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email below, we will send instructions to reset your password
        </Text>

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
});

export default ForgotPassword;
