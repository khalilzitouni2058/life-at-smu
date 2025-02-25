
import EventForm from './features/Club/components/EventForm';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./features/HomePage/screens/Home";
import Login from "./features/HomePage/screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./Context/UserContext";
import { ClubProvider } from "./Context/ClubContext";
import signup from "./features/HomePage/screens/signup";
import Profile from "./features/ProfilePage/screens/Profile";
import HomeMain from "./features/HomePage/screens/HomeMain";
import EditProfile from "./features/ProfilePage/screens/EditProfile";
import AddBoardMember from "./features/clubPage/AddBoardMember";
import ClubProfile from "./features/clubPage/ClubProfile";
import ClubUpdate from "./features/clubPage/ClubUpdate";
import EditBoardMember from "./features/clubPage/EditBoardMember";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <UserProvider>

        <ClubProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
<Stack.Screen name="eventForm" component={EventForm}  options={{ headerShown: false }} />
            <Stack.Screen
              name="signup"
              component={signup}
              options={{ headerShown: false }}
            />


            <Stack.Screen
              name="HomeMain"
              component={HomeMain}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClubProfile"
              component={ClubProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClubUpdate"
              component={ClubUpdate}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddBoardMember"
              component={AddBoardMember}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditBoardMember"
              component={EditBoardMember}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </ClubProvider>
      </UserProvider>
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
