import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack"

import Home from "./screens/Home";
import Activites from "./screens/Activites";
import Profile from "./screens/Profile";
import Social from "./screens/Social";
export type RootStackParamList = {
  Home : undefined;
  Social : undefined;
  Activites : undefined;
  Profile : undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () =>{
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Social" component = {Social} />
      <Stack.Screen name="Activites" component = {Activites} />
      <Stack.Screen name="Profile" component = {Profile} />
     </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;