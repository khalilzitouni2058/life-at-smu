import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../../../Context/UserContext";
import Footer from "../components/Footer";
import CalendarView from "../components/CalendarView";
import EventDisplay from "./EventDisplay";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

const HomeMain = () => {
  const { user } = useUser(); // Accessing user data from context
  const [now, setNow] = useState(new Date());
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [lastDayOfMonth, setLastDayOfMonth] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  );
  const [selectedIndex, setSelectedIndex] = useState(now.getDate() - 1);

  const getRandomColor = (colors) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search events..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => setDrawerVisible(!drawerVisible)}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {drawerVisible && (
        <Animated.View
          entering={SlideInRight.duration(300)}
          exiting={SlideOutRight.duration(300)}
          style={styles.drawer}
        >
          <Text style={styles.drawerText}>hellob </Text>
        </Animated.View>
      )}
      <CalendarView
        lastDayOfMonth={lastDayOfMonth}
        firstDayOfMonth={firstDayOfMonth}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <Text style={styles.text}>Events</Text>
      <EventDisplay />

      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 40,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginLeft: 8,
    backgroundColor: "#fff",
  },
  drawer: {
    zIndex: 1,
    position: "absolute",
    right: 0,
    top: 70,
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  drawerText: {
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
  placeholder: {
    height: 200,
    backgroundColor: "#ddd",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007DA5",
    marginRight: "auto",
    marginLeft: "20",
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

export default HomeMain;
