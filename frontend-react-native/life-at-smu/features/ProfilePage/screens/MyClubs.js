import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../Context/UserContext";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const MyClubs = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [clubs, setClubs] = useState([]);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(
          `http://${ipAddress}:8000/api/auth/users/${user.id}/clubs`
        );
        setClubs(res.data.clubs || []);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, []);

  const getBoardRole = (club) => {
    const boardMember = club.boardMembers?.find(
      (member) => String(member?.user?._id) === String(user.id)
    );
    return boardMember ? boardMember.role || "Board Member" : null;
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Back to Profile</Text>
      </TouchableOpacity>

      <Text style={styles.header}>My Clubs</Text>

      {clubs.length === 0 ? (
        <Text style={styles.emptyText}>You haven't joined any clubs yet.</Text>
      ) : (
        clubs.map((club) => {
          const role = getBoardRole(club);
          return (
            <TouchableOpacity
              key={club._id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("ClubDetailsScreen", { club })}
            >
              <Image
                source={{ uri: club.profilePicture }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{club.clubName}</Text>
                <View style={styles.categoryWrapper}>
                  <Text style={styles.categoryChip}>
                    {club?.category || "Uncategorized"}
                  </Text>
                </View>
                {role ? (
                  <Text style={styles.role}>
                    🎓 Board member –{" "}
                    <Text style={{ fontWeight: "bold" }}>{role}</Text>
                  </Text>
                ) : (
                  <Text style={styles.member}>✅ Member</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6FBFF",
    padding: 24,
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007DA5",
    marginBottom: 20,
    alignSelf: "center",
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#007DA5",
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#E6F6FF",
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#007DA5",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 14,
    borderColor: "#007DA5",
    borderWidth: 1,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007DA5",
    marginBottom: 4,
  },
  categoryWrapper: {
    backgroundColor: "#E0F4FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  categoryChip: {
    color: "#007DA5",
    fontSize: 13,
    fontWeight: "600",
  },
  role: {
    fontSize: 14,
    color: "#007DA5",
    marginTop: 4,
  },
  member: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 4,
  },
});

export default MyClubs;
