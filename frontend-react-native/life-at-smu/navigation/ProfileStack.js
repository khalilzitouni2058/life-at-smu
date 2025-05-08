import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClubProfile from "../features/clubPage/ClubProfile";
import Profile from "../features/ProfilePage/screens/Profile";
import EventHistory from "../features/HomePage/screens/EventHistory";
import { useClub } from "../Context/ClubContext";
import { useUser } from "../Context/UserContext";
import BoardMembersScreen from "../features/clubPage/BoardMembersScreen";
import ClubRequests from "../features/ProfilePage/screens/ClubRequests";
import MyClubs from "../features/ProfilePage/screens/MyClubs";
import ReviewRequests from "../features/clubPage/ReviewRequests"; // ✅ include here
import ClubUpdate from "../features/clubPage/ClubUpdate";
import AddBoardMember from "../features/clubPage/AddBoardMember";
import EditBoardMember from "../features/clubPage/EditBoardMember";
import EditProfile from "../features/ProfilePage/screens/EditProfile";
import EventForm from "../features/Club/components/EventForm";

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
          <Stack.Screen name="AddBoardMember" component={AddBoardMember} />
          <Stack.Screen name="EditBoardMember" component={EditBoardMember} />
          <Stack.Screen name="EventForm" component={EventForm} />
          <Stack.Screen name="ReviewRequests" component={ReviewRequests} />
          <Stack.Screen name="ClubUpdate" component={ClubUpdate} />
          <Stack.Screen name="ClubRequests" component={ClubRequests} />
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
          <Stack.Screen name="EditProfile" component={EditProfile} />

          <Stack.Screen name="MyClubs" component={MyClubs} />
          <Stack.Screen name="ClubRequests" component={ClubRequests} />
          <Stack.Screen name="EventHistory" component={EventHistory} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ProfileStack;
