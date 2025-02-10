import React,{useState} from 'react';
import { Text, View ,StyleSheet} from 'react-native';
import { useUser } from '../../../Context/UserContext';
import Footer from '../components/Footer';
import CalendarView from '../components/CalendarView';
import EventDisplay from './EventDisplay';
const HomeMain = () => {
  const { user } = useUser() // Accessing user data from context
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
  return (
    <View style={styles.container} >
      
      <CalendarView 
        lastDayOfMonth ={lastDayOfMonth} 
        firstDayOfMonth={firstDayOfMonth} 
        selectedIndex={selectedIndex}
        setSelectedIndex = {setSelectedIndex}
        />
        <Text style={styles.text}>Events</Text>
        <EventDisplay />
        
        
        
        
        
      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  text:{
    fontSize:30,
  fontWeight:"bold",  
  color:"#007DA5",
  marginRight:"auto",
  marginLeft:"20",
  marginTop:10,
  marginBottom:10

},
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      
    },
  });
  
export default HomeMain;
