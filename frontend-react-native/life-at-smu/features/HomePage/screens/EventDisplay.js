import { Text, View, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../../Context/UserContext';
import Constants from "expo-constants";

const screenWidth = Dimensions.get('window').width;
const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";
const EventDisplay = () => {
  const [events,setEvents]  = useState([]);
  console.log(events)
  const { selectedDate,seteventCount } = useUser() || "";
  console.log(selectedDate)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://${ipAddress}:8000/api/auth/events/${selectedDate}`);
        
        if (!response.ok) {
          setEvents([]);
        }

        const data = await response.json();
        
        if (data === null) {
          setEvents([]); 
        } else {
          setEvents(data); 
          seteventCount(data.length)
        }
        
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
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
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
});

export default EventDisplay;
