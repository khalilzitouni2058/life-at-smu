import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeMain from "../features/HomePage/screens/HomeMain";
import ProfileStack from "./ProfileStack";
import Schedule from "../features/HomePage/screens/Schedule";
import ClubsScreen from "../features/Club/ClubsScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#007DA5",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          position: "absolute",
          bottom: 5,
          left: 10,
          right: 10,
          elevation: 10,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarItemStyle: {
          marginTop: 8,
          borderRadius: 16,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 4,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";
          if (route.name === "HomeMain") iconName = "home-outline";
          else if (route.name === "ClubsScreen")
            iconName = "people-circle-outline";
          else if (route.name === "Schedule") iconName = "calendar-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeMain"
        component={HomeMain}
        options={{ title: "Home" }}
      />
      <Tab.Screen name="Clubs" component={ClubsScreen} />
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
