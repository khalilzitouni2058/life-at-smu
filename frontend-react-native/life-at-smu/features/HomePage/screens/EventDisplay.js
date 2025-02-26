import { Text, View, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../../Context/UserContext';

const screenWidth = Dimensions.get('window').width;

const EventDisplay = () => {
  const { setEvents } = useUser(); // Get setEvents from context to update global state
  const [events, setLocalEvents] = useState([
    {
      id: '1',
      name: 'Company Visit to Bako Motors',
      date: 'Monday, February 5th',
      location: 'Bako Motors',
      time: '10:30AM -2:40PM',
      organizedby: 'IEEE IAS SMU',
      eventPhoto: { uri: 'https://i.postimg.cc/XXDcNvK5/sample-image.jpg' },
      organizedbyPhoto: { uri: 'https://i.postimg.cc/63vMqCTh/image.png' },
    },
    {
      id: '2',
      name: 'Hack A Tune',
      eventPhoto: { uri: 'https://i.postimg.cc/YSHh78C2/image.png' },
      date: 'Monday, February 5th',
      location: 'Bako Motors',
      time: '9:00AM -2:40PM',
      organizedby: 'Melodies Club SMU',
      organizedbyPhoto: { uri: 'https://i.postimg.cc/cJx0TzJ3/image-removebg-preview.png' },
    },
  ]);

  // Update global event state when component mounts
  useEffect(() => {
    setEvents(events);
  }, [events, setEvents]);

  const renderEvent = ({ item }) => (
    <>
      <View style={styles.container2}>
        <Image source={item.organizedbyPhoto} style={styles.circularImage} />
        <Text style={styles.text}>{item.organizedby}</Text>
      </View>

      <View style={styles.eventContainer}>
        <Image source={item.eventPhoto} style={styles.eventImageBackground} />
        <View style={styles.eventTextContainer}>
          <Text style={styles.eventTitle}>{item.name}</Text>

          <View style={styles.row}>
            <Ionicons name="calendar-clear-outline" color={'black'} size={14} style={{ marginRight: 4 }} />
            <Text style={styles.eventTime}>{item.date}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" color={'black'} size={14} style={{ marginRight: 4 }} />
            <Text style={styles.eventTime}>{item.location}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time-outline" color={'black'} size={14} style={{ marginRight: 4 }} />
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
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
