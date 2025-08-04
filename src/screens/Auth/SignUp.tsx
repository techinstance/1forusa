import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signup } from '../../Services/authServices';
type SignUp = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({ navigation }: SignUp) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    signup(name, email, password, confirmPassword)
      .then(() => {
        console.log('Sign Up successful');
        navigation.navigate('InterestSelection');
      })
      .catch(error => {
        console.error('Sign Up error:', error);
      });
  };

  return (
    <SafeAreaView
      style={[GlobalStyles.container, { backgroundColor: '#FFE0C9' }]}
    >
      <View style={GlobalStyles.card}>
        <View style={GlobalStyles.row}>
          <Text style={GlobalStyles.title}></Text>
          <TouchableOpacity>
            <Text style={GlobalStyles.link}>Sing Up</Text>
          </TouchableOpacity>
        </View>

        <Input value={name} onChangeText={setName} placeholder="Name" />
        <Input value={email} onChangeText={setEmail} placeholder="Email" />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Password Confirmation"
        />

        <Button title="Sign Up" onPress={handleSignup} />

        <View style={GlobalStyles.center}>
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{ color: '#888', marginTop: 15 }}
          >
            Already have a account <Text style={GlobalStyles.link}>Log In</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
