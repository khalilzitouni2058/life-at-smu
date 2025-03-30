import { Text, View, StyleSheet, Dimensions, FlatList, Image  ,Modal,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../../Context/UserContext';
import Constants from "expo-constants";

const screenWidth = Dimensions.get('window').width;
const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

const EventDisplay = () => {
  const [events,setEvents]  = useState([]);
  const [message,setMessage] = useState("");
  const [showEvent, setshowEvent] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedDate } = useUser() || "";
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://${ipAddress}:8000/api/auth/events/${selectedDate}`);
        
        if (!response.ok) {
          setEvents([]);
          
          setMessage("No events found for the specified date.");
          setshowEvent(false)
          return;
        }
        const data = await response.json();
        
        
          setEvents(data); 
          
          setshowEvent(true)
        
        
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
              <Ionicons name="calendar-clear-outline" color={'black'} size={14} style={{ marginRight: 4 }} />
              <Text style={styles.eventTime}>{item.eventDate}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="location-outline" color={'black'} size={14} style={{ marginRight: 4 }} />
              <Text style={styles.eventTime}>{item.eventLocation}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" color={'black'} size={14} style={{ marginRight: 4 }} />
              <Text style={styles.eventTime}>{item.eventTime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {showEvent ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      ) : (
        <View>
          <Text style={styles.text3}>{message}</Text>
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
                <Text style={styles.modalTitle}>{selectedEvent.eventName}</Text>
                <Text style={styles.modalDescription}>{selectedEvent.eventDescription}</Text>
                <Text style={styles.modalText}><Ionicons name="calendar-clear-outline" color={'black'} size={14} style={{ marginRight: 4 }} /> {selectedEvent.eventDate}</Text>
                <Text style={styles.modalText}> <Ionicons name="location-outline" color={'black'} size={14} style={{ marginRight: 4 }} /> {selectedEvent.eventLocation}</Text>
                <Text style={styles.modalText}> <Ionicons name="time-outline" color={'black'} size={14} style={{ marginRight: 4 }} /> {selectedEvent.eventTime}</Text>
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
    resizeMode: 'repeat',
    height: 100,
    width: 350,
  },
  container2: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  circularImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  text3: {
    marginTop:10,
    color: 'black',
    fontSize: 32,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#E9F8FF',
    padding: 12,
    width: screenWidth,
  },
  eventContainer: {
    backgroundColor: 'white',
    marginVertical: 0,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  eventTextContainer: {
    marginTop: 10,
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventTime: {
    color: 'black',
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
    backgroundColor: 'rgba(32, 32, 32, 0.5)', // Dark semi-transparent background
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF', // Blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
     width:"90%",
    marginTop:10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDisplay;
