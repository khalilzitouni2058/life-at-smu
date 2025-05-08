import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "expo-constants";
import axios from "axios";
import EventModal from "../components/EventModal"; // update the path accordingly

const screenWidth = Dimensions.get("window").width;
const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

const EventDisplay = ({ selectedDate, searchQuery = "" }) => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [showEvent, setshowEvent] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const openModal = (event) => {
    setSelectedEvent(event);
    console.log(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    setEvents([]); // 🔁 clear previous events
    const fetchEventsForDate = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://${ipAddress}:8000/api/auth/events/${selectedDate}`
        );
        setEvents(response.data);
        setshowEvent(true);
      } catch (error) {
        if (error.response?.status === 404) {
          // No events for this day
          setEvents([]);
          setMessage("No events found for the specified date.");
          setshowEvent(false);
        } else {
          console.error("Error fetching events:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) fetchEventsForDate();
  }, [selectedDate]);

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.eventName?.toLowerCase().includes(query) ||
      event.eventLocation?.toLowerCase().includes(query) ||
      event.club?.clubName?.toLowerCase().includes(query)
    );
  });

  const renderEvent = ({ item }) => (
    <>
      <View style={styles.container2}>
        <Image
          source={{
            uri:
              item.club?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/128/16745/16745734.png",
          }}
          style={styles.circularImage}
        />
        <Text style={styles.text}>{item.club?.clubName || "Unknown Club"}</Text>
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
        </View>
      </TouchableOpacity>
    </>
  );

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#007DA5" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 2 }}
        />
      ) : (
        <View style={styles.noEventsContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/742/742751.png", // ✅ Cute image that loads correctly
            }}
            style={styles.noEventsIcon}
            resizeMode="contain"
          />
          <Text style={styles.noEventsText}>No events found today!</Text>
        </View>
      )}

      {/* Overlay Modal */}
      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={closeModal}
      />
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
    backgroundColor: "#F4F6FA",

    padding: 12,
    width: screenWidth,
  },
  eventContainer: {
    backgroundColor: "white",
    marginVertical: 0,
    marginBottom: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: "center", // <- center horizontally
    justifyContent: "center", // <- center vertically if needed
    padding: 10, // optional spacing
  },
  eventTextContainer: {
    marginTop: 10,
    alignItems: "center", // center inside container
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
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10, // Adds a shadow on Android
  },
  closeButton: {
    position: "absolute",
    zIndex: 1,
    top: 10,
    right: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 6,
  },
  modalImage: {
    resizeMode: "cover",
    width: "100%",
    height: "150",
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 22,
  },
  modalText: {
    fontSize: 18,
    color: "#444",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  modalOverlay: {
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "90%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#007BFF", // Blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "90%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.2)", // Light green background
    borderColor: "green",
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: "rgba(244, 67, 54, 0.2)", // Light red background
    borderColor: "red",
    borderWidth: 1,
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  modalleft: {
    right: 80,
  },
  modalHeader: {
    alignItems: "flex-start", // Aligns text to the left
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "left",
  },
  modalDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "left",
    marginTop: 5,
  },
  modalDetails: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    alignItems: "flex-start",
    marginBottom: 10, // Ensures text & icons are aligned left
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8, // Ensures spacing from the icon
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    padding: 20,
  },

  noEventsIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
    opacity: 0.8,
  },

  noEventsText: {
    fontSize: 16,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default EventDisplay;
