import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';

const ForgotPassword = ({ onNext }) => {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Forgot Password</Text>
      <Text style={{ marginBottom: 10 }}>
        Enter your email below, we will send instruction to reset your password
      </Text>
      <Input value={email} onChangeText={setEmail} placeholder="Email" />
      <Button title="Submit" onPress={onNext} />
    </SafeAreaView>
  );
};

export default ForgotPassword;
