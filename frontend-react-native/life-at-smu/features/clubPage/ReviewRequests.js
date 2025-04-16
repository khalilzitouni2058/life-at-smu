import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useClub } from "../../Context/ClubContext";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const ReviewRequests = () => {
  const navigation = useNavigation();
  const { clubId } = useClub();
  const [club, setClub] = useState(null);
  const [requests, setRequests] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  useEffect(() => {
    if (!clubId) return;
    axios
      .get(`http://${ipAddress}:8000/api/auth/clubs/${clubId}`)
      .then((res) => setClub(res.data.club));
  }, [clubId]);

  useEffect(() => {
    if (!club?._id) return;
    axios
      .get(`http://${ipAddress}:8000/api/auth/clubs/${club._id}/requests`)
      .then((res) => {
        setRequests(res.data.requests);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
  }, [club]);

  const respond = async (userId, action) => {
    await axios.post(
      `http://${ipAddress}:8000/api/auth/clubs/${club._id}/respond-request`,
      {
        userId,
        action,
      }
    );
    setRequests((prev) =>
      prev.map((r) =>
        r._id === userId
          ? {
              ...r,
              request: {
                ...r.request,
                status: action === "accept" ? "Accepted" : "Declined",
              },
            }
          : r
      )
    );
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted")
      return <Ionicons name="checkmark-circle" size={18} color="green" />;
    if (status === "Declined")
      return <Ionicons name="close-circle" size={18} color="red" />;
    return <Ionicons name="time" size={18} color="#FFA500" />;
  };

  const deleteRequest = async (userId) => {
    await axios.delete(
      `http://${ipAddress}:8000/api/auth/users/${userId}/requests/${club._id}`
    );
    setRequests((prev) => prev.filter((r) => r._id !== userId));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>Back to Profile</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Review Join Requests</Text>
      {requests.length === 0 ? (
        <Text style={styles.emptyText}>No requests found.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.picture }} style={styles.avatar} />
                <View>
                  <Text style={styles.name}>{item.fullname}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="school-outline"
                      size={14}
                      color="#666"
                      style={styles.iconLeft}
                    />
                    <Text style={styles.detail}>
                      Program: {item.program || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="book-outline"
                      size={14}
                      color="#666"
                      style={styles.iconLeft}
                    />
                    <Text style={styles.detail}>
                      Major: {item.major || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.statusWrapper}>
                {getStatusIcon(item.request.status)}
                <Text style={styles.statusText}>{item.request.status}</Text>
              </View>

              {item.request.status === "Pending" ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => respond(item._id, "accept")}
                    style={styles.btnAccept}
                  >
                    <Ionicons
                      name="checkmark-outline"
                      size={18}
                      color="white"
                    />
                    <Text style={styles.btnText}> Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => respond(item._id, "decline")}
                    style={styles.btnDecline}
                  >
                    <Ionicons name="close-outline" size={18} color="white" />
                    <Text style={styles.btnText}> Decline</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => deleteRequest(item._id)}
                  style={styles.btnDelete}
                >
                  <Ionicons name="trash-outline" size={18} color="white" />
                  <Text style={styles.btnText}> Delete</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F4FF",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007DA5",
    marginBottom: 10,
    textAlign: "center",
  },
  backBtn: {
    backgroundColor: "#007DA5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "600", color: "#007DA5" },
  email: { fontSize: 13, color: "#777" },
  detailRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  iconLeft: { marginRight: 4 },
  detail: { fontSize: 13, color: "#666" },
  statusWrapper: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  statusText: { fontSize: 14, color: "#444", fontWeight: "500", marginLeft: 6 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  btnAccept: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnDecline: {
    flexDirection: "row",
    backgroundColor: "#F44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnDelete: {
    flexDirection: "row",
    backgroundColor: "#999",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
  },
  btnText: { color: "white", fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 30,
  },
});

export default ReviewRequests;
