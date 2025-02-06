import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './features/HomePage/screens/Home';
import Login from './features/HomePage/screens/Login';
import Profile from './features/ProfilePage/screens/Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import signup from './features/HomePage/screens/signup';
import EditProfile from './features/ProfilePage/screens/EditProfile';
export default function App() {

const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
      <Stack.Screen name="signup" component={signup}  options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile}  options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile}  options={{ headerShown: false }} />


    </Stack.Navigator>
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
