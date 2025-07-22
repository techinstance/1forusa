import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';

const ResetPassword = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={{ marginBottom: 10 }}>Enter new password</Text>
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
      <Button title="Reset your password" onPress={() => {}} />
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
});

export default ResetPassword;