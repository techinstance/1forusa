<<<<<<< HEAD
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Activites from './screens/Activites';
import Profile from './screens/Profile';
import Socail from './screens/Socail';
import Splash from './screens/SplashScreen';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
=======
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from 'react';

import Home from "./screens/Home";
import Activities from "./Pages/Activities";
import Profile from "./Pages/Profile";
import Social from "./Pages/Social"
import Splash from "./screens/SplashScreen";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";
import TileGridScreen from './components/TileGridScreen';
>>>>>>> 0bc8d40 (Initial commit to Siddhant branch)


export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Social: undefined;
  Activities: undefined;
  Profile: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Social" component={Social} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Activities" component={Activities} />
        <Stack.Screen name="Profile" component={Profile} />
        <TileGridScreen />;
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
