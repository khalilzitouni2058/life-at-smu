import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const CalendarView = ({ days, selectedIndex, setSelectedIndex, eventsByDate }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {days.map((date, index) => {
          const isSelected = selectedIndex === index;
          const dayName = date.toLocaleString("default", { weekday: "short" });
          const monthName = date.toLocaleString("default", { month: "short" });
          const dateKey = date.toISOString().split("T")[0];
          const eventCount = eventsByDate?.[dateKey]?.length || 0;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                { backgroundColor: isSelected ? "#007DA5" : "#d3d3d3" },
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <Text style={styles.dayText}>{dayName}</Text>
              <View style={styles.dayNumberWrapper}>
                <Text style={styles.dateText}>{date.getDate()}</Text>
                {eventCount > 0 && (
                  <View style={styles.eventCountBadge}>
                    <Text style={styles.eventCountText}>{eventCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.monthText}>{monthName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 100,
  },
  dayContainer: {
    width: 72,
    height: 80,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  monthText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  dayNumberWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventCountBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 4,
  },
  eventCountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
});

export default CalendarView;
