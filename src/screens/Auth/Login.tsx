import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import { GlobalStyles } from '../common/GlobalStyle';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { login } from '../../Services/authServices';
type Login = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: Login) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      console.log('Login successful');

      // Check if user has completed interest selection
      const interestSelectionCompleted = await AsyncStorage.getItem(
        'interestSelectionCompleted',
      );

      if (interestSelectionCompleted === 'true') {
        navigation.navigate('Home');
      } else {
        navigation.navigate('InterestSelection');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const [remember, setRemember] = useState(false);

  return (
    <SafeAreaView
      style={[GlobalStyles.container, { backgroundColor: '#FFE0C9' }]}
    >
      <View style={GlobalStyles.card}>
        <View style={GlobalStyles.row}>
          {/* <Text style={GlobalStyles.title}>Log In</Text> */}
          <TouchableOpacity>
            <Text style={GlobalStyles.link}>Log in</Text>
          </TouchableOpacity>
        </View>

        <Input value={email} onChangeText={setEmail} placeholder="Email" />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />

        <View style={[GlobalStyles.row, { marginVertical: 10 }]}>
          <TouchableOpacity
            onPress={() => setRemember(!remember)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 3,
                borderWidth: 1,
                borderColor: '#FF6B00',
                backgroundColor: remember ? '#FF6B00' : '#fff',
                marginRight: 8,
              }}
            />
            <Text style={{ fontWeight: '500' }}>Remember</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[GlobalStyles.link, { color: '#FF6B00' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button title="Log In" onPress={handleLogin} />

        <View style={GlobalStyles.center}>
          <Text style={{ color: '#888', marginTop: 15 }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: '#FF6B00' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
