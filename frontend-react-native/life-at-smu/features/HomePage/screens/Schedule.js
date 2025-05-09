import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import Constants from "expo-constants";
import EventModal from "../components/EventModal";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState("2025-03-28");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allEventDates, setAllEventDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };
  const renderCustomHeader = (date) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    });
    return (
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "black",
          marginBottom: 10,
        }}
      >
        {formatter.format(new Date(date))}
      </Text>
    );
  };

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  const fetchEventsByDate = async (date) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://${ipAddress}:8000/api/auth/events/${date}`
      );
      setEvents(res.data);
    } catch (err) {
      setEvents([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEventDates = async () => {
    try {
      const res = await axios.get(`http://${ipAddress}:8000/api/auth/events`);
      const dateMap = {};

      res.data.forEach((event) => {
        const date = event.eventDate;
        if (!dateMap[date]) {
          dateMap[date] = {
            marked: true,
            dots: [{ color: "#FF6B6B" }],
          };
        }
      });

      setAllEventDates(dateMap);
    } catch (err) {
      console.error("Error fetching all events:", err);
    }
  };

  useEffect(() => {
    fetchEventsByDate(selectedDate);
    fetchAllEventDates();
  }, [selectedDate]);

  const mergedMarkedDates = {
    ...allEventDates,
    [selectedDate]: {
      ...(allEventDates[selectedDate] || {}),
      selected: true,
      selectedColor: "#FF6B6B",
    },
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.itemContainer}>
        <Ionicons
          name="calendar-outline"
          size={24}
          color="#FF6B6B"
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.eventName}</Text>
          <Text style={styles.subText}>
            {item.eventTime} | {item.eventLocation}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>My Schedule</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={mergedMarkedDates}
        markingType={"multi-dot"}
        style={styles.calendar}
        theme={{
          calendarBackground: "#F4F6FA",
          selectedDayBackgroundColor: "#FF6B6B",
          selectedDayTextColor: "#fff",
          todayTextColor: "#FF6B6B",
          dayTextColor: "#333",
          textDisabledColor: "#ccc",
        }}
        renderHeader={(date) => renderCustomHeader(date)}
      />

      <Text style={styles.header}>Schedule for {selectedDate}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.noEvents}>No events for this day</Text>
          }
        />
      )}
      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={closeModal}
      />
    </View>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  calendar: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  list: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007DA5",
    alignSelf: "center",
    marginBottom: 12,
  },
  subText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  noEvents: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
    fontStyle: "italic",
  },
  backWrapper: {
    borderRadius: 50,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
});
