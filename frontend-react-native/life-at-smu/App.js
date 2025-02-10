import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './features/HomePage/screens/Home';
import Login from './features/HomePage/screens/Login';
import Profile from './features/ProfilePage/screens/Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import signup from './features/HomePage/screens/signup';
import EditProfile from './features/ProfilePage/screens/EditProfile';
import UpdateProfile from './features/clubPage/UpdateProfile';
import AddBoardMember from './features/clubPage/AddBoardMember'

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UpdateProfile">
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddBoardMember" component={AddBoardMember} />

        {/* <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />*/}
        {/* <Stack.Screen
          name="signup"
          component={signup}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
