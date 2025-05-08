import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { useClub } from "../../../Context/ClubContext";
import CalendarView from "../components/CalendarView";
import EventDisplay from "./EventDisplay";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HomeMain = () => {
  const { clubId } = useClub() || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [eventsByDate, setEventsByDate] = useState({});
  const navigation = useNavigation();

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://${ipAddress}:8000/api/auth/events`);
        const grouped = res.data.reduce((acc, event) => {
          const key = event.eventDate;
          if (!acc[key]) acc[key] = [];
          acc[key].push(event);
          return acc;
        }, {});
        setEventsByDate(grouped);
      } catch (error) {
        console.error("Failed to fetch events:", error.message);
      }
    };
    fetchEvents();
  }, []);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const twoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    const todayISO = new Date().toISOString().split("T")[0];
    const todayIndex = twoWeeks.findIndex(
      (d) => d.toISOString().split("T")[0] === todayISO
    );
    setSelectedIndex(todayIndex);
    setSelectedDate(todayISO);
  }, []);

  const eventsToday = eventsByDate[selectedDate] || [];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search events..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <TouchableOpacity onPress={() => setDrawerVisible(!drawerVisible)}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#333"
            marginRight={12}
          />
        </TouchableOpacity>
      </View>

      {drawerVisible && (
        <View style={styles.drawer}>
          <Text style={styles.drawerText}>hello</Text>
        </View>
      )}

      <CalendarView
        days={twoWeeks}
        selectedIndex={selectedIndex}
        setSelectedIndex={(index) => {
          setSelectedIndex(index);
          setSelectedDate(twoWeeks[index].toISOString().split("T")[0]);
        }}
        eventsByDate={eventsByDate}
      />

      <View style={styles.headerContainer}>
        {eventsToday.length > 0 ? (
          <Text style={styles.title}>Upcoming Events</Text>
        ) : (
          <View style={{ width: 160 }} /> // ← reserve space when title is hidden
        )}
        <TouchableOpacity
          style={styles.buttonAi}
          onPress={() => navigation.navigate("AskAiButton")}
        >
          <Icon name="robot-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {eventsToday.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons
            name="calendar-outline"
            size={100}
            color="#ccc"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.emptyText}>
            Looks like you have no events today. Stay tuned!
          </Text>
          {clubId && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("eventForm")}
            >
              <Text style={styles.secondaryBtnText}>Plan your event</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <EventDisplay selectedDate={selectedDate} searchQuery={searchQuery} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 10,
    backgroundColor: "#F4F6FA",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e1e1e",
  },
  buttonAi: {
    backgroundColor: "#4a90e2",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 60,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
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
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingHorizontal: 12,
    paddingBottom: 60,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginVertical: 16,
  },
  secondaryBtn: {
    backgroundColor: "#E9F8FC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  secondaryBtnText: {
    color: "#007DA5",
    fontWeight: "600",
    fontSize: 16,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    marginBottom: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
});

export default HomeMain;
