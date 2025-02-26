import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './features/HomePage/screens/Home';
import Login from './features/HomePage/screens/Login';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './Context/UserContext';
import signup from './features/HomePage/screens/signup';
import Profile from './features/ProfilePage/screens/Profile';
import HomeMain from './features/HomePage/screens/HomeMain';
import EditProfile from './features/ProfilePage/screens/EditProfile';

export default function App() {

const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>

      <UserProvider>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
      <Stack.Screen name="signup" component={signup}  options={{ headerShown: false }} />
      
      <Stack.Screen name="HomeMain" component={HomeMain}  options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile}  options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile}  options={{ headerShown: false }} />



    </Stack.Navigator>
    </UserProvider>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
