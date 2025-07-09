import React, { useState } from 'react';
import { SafeAreaView, Text, Alert, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import GlobalStyles from '../common/GlobalStyle';
import { verifyOtp } from '../../api/auth';

interface OTPVerificationProps {
  email: string;
  onSuccess?: (otp: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onSuccess = () => {} 
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      Alert.alert('Verified!', 'OTP is correct. You can now reset your password.');
      onSuccess(otp);
    } catch (e) {
      const error = e as Error;
      Alert.alert('Invalid OTP', error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {email}
      </Text>

      <Input
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter 6-digit OTP"
        keyboardType="numeric"
        maxLength={6}
      />

      <Button
        title={loading ? 'Verifying...' : 'Verify OTP'}
        onPress={handleSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default OTPVerification;
