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

const screenWidth = Dimensions.get("window").width;
const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";
  
const EventDisplay = ({ selectedDate }) => {
  const [events,setEvents]  = useState([]);
  const [message,setMessage] = useState("");
  const [showEvent, setshowEvent] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);


  const openModal = (event) => {
    setSelectedEvent(event);
    console.log(event)
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
          `http://${ipAddress}:8000/api/auth/events/${
            new Date(selectedDate).toISOString().split("T")[0]
          }`
        );
        setEvents(response.data);
        setshowEvent(true)
      } catch (error) {
        if (error.response?.status === 404) {
          // No events for this day
          setEvents([]); // ✅ explicitly reset
          setMessage("No events found for the specified date.");
          setshowEvent(false)
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
        <Image source={{ uri: item.club.profilePicture }} style={styles.circularImage} />
        <Text style={styles.text}>{item.club.clubName}</Text>
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
        <View>
          <Text style={styles.text3}>No events found for this day.</Text>
        </View>
      )}

      {/* Overlay Modal */}
      <Modal visible={modalVisible} transparent animationType="slide"  >
        <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            

            {selectedEvent && (
              <>
                <Image source={ selectedEvent.eventImage } style={styles.modalImage} />
                <View style={styles.modalHeader}>
  <Text style={styles.modalTitle}>{selectedEvent.eventName}</Text>
  <Text style={styles.modalDescription}>{selectedEvent.eventDescription}</Text>
</View>
<View style={styles.modalleft}>
<View style={styles.modalDetails}>
  <View style={styles.detailRow}>
    <Ionicons name="calendar-clear-outline" size={18} color="#007da5" />
    <Text style={styles.modalText}>{selectedEvent.eventDate}</Text>
  </View>

  <View style={styles.detailRow}>
    <Ionicons name="location-outline" size={18} color="#007da5" />
    <Text style={styles.modalText}>{selectedEvent.eventLocation}</Text>
  </View>

  <View style={styles.detailRow}>
    <Ionicons name="time-outline" size={18} color="#007da5" />
    <Text style={styles.modalText}>{selectedEvent.eventTime}</Text>
  </View>
</View>
</View>


                <View style={[styles.statusContainer, selectedEvent.mandatoryParentalAgreement ? styles.statusSuccess : styles.statusError]}>
  <Ionicons 
    name={selectedEvent.mandatoryParentalAgreement ? "checkmark-circle" : "close-circle"} 
    size={20} 
    color="white" 
    style={styles.statusIcon} 
  /> 
  <Text style={styles.statusText}>
    {selectedEvent.mandatoryParentalAgreement ? "Mandatory Parental Agreement" : "No Parental Agreement Required"}
  </Text>
</View>

<View style={[styles.statusContainer, selectedEvent.transportationProvided ? styles.statusSuccess : styles.statusError]}>
  <Ionicons 
    name={selectedEvent.transportationProvided ? "checkmark-circle" : "close-circle"} 
    size={20} 
    color="white" 
    style={styles.statusIcon} 
  /> 
  <Text style={styles.statusText}>
    {selectedEvent.transportationProvided ? "Transportation Provided" : "No Transportation Provided"}
  </Text>
</View>

<TouchableOpacity style={styles.button}>
  <Text style={styles.buttonText}>Join the Event</Text>
</TouchableOpacity>

              </>
            )}
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10, // Adds a shadow on Android
  },
  closeButton: {
    position: 'absolute',
    zIndex:1,
    top: 10,
    right: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 6,
  },
  modalImage: {
    resizeMode:"cover",
    width: '100%',
    height:"150",
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  modalText: {
    fontSize: 18,
    color: '#444',
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "90%",
    alignSelf: "center",
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
  },
  modalleft:{
    right:80,
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
    marginBottom:10, // Ensures text & icons are aligned left
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
});

export default EventDisplay;
