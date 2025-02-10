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

  useEffect(() => {
    if (route.params?.newMember) {
      // Add the new member to the clubData
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
    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = () => {
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header: Logo and Title */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")} // Replace with the correct path
          style={styles.appLogo}
        />
        <Text style={styles.title}>Update Profile</Text>
      </View>

      {/* Club Logo */}
      <TouchableOpacity onPress={handleUploadLogo} style={styles.logoWrapper}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.clubLogo} />
        ) : (
          <Text style={styles.logoPlaceholder}>+</Text>
        )}
      </TouchableOpacity>

      {/* Form */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Club Name</Text>
        <TextInput
          style={styles.input}
          value={clubData.clubName}
          editable={false}
          placeholder="Club Name"
          placeholderTextColor="#888"
        />
      </View>

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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact Information</Text>
        <TextInput
          style={styles.input}
          value={clubData.contactInfo}
          onChangeText={(value) =>
            setClubData((prevData) => ({ ...prevData, contactInfo: value }))
          }
          placeholder="Enter contact info"
          placeholderTextColor="#888"
        />
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
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  appLogo: {
    width: 80, // Bigger logo
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007DA5",
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
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "transparent",
    textAlignVertical: "top",
    height: 100,
  },
  boardMembersContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    padding: 15,
  },
  boardMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
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
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
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
});

export default UpdateProfile;
