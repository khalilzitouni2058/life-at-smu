import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import branch4 from "../../../assets/branch4.png"; // Assuming this image is used correctly
import { ScrollView } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { Animated } from "react-native";
import { useUser } from "../../../Context/UserContext";

const Profile = ({ navigation, route }) => {
  const { user, setUser } = useUser();

  useEffect(() => {
    console.log(route.params?.updatedUser);
    if (route.params?.updatedUser) {
      setUser(route.params?.updatedUser);
    }
  }, [route.params?.updatedUser]);

  const getUserId = async () => {
    navigation.navigate("EditProfile", { user });
  };

  const slideAnim = useRef(new Animated.Value(300)).current; // Start below the screen
  const branchOpacity = useRef(new Animated.Value(0)).current; // Initial opacity for branches

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to its position
        duration: 500, // Duration of the animation
        useNativeDriver: true, // Enable native driver
      }),
      Animated.timing(branchOpacity, {
        toValue: 1, // Make branches fully visible
        duration: 300, // Slightly faster to appear before the grid finishes
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, branchOpacity]);

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
              source={{ uri: user.picture }}
              style={styles.profilePicture}
            />
          </View>

          <View style={{ flex: 1, gap: 20, alignItems: "center" }}>
            <Text style={styles.name}>{user.fullname}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={getUserId}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[
            styles.actionGrid,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("ClubRequests")}
          >
            <Ionicons name="globe-outline" size={30} color="#007DA5" />
            <Text style={styles.cardText}>Club Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("MyClubs")}
          >
            <Ionicons name="heart-outline" size={30} color="#007DA5" />
            <Text style={styles.cardText}>My Clubs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="gift-outline" size={30} color="#007DA5" />
            <Text style={styles.cardText}>Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("EventHistory")}
          >
            <Ionicons name="megaphone-outline" size={30} color="#007DA5" />
            <Text style={styles.cardText}>Event History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "#FF5A5F" }]}
            onPress={() => {
              setUser(null); // or setClubId(null) if needed
              navigation.replace("Login");
            }}
          >
            <Ionicons name="log-out-outline" size={30} color="#FF5A5F" />
            <Text style={[styles.cardText, { color: "#FF5A5F" }]}>Logout</Text>
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
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: -20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20, // Rounded corners at the bottom
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
    color: "#FFFFFF", // White text for the header
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "#D9F4FF", // Slightly faded white
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
  infoContainer: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  specialty: {
    fontSize: 16,
    color: "#007DA5",
    marginBottom: 5,
  },
  aboutSection: {
    marginTop: 30,
    width: "80%",
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 14,
    color: "#555",
  },
  editButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  editProfileButton: {
    backgroundColor: "white", // White background for the button
    paddingVertical: 15, // Vertical padding for height
    paddingHorizontal: 40, // Horizontal padding for width
    borderRadius: 25, // Rounded edges
    alignItems: "center", // Center the text
    alignSelf: "center", // Center the button
    marginTop: -10, // Spacing from the top elements
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for elevation
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 4, // Elevation for Android shadow
  },
  editProfileText: {
    color: "#007DA5", // Match the icon color
    fontSize: 16, // Text size
    fontWeight: "bold", // Bold text
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
    shadowColor: "#000", // Black shadow
    shadowOffset: { width: 0, height: -3 }, // Shadow appears above the grid
    shadowOpacity: 0.2, // Light shadow
    shadowRadius: 5, // Smooth shadow edges
    elevation: 4, // Shadow for Android
  },

  actionCard: {
    width: "45%", // Adjust grid item width
    backgroundColor: "#fff",
    paddingVertical: 20,
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

  cardText: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
});

export default Profile;
