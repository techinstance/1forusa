import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type SignUp = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUp = ({ navigation }: SignUp) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#FFE0C9' }]}>
      <View style={GlobalStyles.card}>
        <View style={GlobalStyles.row}>
          <Text style={GlobalStyles.title}>Sign Up</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={GlobalStyles.link}>Log In →</Text>
          </TouchableOpacity>
        </View>

        <Input value={name} onChangeText={setName} placeholder="Name" />
        <Input value={email} onChangeText={setEmail} placeholder="Email" />
        <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />
        <PasswordInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Password Confirmation" />

        <Button title="Sign Up" onPress={() => navigation.navigate("Home")} />

        <View style={GlobalStyles.center}>
          <Text style={{ color: '#888', marginTop: 15 }}>Or sign up</Text>
          <TouchableOpacity style={GlobalStyles.googleButton}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>G</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
