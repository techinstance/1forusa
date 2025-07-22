// Login.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import PasswordInput from '../common/PasswordInput';
import { GlobalStyles } from '../common/GlobalStyle';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Login = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({navigation}:Login) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.row}>
        <Text style={GlobalStyles.title}>Log In</Text>
        <TouchableOpacity onPress={
()=>{
  navigation.navigate("SignUp")
}
        }>
          <Text style={GlobalStyles.link}>Sign Up →</Text>
        </TouchableOpacity>
      </View>

      <Input value={email} onChangeText={setEmail} placeholder="Email" />
      <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />

      <View style={GlobalStyles.row}>
        <TouchableOpacity onPress={() => setRemember(!remember)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderWidth: 1,
              borderColor: '#000',
              backgroundColor: remember ? '#FF6B00' : '#fff',
              marginRight: 8,
            }}
          />
          <Text>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{

        }}>
          <Text style={GlobalStyles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <Button title="Log In" onPress={() => {
        navigation.navigate("Home");
      }} />

      <View style={GlobalStyles.center}>
        <Text>Or log in with:</Text>
        <Button title="G" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
};

export default Login;
