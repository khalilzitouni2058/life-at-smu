import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import { useState } from "react";
import { useUser } from "../../Context/UserContext";

const ClubDetailsScreen = ({ route }) => {
  const { club: initialClub } = route.params || {};
  const [club, setClub] = useState(null);
  const { user } = useUser();
  const navigation = useNavigation();
  const fadeIn = useSharedValue(0);
  const [hasRequested, setHasRequested] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const isUserLoggedIn = user && user.fullname;
  const isClubLoggedIn = user && !user.fullname; 


  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "localhost";

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 300 });

    const fetchClubDetails = async () => {
      try {
        if (!user || isClubLoggedIn) {
        const res = await axios.get(
          `http://${ipAddress}:8000/api/auth/clubs/${initialClub._id}`
        );
        setClub(res.data.club);
        return;
      }
      const res = await axios.get(
        `http://${ipAddress}:8000/api/auth/clubs/${initialClub._id}`
      );
      setClub(res.data.club);
      
        const userRes = await axios.get(
          `http://${ipAddress}:8000/api/auth/users/${user.id}`
        );
        const clubRequests = userRes.data.user?.clubRequests || [];
        const joinedClubs = userRes.data.user?.clubs || [];

        setHasRequested(
          clubRequests.some(
            (r) => r.club === initialClub._id && r.status === "Pending"
          )
        );
        setIsMember(joinedClubs.includes(initialClub._id));
      } catch (err) {
        console.error("Failed to fetch club details:", err);
      }
    };

    if (initialClub?._id) {
      fetchClubDetails();
    }
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const openEmail = () => {
    if (club.contactInfo?.includes("@")) {
      Linking.openURL(`mailto:${club.contactInfo}`);
    }
  };

  if (!club) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>
          Club data not available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 16,
          marginBottom: 10,
          paddingVertical: 8,
          paddingHorizontal: 14,
          backgroundColor: "#007DA5",
          borderRadius: 10,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
          Back to Clubs
        </Text>
      </TouchableOpacity>
      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        style={fadeStyle}
      >
        <Image
          source={{
            uri: club?.profilePicture,
          }}
          style={styles.image}
        />

        <Text style={styles.title}>{club?.clubName}</Text>

        <View style={styles.categoryWrapper}>
          <Text style={styles.categoryChip}>
            {club?.category || "Uncategorized"}
          </Text>
        </View>

        <Text style={styles.description}>
          {club?.clubDescription || "No description provided."}
        </Text>

        {club?.contactInfo && (
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.contact}>📧 {club.contactInfo}</Text>
          </TouchableOpacity>
        )}

        {isUserLoggedIn && (
          <>
            {!isMember && !hasRequested && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await axios.post(
                      `http://${ipAddress}:8000/api/auth/users/${user.id}/request-club`,
                      { clubId: club._id }
                    );
                    alert("Join request sent! Awaiting approval.");
                    setHasRequested(true);
                  } catch (err) {
                    alert("You already sent a request or an error occurred.");
                    console.error(err);
                  }
                }}
                style={styles.joinBtn}
              >
                <Text style={styles.joinText}>Request to Join</Text>
              </TouchableOpacity>
            )}

            {hasRequested && !isMember && (
              <View style={[styles.joinBtn, { backgroundColor: "#ccc" }]}>
                <Text style={styles.joinText}>Awaiting Approval</Text>
              </View>
            )}

            {isMember && (
              <View style={[styles.joinBtn, { backgroundColor: "green" }]}>
                <Text style={styles.joinText}>Already a Member</Text>
              </View>
            )}
          </>
        )}

        {club?.boardMembers?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 Board Members</Text>
            {club.boardMembers.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                <Image
                  source={{
                    uri: member?.user?.picture,
                  }}
                  style={styles.memberImage}
                />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>
                    {member?.user?.fullname}
                  </Text>
                  <Text style={styles.memberRole}>{member?.role}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  scroll: {
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    borderColor: "#007DA5",
    borderWidth: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007DA5",
    marginBottom: 4,
  },
  categoryWrapper: {
    backgroundColor: "#E0F4FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 10,
  },
  categoryChip: {
    color: "#007DA5",
    fontSize: 13,
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  contact: {
    fontSize: 14,
    color: "#007DA5",
    fontWeight: "500",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  section: {
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003366",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F8FF",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberDetails: {
    flexShrink: 1,
  },
  memberName: {
    fontWeight: "600",
    fontSize: 15,
  },
  memberRole: {
    fontSize: 13,
    color: "#555",
  },
  joinBtn: {
    backgroundColor: "#007DA5",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 30,
  },
  joinText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClubDetailsScreen;
