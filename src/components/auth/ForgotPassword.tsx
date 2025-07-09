import React, { useState } from 'react';
import { SafeAreaView, Text, Alert } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import GlobalStyles from '../common/GlobalStyle';
import { forgotPassword } from '../../api/auth';

interface ForgotPasswordProps {
  onNext?: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNext = () => {} }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isGmail = (emailAddress: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailAddress.trim());

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!isGmail(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Only valid Gmail addresses are allowed.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email: trimmedEmail });
      Alert.alert('OTP sent!', 'Check your email for the verification code.');
      onNext(trimmedEmail);
    } catch (e) {
      const error = e as Error;
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Forgot Password</Text>

      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your registered Gmail address"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Button
        title={loading ? 'Sending OTP...' : 'Send OTP'}
        onPress={handleSubmit}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;
