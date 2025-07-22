import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Use for CLI

interface OTPVerificationProps {
  onBack: () => void;
}

const OTPVerification = ({ onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={GlobalStyles.title}>Verify OTP</Text>
      <Text style={{ marginBottom: 10, textAlign: 'center' }}>
        Enter the OTP code we sent to your email
      </Text>

      <View style={styles.otpRow}>
        {otp.map((val, idx) => (
          <TextInput
            key={idx}
            style={styles.otpInput}
            value={val}
            onChangeText={(text) => handleChange(text, idx)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>

      <Button title="Submit" onPress={() => {
        const code = otp.join('');
        console.log("Submitted OTP:", code);
      }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 18,
    width: 45,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
});

export default OTPVerification;
