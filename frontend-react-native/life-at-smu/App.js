import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './features/HomePage/screens/Home';
import Login from './features/HomePage/screens/Login';
import Profile from './features/ProfilePage/screens/Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './Context/UserContext';
import signup from './features/HomePage/screens/signup';

import HomeMain from './features/HomePage/screens/HomeMain';
;

export default function App() {

const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>

      <UserProvider>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
      <Stack.Screen name="signup" component={signup}  options={{ headerShown: false }} />
      
      <Stack.Screen name="HomeMain" component={HomeMain}  options={{ headerShown: false }} />
      



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
