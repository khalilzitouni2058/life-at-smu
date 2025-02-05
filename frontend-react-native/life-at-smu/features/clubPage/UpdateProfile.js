import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

const UpdateProfile = ({ navigation }) => {
  const [clubData, setClubData] = useState({
    clubName: "",
    category: "",
    clubDescription: "",
    contactInfo: "",
    boardMembers: [],
  });

  const handleInputChange = (name, value) => {
    setClubData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProfile = () => {
    Alert.alert("Success", "Profile updated successfully!");
  };

  const navigateToAddBoardMember = () => {
    navigation.navigate("AddBoardMember");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Club Name</Text>
        <TextInput
          style={styles.input}
          value={clubData.clubName}
          editable={false}
          placeholder="Club Name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={clubData.category}
          onChangeText={(value) => handleInputChange("category", value)}
          placeholder="Enter category"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Club Description</Text>
        <TextInput
          style={styles.textarea}
          value={clubData.clubDescription}
          onChangeText={(value) => handleInputChange("clubDescription", value)}
          placeholder="Enter club description"
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact Information</Text>
        <TextInput
          style={styles.input}
          value={clubData.contactInfo}
          onChangeText={(value) => handleInputChange("contactInfo", value)}
          placeholder="Enter contact info"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Board Members</Text>
        {clubData.boardMembers.length > 0 ? (
          clubData.boardMembers.map((member, index) => (
            <Text key={index} style={styles.member}>
              {member.name} - {member.role}
            </Text>
          ))
        ) : (
          <Text style={styles.placeholder}>No board members added.</Text>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={navigateToAddBoardMember}
        >
          <Text style={styles.editButtonText}>Add a New Board Member</Text>
        </TouchableOpacity>
      </View>

      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    height: 100,
    textAlignVertical: "top",
  },
  member: {
    fontSize: 14,
    marginBottom: 5,
  },
  placeholder: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
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
});

export default UpdateProfile;
