import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from "react-native";

import { Card } from "react-native-paper";
import axios from "axios";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ClubsScreen = () => {
  const navigation = useNavigation();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlyRecruiting, setOnlyRecruiting] = useState(false);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  const fade = useSharedValue(0);
  const fadeAnim = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`http://${ipAddress}:8000/api/auth/clubs`);
        setClubs(res.data.clubs || []);
        setFilteredClubs(res.data.clubs || []);
      } catch (err) {
        console.error("Error fetching clubs:", err.message);
      } finally {
        setLoading(false);
        fade.value = withTiming(1, { duration: 300 });
      }
    };
    fetchClubs();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
  };
  useEffect(() => {
    let filtered = clubs.filter((club) =>
      club.clubName?.toLowerCase().includes(search.toLowerCase())
    );

    if (onlyRecruiting) {
      filtered = filtered.filter((club) => club.isRecruiting);
    }

    setFilteredClubs(filtered);
  }, [search, onlyRecruiting, clubs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Student Clubs</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ color: "#007DA5", fontWeight: "600", marginRight: 10 }}
          >
            Show Only Recruiting
          </Text>
          <Text
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: onlyRecruiting ? "#388E3C" : "#BDBDBD",
              borderRadius: 20,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 13,
              overflow: "hidden",
            }}
            onPress={() => setOnlyRecruiting((prev) => !prev)}
          >
            {onlyRecruiting ? "✓ ON" : "OFF"}
          </Text>
        </View>

        <TextInput
          placeholder="Search clubs..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={handleSearch}
          style={styles.search}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007DA5" />
        ) : (
          <Animated.ScrollView
            contentContainerStyle={styles.scroll}
            style={fadeAnim}
          >
            {filteredClubs.map((club) => (
              <View key={club._id}>
                <Card
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("ClubDetailsScreen", { club })
                  }
                >
                  <Card.Content>
                    <View style={styles.clubRow}>
                      <Image
                        source={{
                          uri: club?.profilePicture,
                        }}
                        style={styles.image}
                      />
                      <View style={styles.clubDetails}>
                        <Text style={styles.clubName}>{club?.clubName}</Text>
                        {club.isRecruiting && (
                          <Text
                            style={{
                              backgroundColor: "#FF7043",
                              color: "white",
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: "700",
                              alignSelf: "flex-start",
                              marginBottom: 6,
                            }}
                          >
                            Recruiting Now
                          </Text>
                        )}

                        <Text
                          style={styles.description}
                          numberOfLines={4}
                          ellipsizeMode="tail"
                        >
                          {club?.clubDescription || "No description provided"}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            ))}
          </Animated.ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingTop: 5,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007DA5",
    alignSelf: "center",
    marginBottom: 12,
  },
  search: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#F5F9FB",
    color: "#333",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#E9F8FF",
    elevation: 3,
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#007DA5",
  },
  clubDetails: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
});

export default ClubsScreen;
