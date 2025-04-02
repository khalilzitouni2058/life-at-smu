import { Text, View, StyleSheet, Dimensions, FlatList, Image ,Modal,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "expo-constants";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;
const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

const EventDisplay = ({ selectedDate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEvents([]); 
    const fetchEventsForDate = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://${ipAddress}:8000/api/auth/events/${
            new Date(selectedDate).toISOString().split("T")[0]
          }`
        );
        setEvents(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // No events for this day
          setEvents([]); // ✅ explicitly reset
        } else {
          console.error("Error fetching events:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) fetchEventsForDate();
  }, [selectedDate]);

  const renderEvent = ({ item }) => (
    <>
      <View style={styles.container2}>
        <Image
          source={{ uri: item.club?.profilePicture }}
          style={styles.circularImage}
        />
        <Text style={styles.text}>{item.club?.clubName}</Text>
      </View>

      {/* Clickable Event Container */}
      <TouchableOpacity onPress={() => openModal(item)}>
        <View style={styles.eventContainer}>
              <Image source={item.eventImage} style={styles.eventImageBackground} />
          <View style={styles.eventTextContainer}>
            <Text style={styles.eventTitle}>{item.eventName}</Text>

          <View style={styles.row}>
            <Ionicons
              name="calendar-clear-outline"
              color={"black"}
              size={14}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.eventTime}>{item.eventDate}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              color={"black"}
              size={14}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.eventTime}>{item.eventLocation}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="time-outline"
              color={"black"}
              size={14}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.eventTime}>{item.eventTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007DA5" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      ) : (
        <Text style={styles.text3}>No events found for this day.</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  eventImageBackground: {
    resizeMode: "repeat",
    height: 100,
    width: 350,
  },
  container2: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  circularImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  text: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  text3: {
    marginTop: 10,
    color: "black",
    fontSize: 32,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  container: {
    flex: 1,
    backgroundColor: "#E9F8FF",
    padding: 12,
    width: screenWidth,
  },
  eventContainer: {
    backgroundColor: "white",
    marginVertical: 0,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  eventTextContainer: {
    marginTop: 10,
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventTime: {
    color: "black",
    fontSize: 14,
    opacity: 0.9,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007DA5",
  },
});

export default EventDisplay;
