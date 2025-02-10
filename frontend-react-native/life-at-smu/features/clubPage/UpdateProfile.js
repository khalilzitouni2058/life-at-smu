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

const UpdateProfile = ({ navigation, route }) => {
  const [clubData, setClubData] = useState({
    clubName: "Lions club SMU nation",
    category: "",
    clubDescription: "",
    contactInfo: "Lions@SMU.tn",
    boardMembers: [
      {
        name: "John Doe",
        role: "President",
        picture:
          "https://th.bing.com/th/id/OIP.QZIRZKUSWt1HBifjDRKGzAHaFj?w=212&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      },
    ],
  });

  const [logo, setLogo] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  useEffect(() => {
    if (route.params?.newMember) {
      setClubData((prevData) => ({
        ...prevData,
        boardMembers: [...prevData.boardMembers, route.params.newMember],
      }));
    }
  }, [route.params?.newMember]);

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
    if (!result.cancelled) {
      setLogo(result.uri);
    } else {
      Alert.alert("Error", "No image was selected.");
    }
  };

  const handleUpdateProfile = () => {
    let errorMessages = [];
    if (!clubData.clubName.trim()) errorMessages.push("Club Name is required.");
    if (!clubData.contactInfo.trim())
      errorMessages.push("Contact Information is required.");
    if (!clubData.category.trim()) errorMessages.push("Category is required.");
    if (!clubData.clubDescription.trim())
      errorMessages.push("Description is required.");

    if (errorMessages.length > 0) {
      Alert.alert("Error", errorMessages.join("\n"));
      return;
    }
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleDeleteMember = (index) => {
    setClubData((prevData) => ({
      ...prevData,
      boardMembers: prevData.boardMembers.filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
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
              value={clubData.clubName}
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
              value={clubData.category}
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
              value={clubData.clubDescription}
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
              <TouchableOpacity
                onPress={() => setIsEditingContact(!isEditingContact)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>
                  {isEditingContact ? "Done" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={clubData.contactInfo}
              editable={isEditingContact}
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
            {clubData.boardMembers.map((member, index) => (
              <View key={index} style={styles.boardMemberCard}>
                <Image
                  source={{ uri: member.picture }}
                  style={styles.boardMemberPicture}
                />
                <View style={styles.boardMemberDetails}>
                  <Text style={styles.boardMemberName}>{member.name}</Text>
                  <Text style={styles.boardMemberRole}>{member.role}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("AddBoardMember", {
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
            ))}
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
    </View>
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
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007DA5",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  appLogo: {
    position: "absolute",
    left: 10,
    width: 50,
    height: 50,
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
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
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
  required: { color: "red", fontSize: 16 },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});

export default UpdateProfile;
