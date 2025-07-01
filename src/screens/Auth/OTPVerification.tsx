import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OTPVerification = ({ onBack } : any) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (text : string, index : string) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={GlobalStyles.title}>Verify OTP</Text>
      <Text style={{ marginBottom: 10 }}>Enter OTP code we've sent to your email</Text>
      <View style={styles.otpRow}>
        {otp.map((val, idx) => (
          <TextInput
            key={idx}
            style={styles.otpInput}
            value={val}
            onChangeText={(text) => handleChange(text, idx)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      <Button title="Submit" onPress={() => {}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
    marginHorizontal: 3,
  },
  backButton: {
    marginBottom: 20,
  },
});

export default OTPVerification;
