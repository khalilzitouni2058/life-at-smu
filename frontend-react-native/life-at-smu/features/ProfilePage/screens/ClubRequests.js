import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { useUser } from "../../../Context/UserContext";
import axios from "axios";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ClubRequests = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `http://${ipAddress}:8000/api/auth/users/${user.id}/club-requests`
      );
      setRequests(res.data.requests);
      fadeIn();
    };
    fetch();
  }, []);

  const deleteRequest = async (clubId) => {
    await axios.delete(
      `http://${ipAddress}:8000/api/auth/users/${user.id}/requests/${clubId}`
    );
    setRequests((prev) => prev.filter((r) => r.clubId !== clubId));
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted")
      return <Ionicons name="checkmark-circle" size={16} color="green" />;
    if (status === "Declined")
      return <Ionicons name="close-circle" size={16} color="red" />;
    return <Ionicons name="time" size={16} color="#FFA500" />;
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔙 Back Tab */}
      <View style={styles.backTab}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={22} color="#fff" />
          <Text style={styles.backText}>Club Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.contentBox}>
            <Text style={styles.title}>My Club Requests</Text>
            {requests.length === 0 ? (
              <Text style={styles.emptyText}>No club requests yet.</Text>
            ) : (
              <FlatList
                data={requests}
                keyExtractor={(item) => item.clubId}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                    <View style={styles.cardHeader}>
                      {item.profilePicture && (
                        <Image
                          source={{ uri: item.profilePicture }}
                          style={styles.clubImage}
                        />
                      )}
                      <View>
                        <Text style={styles.name}>{item.clubName}</Text>
                        <View style={styles.detailRow}>
                          <Ionicons
                            name="albums-outline"
                            size={14}
                            color="#666"
                            style={styles.iconLeft}
                          />
                          <Text style={styles.category}>{item.category}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.statusWrapper}>
                      {getStatusIcon(item.status)}
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteRequest(item.clubId)}
                      style={styles.btnDelete}
                    >
                      <Ionicons name="trash-outline" size={18} color="white" />
                      <Text style={styles.btnText}> Delete</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  backTab: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007DA5",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingBottom: 30,
  },
  contentBox: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007DA5",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#007DA5",
    borderWidth: 1,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  clubImage: { width: 40, height: 40, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "600", color: "#007DA5" },
  category: { fontSize: 13, color: "#666" },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statusText: { fontSize: 14, color: "#444", fontWeight: "500", marginLeft: 6 },
  btnDelete: {
    flexDirection: "row",
    backgroundColor: "#FF5A5F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 30,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  iconLeft: { marginRight: 4 },
});

export default ClubRequests;
