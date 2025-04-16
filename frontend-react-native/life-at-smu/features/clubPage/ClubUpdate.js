import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useClub } from "../../Context/ClubContext";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";

const ClubUpdate = ({ navigation }) => {
  const { clubId } = useClub();
  const [clubData, setClubData] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  useEffect(() => {
    if (!clubId) {
      Alert.alert("Error", "No club ID found.");
      return;
    }
    fetchClubDetails();
  }, [clubId]);

  const fetchClubDetails = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:8000/api/auth/clubs/${clubId}`
      );
      setClubData(response.data.club);
      setLogo(response.data.club.profilePicture);
    } catch (error) {
      console.error("Error fetching club details:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!clubData) return;
    try {
      await axios.put(
        `http://${ipAddress}:8000/api/auth/clubs/${clubId}`,
        clubData
      );
      Alert.alert("Success", "Profile updated successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "Profile" } }],
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const handleDeleteMember = async (index) => {
    if (!clubData) return;
    const updatedBoardMembers = clubData.boardMembers.filter(
      (_, i) => i !== index
    );

    try {
      await axios.put(`http://${ipAddress}:8000/api/auth/clubs/${clubId}`, {
        ...clubData,
        boardMembers: updatedBoardMembers,
      });

      setClubData({ ...clubData, boardMembers: updatedBoardMembers });
      Alert.alert("Success", "Board member removed.");
    } catch (error) {
      console.error("Error deleting board member:", error);
      Alert.alert("Error", "Could not delete board member.");
    }
  };

  const handleUploadLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need access to your gallery.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.cancelled || !result.assets || result.assets.length === 0) {
      Alert.alert("Upload cancelled", "No image was selected.");
      return;
    }

    const newProfilePicture = result.assets[0].uri;
    setLogo(newProfilePicture);
    setClubData((prevData) => ({
      ...prevData,
      profilePicture: newProfilePicture,
    }));
    updateProfilePicture(newProfilePicture);
  };

  const updateProfilePicture = async (newProfilePicture) => {
    if (!clubData) return;
    try {
      const updatedClub = await axios.put(
        `http://${ipAddress}:8000/api/auth/clubs/${clubId}`,
        {
          ...clubData,
          profilePicture: newProfilePicture,
        }
      );
      setClubData(updatedClub.data.club);
      setLogo(updatedClub.data.club.profilePicture);
      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Alert.alert("Error", "Could not update profile picture.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-Width Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.appLogo}
          />
          <Text style={styles.title}>Update Profile</Text>
        </View>

        {/* Centered Club Logo */}
        <TouchableOpacity onPress={handleUploadLogo} style={styles.logoWrapper}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.clubLogo} />
          ) : (
            <Text style={styles.logoPlaceholder}>+</Text>
          )}
        </TouchableOpacity>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Club Name */}
          <View style={styles.formGroup}>
            <View style={styles.row}>
              <Text style={styles.label}>Club Name</Text>
              <TouchableOpacity
                onPress={() => setIsEditingName(!isEditingName)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>
                  {isEditingName ? "Done" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={clubData?.clubName || ""}
              editable={isEditingName}
              onChangeText={(value) =>
                setClubData((prevData) => ({ ...prevData, clubName: value }))
              }
              placeholder="Club Name"
              placeholderTextColor="#888"
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={clubData?.category || ""}
              onChangeText={(value) =>
                setClubData((prevData) => ({ ...prevData, category: value }))
              }
              placeholder="Enter category"
              placeholderTextColor="#888"
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textarea}
              value={clubData?.clubDescription || ""}
              onChangeText={(value) =>
                setClubData((prevData) => ({
                  ...prevData,
                  clubDescription: value,
                }))
              }
              placeholder="Enter club description"
              placeholderTextColor="#888"
              multiline
            />
          </View>

          {/* Contact Information */}
          <View style={styles.formGroup}>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Information</Text>
            </View>
            <TextInput
              style={styles.input}
              value={clubData?.contactInfo || ""}
              onChangeText={(value) =>
                setClubData((prevData) => ({
                  ...prevData,
                  contactInfo: value,
                }))
              }
              placeholder="Enter contact info"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Board Members Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Board Members</Text>
          <View style={styles.boardMembersContainer}>
            {clubData?.boardMembers?.length > 0 ? (
              clubData.boardMembers.map((member, index) => (
                <View key={index} style={styles.boardMemberCard}>
                  <Image
                    source={{ uri: member?.user?.picture }}
                    style={styles.boardMemberPicture}
                  />
                  <View style={styles.boardMemberDetails}>
                    <Text style={styles.boardMemberName}>
                      {member?.user?.fullname}
                    </Text>
                    <Text style={styles.boardMemberRole}>{member?.role}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      navigation.navigate("EditBoardMember", {
                        editingMember: member,
                      })
                    }
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMember(index)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No board members available.</Text>
            )}
          </View>
        </View>

        {/* Add Board Member Button */}
        <View style={styles.additionalSection}>
          <Text style={styles.additionalText}>
            Want to add more board members?
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddBoardMember")}
          >
            <Text style={styles.addButtonText}>Add a New Board Member</Text>
          </TouchableOpacity>
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.updateButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 0,
    margin: 0,
  },

  contentContainer: {
    padding: -10,
    alignItems: "center",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007DA5",
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  appLogo: {
    position: "absolute",
    left: 10,
    top: 18,
    width: 90,
    height: 60,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    marginVertical: 20,
  },

  clubLogo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  logoPlaceholder: {
    fontSize: 36,
    color: "#ccc",
  },
  formGroup: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  label: {
    color: "#007DA5",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "transparent",
    width: "100%",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "transparent",
    textAlignVertical: "top",
    height: 100,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  editButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  boardMembersContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: "100%",
  },
  boardMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  boardMemberPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  boardMemberDetails: {
    flex: 1,
  },
  boardMemberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007DA5",
  },
  boardMemberRole: {
    fontSize: 14,
    color: "#333",
  },
  additionalSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  additionalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 20,
    width: "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ff", // matches your theme
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
    alignItems: "center",
  },

  required: { color: "red", fontSize: 16 },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});

export default ClubUpdate;
