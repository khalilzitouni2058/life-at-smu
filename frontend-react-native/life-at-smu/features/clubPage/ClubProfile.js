import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import branch4 from "../../../life-at-smu/assets/branch4.png";
import { Ionicons } from "react-native-vector-icons";
import axios from "axios";
import Constants from "expo-constants";
import { useClub } from "../../Context/ClubContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClubProfile = ({ navigation }) => {
  const { clubId, setClubId } = useClub();
  const [profile, setProfile] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const branchOpacity = useRef(new Animated.Value(0)).current;

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        if (!clubId) {
          console.warn("No club ID set in context");
          return;
        }
        const response = await axios.get(
          `http://${ipAddress}:8000/api/auth/clubs/${clubId}`
        );
        setProfile(response.data.club);
      } catch (error) {
        console.error("Error fetching club details:", error);
      }
    };

    fetchClubDetails();
  }, [clubId]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(branchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, branchOpacity]);

  if (!profile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#007DA5",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          Loading club profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Animated.Image
          source={branch4}
          style={[styles.image, styles.topRight, { opacity: branchOpacity }]}
        />
        <Animated.Image
          source={branch4}
          style={[styles.image, styles.bottomLeft, { opacity: branchOpacity }]}
        />
        <View style={[styles.profileHeader]}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: profile?.profilePicture }}
              style={styles.profilePicture}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{profile.clubName}</Text>

            {profile.email ? (
              <View style={styles.infoRow}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>{profile.email}</Text>
              </View>
            ) : null}

            {profile.category ? (
              <View style={styles.infoRow}>
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>{profile.category}</Text>
              </View>
            ) : null}

            {profile.clubDescription ? (
              <View style={styles.infoRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  style={styles.infoIcon}
                />
                <Text
                  style={styles.infoText}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {profile.clubDescription}
                </Text>
              </View>
            ) : null}

            {profile.contactInfo ? (
              <View style={styles.infoRow}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>{profile.contactInfo}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() =>
                navigation.navigate("Profile", { screen: "ClubUpdate" })
              }
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.recruitButton,
            {
              backgroundColor: profile.isRecruiting ? "#4CAF50" : "#D32F2F",
            },
          ]}
          onPress={async () => {
            try {
              const res = await axios.patch(
                `http://${ipAddress}:8000/api/auth/clubs/${clubId}/toggle-recruiting`
              );
              setProfile((prev) => ({
                ...prev,
                isRecruiting: res.data.isRecruiting,
              }));
            } catch (err) {
              console.error("Error toggling recruiting status:", err);
            }
          }}
        >
          <Ionicons
            name={profile.isRecruiting ? "megaphone" : "megaphone-outline"}
            size={18}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.recruitButtonText}>
            {profile.isRecruiting
              ? "Recruiting Enabled"
              : "Recruiting Disabled"}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.actionGrid,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* 👥 View Board Members Button */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "#007DA5" }]}
            onPress={() =>
              navigation.navigate("BoardMembersScreen", {
                boardMembers: profile.boardMembers,
              })
            }
          >
            <Ionicons name="people-outline" size={30} color="#007DA5" />
            <Text
              style={[styles.cardText, { color: "#007DA5", fontWeight: "600" }]}
            >
              Board Members
            </Text>
          </TouchableOpacity>

          {/* 📬 Review Requests Button */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "#007DA5" }]}
            onPress={() => navigation.navigate("ReviewRequests")}
          >
            <Ionicons name="document-text-outline" size={30} color="#007DA5" />
            <Text
              style={[styles.cardText, { color: "#007DA5", fontWeight: "600" }]}
            >
              Review Requests
            </Text>
          </TouchableOpacity>

          {/* 🚪 Logout Button */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "#FF5A5F" }]}
            onPress={async () => {
              await AsyncStorage.clear();
              setClubId(null);
              navigation.replace("Login");
            }}
          >
            <Ionicons name="log-out-outline" size={30} color="#FF5A5F" />
            <Text
              style={[styles.cardText, { color: "#FF5A5F", fontWeight: "600" }]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: -200,
    justifyContent: "flex-start",
    backgroundColor: "#007DA5",
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: -20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePictureContainer: {
    marginTop: 20,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    marginLeft: 10,
  },
  memberinfo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "#D9F4FF",
    marginBottom: 10,
  },
  image: {
    width: 130,
    height: 130,
    position: "absolute",
  },
  topRight: {
    top: 40,
    right: -50,
    transform: [{ rotate: "130deg" }],
  },
  bottomLeft: {
    bottom: 490,
    left: -50,
    transform: [{ rotate: "-45deg" }],
  },
  editProfileButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  editProfileText: {
    color: "#007DA5",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
    gap: 20,
    paddingTop: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 30,
    marginBottom: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  actionCard: {
    width: "45%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  boardMemberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
  },
  cardTextLink: {
    fontSize: 14,
    color: "#007DA5",
    marginTop: 5,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: "#007DA5",
    marginBottom: 10,
    textAlign: "center",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007DA5",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  infoIcon: {
    marginRight: 10,
    paddingBottom: 6,
    color: "#007DA5",
  },
  recruitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  recruitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ClubProfile;
