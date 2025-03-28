import React from "react";
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
import EventForm from "./features/Club/components/EventForm";

// Tabs
import TabNavigator from "./navigation/TabNavigator"; // <-- Create this file

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <ClubProvider>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
          >
            {/* Auth Screens */}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="signup" component={Signup} />

            {/* Main App with Tabs */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />

            {/* Other Screens */}
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ClubProfile" component={ClubProfile} />
            <Stack.Screen name="ClubUpdate" component={ClubUpdate} />
            <Stack.Screen name="AddBoardMember" component={AddBoardMember} />
            <Stack.Screen name="EditBoardMember" component={EditBoardMember} />
            <Stack.Screen name="eventForm" component={EventForm} />
          </Stack.Navigator>
        </ClubProvider>
      </UserProvider>
    </NavigationContainer>
  );
}
