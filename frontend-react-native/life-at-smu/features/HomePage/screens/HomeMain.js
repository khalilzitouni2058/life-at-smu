
import React,{useState} from 'react';
import { Text, View ,StyleSheet,TextInput,TouchableOpacity,Pressable } from 'react-native';
import { useUser } from '../../../Context/UserContext';
import { useClub } from '../../../Context/ClubContext';
import Footer from '../components/Footer';
import CalendarView from '../components/CalendarView';
import EventDisplay from './EventDisplay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
const Addproposal = () => {
  const { clubId } = useClub() || {}; // Default to an empty object to avoid errors

  const navigation = useNavigation(); // Get navigation from context

  if (!clubId) return null;

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text style={styles.text}>Events</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("eventForm")}>
        <Text style={styles.text2}>Create an event proposal</Text>
      </Pressable>
    </View>
  );
};
const HomeMain = () => {
  const { user } = useUser();
  
 const navigation = useNavigation();
 
  const [now, setNow] = useState(new Date());

  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [lastDayOfMonth, setLastDayOfMonth] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  );
  const [selectedIndex, setSelectedIndex] = useState(now.getDate() - 1);

  const getRandomColor = (colors) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search events..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => setDrawerVisible(!drawerVisible)}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {drawerVisible && (
        <View
          entering={SlideInRight.duration(300)}
          exiting={SlideOutRight.duration(300)}
          style={styles.drawer}
        >
          <Text style={styles.drawerText}>hello</Text>
        </View>
      )}
      <CalendarView
        lastDayOfMonth={lastDayOfMonth}
        firstDayOfMonth={firstDayOfMonth}
        selectedIndex={selectedIndex}

        setSelectedIndex = {setSelectedIndex}
        
        />
        <Addproposal  />

        
        <EventDisplay  />
        
        
        
        
        

      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E9F8FC",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 0,
    alignItems: "center",
    marginLeft:20
    
  },
  text2: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf:"right",
    paddingTop:15
  },
  text: {
    color: "black",
    fontSize: 2,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 40,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginLeft: 8,
    backgroundColor: "#fff",
  },
  drawer: {
    zIndex: 1,
    position: "absolute",
    right: 0,
    top: 70,
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  drawerText: {
    fontSize: 16,
  },
  
  placeholder: {
    height: 200,
    backgroundColor: "#ddd",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007DA5",
    marginRight: "auto",
    marginLeft: "20",
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

export default HomeMain;
