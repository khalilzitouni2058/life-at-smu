import { Text, View ,StyleSheet,Dimensions,FlatList,Image} from 'react-native'
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

export class EventDisplay extends Component {
    state = {
        events: [
          {
            id: '1',
            name: 'Company Visit to Bako Motors',
            date:"Monday, February 5th",
            location:"Bako Motors",
            time :"10:30AM -2:40PM",
            organizedby:"IEEE IAS SMU",
            eventPhoto: { uri: 'https://i.postimg.cc/XXDcNvK5/sample-image.jpg' },
            organizedbyPhoto : {uri :'https://i.postimg.cc/63vMqCTh/image.png'}
            
          },
          {
            id: '2',
            name: 'Lunch with Client',
            eventPhoto: { uri: 'https://i.postimg.cc/XXDcNvK5/sample-image.jpg' },
            time: '12:30 PM',
          },
          {
            id: '3',
            name: 'Project Presentation',
            eventPhoto: { uri: 'https://i.postimg.cc/XXDcNvK5/sample-image.jpg' },
            time: '03:00 PM',
          },
        ],
      };
    
      renderEvent = ({ item }) => (
        <>
        <View style={styles.container2}>
        <Image  source={{ uri: 'https://i.postimg.cc/63vMqCTh/image.png' }} 

    style={styles.circularImage} 
  />
  <Text style={styles.text}> {item.organizedby}</Text>

        </View>
        <View style={styles.eventContainer}>
            
      <View style={styles.eventTextContainer}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <View style={styles.row}>
        <Ionicons name="calendar-clear-outline" color={"white"} size={14} style={{marginRight:4}}></Ionicons>
        <Text style={styles.eventTime}>{item.date}</Text>
        </View>
        
        <View style={styles.row}>
        <Ionicons name="location-outline" color={"white"} size={14} style={{marginRight:4}}></Ionicons>
        <Text style={styles.eventTime}>{item.location}</Text>
        </View>
        
        <View style={styles.row}>
        <Ionicons name="time-outline" color={"white"} size={14} style={{marginRight:4}}></Ionicons>
        <Text style={styles.eventTime}>{item.time}</Text>
        </View>
        
        
      </View>
      
      <Image source={item.eventPhoto} style={styles.eventImage} />
    </View>
    </>
    );
  render() {
    return (
        <View style={styles.container}>
        <FlatList
          data={this.state.events}
          keyExtractor={(item) => item.id}
          renderItem={this.renderEvent}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
    container2: {
        height: 50,
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      circularImage: {
        width: 40,
        height: 40,
        borderRadius: 20, 
        marginRight: 10,
      },
      text: {
        color: 'black',
        fontSize: 16,
        fontWeight:"bold"
      },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
      },
    container: {
      flex: 1,
      backgroundColor: '#f3f3f3',
      padding: 10,
      width:screenWidth
    },
    eventContainer: {
      backgroundColor: '#007DA5',
      padding: 10,
      margin: 0,
      marginBottom: 15,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      flexDirection: 'row', // Aligns image and text horizontally
      alignItems: 'center',
       // Vertically aligns the items in the center
    },
    eventImage: {
      width: 150,
      height: 150,
      borderRadius: 8,
      marginLeft: 15,
      resizeMode:"cover" 
    },
    eventTextContainer: {
      flex: 1, // Makes sure the text container takes up available space
    },
    eventTitle: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom:20
    },
    eventTime: {
      color: '#ffffff',
      fontSize: 14,
    },
  });

export default EventDisplay