import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Home from "./screens/Home";
import Activites from "./screens/Activites";
import Profile from "./screens/Profile";

import Splash from "./screens/SplashScreen";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";
import SocialPost from "./screens/SocialPost";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  SocialPost: { reflection?: string };
  Activites: undefined;
  Profile: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SocialPost" component={SocialPost} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Activites" component={Activites} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;