import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image
} from "react-native";
import { useClub } from "../../../Context/ClubContext";
import CalendarView from "../components/CalendarView";
import EventDisplay from "./EventDisplay";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons' // or use FontAwesome, Ionicons, etc.


const Addproposal = () => {
  const navigation = useNavigation(); // Get navigation from context

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("eventForm")}
      >
        <Text style={styles.text2}>Create an event proposal</Text>
      </Pressable>
    </View>
  );
};

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

  // Get 14 days from start of current week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
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
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#333"
            marginRight={12}
          />
        </TouchableOpacity>
      </View>
      {drawerVisible && (
        <View
          entering={SlideInRight.duration(300)}
          exiting={SlideOutRight.duration(300)}
          style={styles.drawer}
        >
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
      <Text style={styles.title}> Upcoming Events</Text>

      <TouchableOpacity style={styles.buttonAi} onPress={() => navigation.navigate('AskAiButton')}>
        <Icon name="robot-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
      {clubId && <Addproposal />}

      <EventDisplay selectedDate={selectedDate} se  archQuery={searchQuery} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 10,
    backgroundColor: "#F4F6FA",
    padding:8,
    borderRadius:10
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e1e1e',
  },
  buttonAi: {
    backgroundColor: '#4a90e2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    marginLeft:60
  },
  button: {
    backgroundColor: "#E9F8FC",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 0,
    alignItems: "center",
  },
  text2: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "right",
    padding: 10,
  },
  text: {
    color: "black",
    fontSize: 2,
    fontWeight: "bold",
  },
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
    backgroundColor: "#F4F6FA",

    alignItems: "center",
  },
});

export default HomeMain;
