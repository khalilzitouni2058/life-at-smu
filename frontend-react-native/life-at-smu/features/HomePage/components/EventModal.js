import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const EventModal = ({ visible, event, onClose }) => {
  if (!event) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={event.eventImage} style={styles.modalImage} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{event.eventName}</Text>
              <Text style={styles.modalDescription}>
                {event.eventDescription}
              </Text>
            </View>

            <View style={styles.modalDetails}>
              <View style={styles.detailRow}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color="#007da5"
                />
                <Text style={styles.modalText}>{event.eventDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color="#007da5" />
                <Text style={styles.modalText}>{event.eventLocation}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={18} color="#007da5" />
                <Text style={styles.modalText}>{event.eventTime}</Text>
              </View>
            </View>

            <View
              style={[
                styles.statusContainer,
                event.mandatoryParentalAgreement
                  ? styles.statusSuccess
                  : styles.statusError,
              ]}
            >
              <Ionicons
                name={
                  event.mandatoryParentalAgreement
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={20}
                color="white"
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>
                {event.mandatoryParentalAgreement
                  ? "Mandatory Parental Agreement"
                  : "No Parental Agreement Required"}
              </Text>
            </View>

            <View
              style={[
                styles.statusContainer,
                event.transportationProvided
                  ? styles.statusSuccess
                  : styles.statusError,
              ]}
            >
              <Ionicons
                name={
                  event.transportationProvided
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={20}
                color="white"
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>
                {event.transportationProvided
                  ? "Transportation Provided"
                  : "No Transportation Provided"}
              </Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Join the Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
    elevation: 10,
  },
  modalImage: {
    resizeMode: "cover",
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalHeader: {
    alignItems: "flex-start",
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
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
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
  statusSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "green",
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
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
  button: {
    backgroundColor: "#007BFF",
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
});

export default EventModal;
