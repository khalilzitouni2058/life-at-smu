import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Back from "../components/Back";

const mockScheduleData = [
  { id: "1", title: "Team Meeting", time: "10:00 AM", location: "Room A102" },
  { id: "2", title: "Club Fair", time: "1:30 PM", location: "Main Hall" },
  {
    id: "3",
    title: "Guest Speaker: Innovation Talk",
    time: "3:00 PM",
    location: "Auditorium",
  },
];

const Schedule = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Ionicons
        name="calendar-outline"
        size={24}
        color="#007DA5"
        style={styles.icon}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subText}>
          {item.time} | {item.location}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Back title={"Home"} />
      <Text style={styles.header}>Today's Schedule</Text>
      <FlatList
        data={mockScheduleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F8FF",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    color: "#007DA5",
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
});
