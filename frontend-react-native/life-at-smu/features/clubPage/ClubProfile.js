import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import branch4 from "../../../life-at-smu/assets/branch4.png"; // Assuming this image is used correctly
import { ScrollView } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateProfile from "./UpdateProfile";
const Profile = ({ route, navigation }) => {
  const [profile, setProfile] = useState({
    picture:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Lions_Clubs_International_logo.svg/1200px-Lions_Clubs_International_logo.svg.png",
    clubName: "Lions SMU nation",
    email: "Lions@smu.tn",
    clubDescription: "bla bla bla bla blaaa bla bla bla",
    category: "charity",
    contactInfo: "+216 29 111 383",
    boardMembers: [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        facebookLink: "https://facebook.com/johndoe",
        role: "President",
        phoneNumber: "+216 20 123 456",
        picture:
          "https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/469963732_2801171663397034_3870197941446985944_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uqzP4t61bloQ7kNvgGuZweS&_nc_oc=AdiZi3rCnmG1hpiNhZIlx-rDtV1XEM0uwGxQef6qz8dJ724A7BKL5cPjYMLA5Di_4-4&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=Akr1sLeZP0dLZ-JjE-afwYi&oh=00_AYAjfD91fKYDbB1FqX_D4lx-qx5KrgPJCj9enbH2X8cEIg&oe=67AFB8AB",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        facebookLink: "https://facebook.com/janesmith",
        role: "Vice President",
        phoneNumber: "+216 21 654 321",
        picture:
          "https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/368248056_3599500017043298_7560987304418572974_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=NYL9wzf01dQQ7kNvgH7D7YQ&_nc_oc=AdhfeQ6gaW2M6cA4_Eh98r556niOjr3kvXxX4aj4p4hJHVKcNCMD28CVpD18qoM616Q&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=A1riFSJBOMrN_iuuuX5Abc_&oh=00_AYDpe5efipF2ZZCdctuSPtlhMEY8Hw7S4jfi8poVckNelQ&oe=67AFA027",
      },
    ],
  });

  useEffect(() => {
    if (route.params?.updatedProfile) {
      setProfile(route.params.updatedProfile);
    }
  }, [route.params?.updatedProfile]);

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
              source={{ uri: profile.picture }}
              style={styles.profilePicture}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{profile.clubName}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} style={styles.infoIcon} />
              <Text style={styles.infoText}>{profile.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="pricetag-outline"
                size={18}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{profile.category}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{profile.clubDescription}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} style={styles.infoIcon} />
              <Text style={styles.infoText}>{profile.contactInfo}</Text>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate("UpdateProfile")}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.name, { marginTop: 20 }]}>Our Board Members</Text>

        <Animated.View
          style={[
            styles.actionGrid,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {profile.boardMembers.map((member, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <Image
                source={{ uri: member.picture }}
                style={styles.boardMemberImage}
              />
              <Text style={styles.cardText}>
                <Text style={styles.memberinfo}>Name:</Text> {member.name}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.memberinfo}>Role:</Text> {member.role}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.memberinfo}>Email:</Text> {member.email}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.memberinfo}>Phone:</Text>{" "}
                {member.phoneNumber}
              </Text>
              <Text
                style={styles.cardTextLink}
                onPress={() => {
                  navigation.navigate("WebView", { url: member.facebookLink });
                }}
              >
                Facebook Profile
              </Text>
            </TouchableOpacity>
          ))}
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
  memberinfo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
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
    width: "45%", // Adjust card width to ensure proper spacing
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10, // Add horizontal padding
    alignItems: "center", // Center-align content
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
    textAlign: "center", // Ensure text is centered
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
    backgroundColor: "#fff", // Add a light background color
    borderRadius: 10, // Rounded corners
    padding: 20, // Add padding inside the container
    marginVertical: 20, // Add spacing around the container
    alignItems: "center", // Center the content horizontally
    shadowColor: "#000", // Add a shadow for a card-like effect
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Shadow for Android
  },

  infoText: {
    fontSize: 16, // Set font size for information text
    color: "#007DA5", // Match brand color
    marginBottom: 10, // Add space between text elements
    textAlign: "center", // Center-align the text
  },

  infoTitle: {
    fontSize: 20, // Larger font size for the title
    fontWeight: "bold", // Bold title
    color: "#007DA5", // Brand color
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center-align icon and text vertically
    marginVertical: 8, // Add spacing between rows
  },

  infoIcon: {
    marginRight: 10, // Add spacing between icon and text
    color: "#007DA5", // Set icon color to match the brand
  },
});

export default Profile;
