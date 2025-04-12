import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./Context/UserContext";
import { ClubProvider } from "./Context/ClubContext";

// Screens
import Home from "./features/HomePage/screens/Home";
import Login from "./features/HomePage/screens/Login";
import Signup from "./features/HomePage/screens/signup";
import Profile from "./features/ProfilePage/screens/Profile";
import EditProfile from "./features/ProfilePage/screens/EditProfile";
import ClubProfile from "./features/clubPage/ClubProfile";
import ClubUpdate from "./features/clubPage/ClubUpdate";
import AddBoardMember from "./features/clubPage/AddBoardMember";
import EditBoardMember from "./features/clubPage/EditBoardMember";
import ClubsScreen from "./features/Club/ClubsScreen";
import ClubDetailsScreen from "./features/Club/ClubDetailsScreen";
import HomeMain from "./features/HomePage/screens/HomeMain";
import EventForm from "./features/Club/components/EventForm";
import MyClubs from "./features/ProfilePage/screens/MyClubs";

const Stack = createNativeStackNavigator();

import TabNavigator from "./navigation/TabNavigator"; // <-- Create this file

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <ClubProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
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
            <Stack.Screen
              name="eventForm"
              component={EventForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signup"
              component={Signup}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeMain"
              component={HomeMain}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClubsScreen"
              component={ClubsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClubDetailsScreen"
              component={ClubDetailsScreen}
              options={{ headerShown: false, presentation: "card" }}
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
              name="MyClubs"
              component={MyClubs}
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
