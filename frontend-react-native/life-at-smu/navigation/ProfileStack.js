import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClubProfile from "../features/clubPage/ClubProfile";
import Profile from "../features/ProfilePage/screens/Profile";
import EventHistory from "../features/HomePage/screens/EventHistory";
import { useClub } from "../Context/ClubContext";
import { useUser } from "../Context/UserContext";
import BoardMembersScreen from "../features/clubPage/BoardMembersScreen";

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  const { clubId } = useClub();
  const { user } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {clubId ? (
        <>
          <Stack.Screen
            name="ClubProfile"
            component={ClubProfile}
            initialParams={{ id: clubId }}
          />
          {/* Board Members Screen for Clubs */}
          <Stack.Screen
            name="BoardMembersScreen"
            component={BoardMembersScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="UserProfile"
            component={Profile}
            initialParams={{ id: user?.id }}
          />
          <Stack.Screen name="EventHistory" component={EventHistory} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ProfileStack;
