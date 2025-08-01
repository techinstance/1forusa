import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Activities from './Pages/Activities';
import Profile from './Pages/Profile';
import Social from './Pages/Social';
import Splash from './screens/SplashScreen';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import TileGrid from './screens/TileGrid';
import TileGridDemo from './screens/TileGridDemo';
import BurgerHeader from './components/BurgerHeader';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Social: undefined;
  Activities: undefined;
  Profile: undefined;
  TileGrid: undefined;
  TileGridDemo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Header components
const HomeHeader = () => <BurgerHeader title="Home" />;
const SocialHeader = () => <BurgerHeader title="Social Media" />;
const ActivitiesHeader = () => <BurgerHeader title="Activities" />;
const ProfileHeader = () => <BurgerHeader title="Profile" />;
const TileGridHeader = () => <BurgerHeader title="Wellness Journey" />;
const TileGridDemoHeader = () => (
  <BurgerHeader title="Tile Demo" showBack={true} />
);

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
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            header: HomeHeader,
          }}
        />
        <Stack.Screen
          name="Social"
          component={Social}
          options={{
            headerShown: true,
            header: SocialHeader,
          }}
        />
        <Stack.Screen
          name="Activities"
          component={Activities}
          options={{
            headerShown: true,
            header: ActivitiesHeader,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            header: ProfileHeader,
          }}
        />
        <Stack.Screen
          name="TileGrid"
          component={TileGrid}
          options={{
            headerShown: true,
            header: TileGridHeader,
          }}
        />
        <Stack.Screen
          name="TileGridDemo"
          component={TileGridDemo}
          options={{
            headerShown: true,
            header: TileGridDemoHeader,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
