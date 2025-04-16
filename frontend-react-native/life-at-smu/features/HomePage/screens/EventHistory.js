import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../../../Context/UserContext";
import Constants from "expo-constants";
import axios from "axios";

const EventHistory = () => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://${ipAddress}:8000/api/auth/users/${user.id}/events`
        );
        setJoinedEvents(res.data.events || []); // Only user's joined events
      } catch (err) {
        console.error("Error fetching user events:", err);
        setJoinedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchJoinedEvents();
    }
  }, [user]);

  const today = new Date();

  const filteredEvents = joinedEvents.filter((event) => {
    const eventDate = new Date(event.eventDate);
    if (selectedTab === "attended") {
      return eventDate < today;
    } else {
      return eventDate >= today;
    }
  });

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
          style={styles.eventImage}
        />
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.eventName}</Text>
        <Text style={styles.eventDetail}>📍 {item.eventLocation}</Text>
        <Text style={styles.eventDetail}>📅 {item.eventDate}</Text>
        <Text style={styles.eventDetail}>🕒 {item.eventTime || "TBA"}</Text>
        {item.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "upcoming" && styles.activeTab]}
          onPress={() => setSelectedTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "attended" && styles.activeTab]}
          onPress={() => setSelectedTab("attended")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "attended" && styles.activeTabText,
            ]}
          >
            Attended
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007DA5" />
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {selectedTab} events found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    padding: 16,
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#E0F4FF",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#007DA5",
    fontWeight: "500",
  },
  activeTab: {
    backgroundColor: "#007DA5",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  eventCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 12,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#007DA5",
  },
  eventDetail: {
    fontSize: 13,
    color: "#444",
  },
  eventDescription: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
    marginBottom: 10,
  },
  emptyText: {
    color: "#aaa",
    fontStyle: "italic",
    marginTop: 40,
    textAlign: "center",
  },
});

export default EventHistory;
