import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import Home from "./screens/Home";
import Activites from "./screens/Activites";
import Profile from "./screens/Profile";
import Social from "./screens/Social";

export type RootStackParamList = {
  Home: undefined;
  Social: undefined;
  Activites: undefined;
  Profile: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator onAuthSuccess={() => {}} />;
  }

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Social" component={Social} />
      <Stack.Screen name="Activites" component={Activites} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;