import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Home from "./screens/Home";
import Activites from "./screens/Activites";
import Profile from "./screens/Profile";
import Socail from "./screens/Socail";
import Splash from "./screens/SplashScreen";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Socail: undefined;
  Activites: undefined;
  Profile: undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Splash" screenOptions={{
        headerShown: false
      }} >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Socail" component={Socail} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Activites" component={Activites} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;

// const styles = StyleSheet.create({

// })