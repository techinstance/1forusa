import { View,Text,StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack"

import Home from "./screens/Home";
import Activites from "./screens/Activites";
import Profile from "./screens/Profile";
import Socail from "./screens/Socail";
export type RootStackParamList = {
  Home : undefined;
  Socail : undefined;
  Activites : undefined;
  Profile : undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () =>{
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Socail" component = {Socail} />
      <Stack.Screen name="Activites" component = {Activites} />
      <Stack.Screen name="Profile" component = {Profile} />
     </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;

const styles = StyleSheet.create({

})