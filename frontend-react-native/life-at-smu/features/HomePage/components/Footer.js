import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
const Footer = () => {
  const navigation = useNavigation();
    
  const handleprofile = () =>{
    navigation.navigate("Profile");
  }
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Home pressed')}>
        <Ionicons name="home-outline" size={30} color="black" />
        <Text style={styles.iconLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Search pressed')}>
        <Ionicons name="people-circle-outline" size={30} color="black" />
        <Text style={styles.iconLabel}>Clubs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Search pressed')}>
        <Ionicons name="calendar-outline" size={30} color="black" />
        <Text style={styles.iconLabel}>Schedule</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.iconContainer} onPress={() => handleprofile()}>
        <Ionicons name="person-outline" size={30} color="black" />
        <Text style={styles.iconLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E9F8FF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 65,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  iconLabel: {
    marginTop: 4,
    color: 'black',
    fontSize: 12,
    fontWeight: '500',
  },
});


export default Footer;
