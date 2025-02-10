import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default CalendarView = ({ lastDayOfMonth, firstDayOfMonth }) => {
  // State to keep track of the selected dates
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  useEffect(() => {
    // Initialize the selected dates with today's date and the next 3 days
    const today = new Date();
    const initialDates = Array.from({ length: 4 }, (_, index) => {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + index);
      return { index, date: currentDate };
    });
    setSelectedDates(initialDates);
  }, []);

  
  const today = new Date();
  const allDays = Array.from(
    { length: lastDayOfMonth.getDate() - today.getDate() + 1 },
    (_, index) => {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + index);
      const dayName = currentDate.toLocaleString('default', { weekday: 'short' });
      return { index, dayName, date: currentDate };
    }
  );

  // Function to handle the day selection
  const handleSelectDay = (newDay) => {
    
    const updatedDates = [
      { index: 0, date: new Date(newDay.date.setDate(newDay.date.getDate() )) },
      { index: 1, date: new Date(newDay.date.setDate(newDay.date.getDate() + 1)) },
      { index: 2, date: new Date(newDay.date.setDate(newDay.date.getDate() + 1)) },
      { index: 3, date: new Date(newDay.date.setDate(newDay.date.getDate() + 1)) },
    ];

    // Update the state with the new selected dates
    setSelectedDates(updatedDates);

    // Close the dropdown after a selection
    setIsDropDownVisible(false);
  };
  

  return (
    <View  style={[
      styles.container,
      { height: !isDropDownVisible ? 80 : 180 },
    ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10 }}
      >
        {selectedDates.map(({ date, index  }) => {
          const dayName = date.toLocaleString('default', { weekday: 'short' });
          const shortMonthName = date.toLocaleString('default', { month: 'short' });
          const isSelected = selectedDay === index;
          
          return (
            <TouchableOpacity key={`selected-${index}`} style={[
              styles.dayContainer,
              { backgroundColor: isSelected ? '#007DA5' : '#d3d3d3' }, // Highlight selection
            ]}  onPress={() => setSelectedDay(index)}>
              <Text style={styles.dayText}>{dayName}</Text>
              <Text style={styles.dateText}>{date.getDate()}</Text>
              <Text style={styles.monthText}>{shortMonthName}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => setIsDropDownVisible(!isDropDownVisible)}
        >
          <Text style={styles.dropDownText}>
            {isDropDownVisible ? <Ionicons name="chevron-up-outline" size={30} color="#fff" /> : <Ionicons name="chevron-down-outline" size={30} color="#fff" />}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {isDropDownVisible && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {allDays.map(({ index, dayName, date }) => (
            
            <TouchableOpacity
              key={`dropdown-${index}`}
              style={[styles.dayContainer, styles.dropDownDay]}
              onPress={() => handleSelectDay({ index, dayName, date })}
            >
              <Text style={styles.dayText}>{dayName}</Text>
              <Text style={styles.dateText}>{date.getDate()}</Text>
              
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 140,
    
    height:180
  },
  dayContainer: {
    
    width: 72,
    height: 80,
    backgroundColor: '#007DA5',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 0,
    
  },
  dropDownDay: {
    backgroundColor: '#ddd',
    
  },
  dayText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  monthText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  dropDownButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007DA5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
  },
  dropDownText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
