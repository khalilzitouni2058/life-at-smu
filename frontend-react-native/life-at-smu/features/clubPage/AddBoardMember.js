import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const AddBoardMember = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("TN +216");
  const [profileImage, setProfileImage] = useState(null); // Declare profileImage state

  const handleImageUpload = async () => {
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
      setProfileImage(result.assets[0].uri); // Set the selected image URI to the state
    }
  };

  const handleSave = () => {
    if (!name || !email || !role) {
      Alert.alert("Error", "Please fill out all required fields!");
      return;
    }

    navigation.navigate("UpdateProfile", {
      newMember: {
        name,
        email,
        facebookLink,
        role,
        phoneNumber,
        countryCode,
        profileImage,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")} // Replace with the correct path
          style={styles.logo}
        />
        <Text style={styles.title}>Add Board Member</Text>
      </View>

      {/* Profile Image Upload */}
      <TouchableOpacity onPress={handleImageUpload} style={styles.imageWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.placeholderText}>+</Text>
        )}
      </TouchableOpacity>

      {/* Form */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Name"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Facebook Link</Text>
        <TextInput
          style={styles.input}
          value={facebookLink}
          onChangeText={setFacebookLink}
          placeholder="Enter Facebook Link"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Role</Text>
        <TextInput
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="Enter Role"
          placeholderTextColor="#888"
        />
      </View>

      {/* Add Phone Number Section */}
      <View style={styles.phoneNumberSection}>
        <Text style={styles.label}>Add Phone Number</Text>
        <View style={styles.phoneInputContainer}>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{countryCode}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter Phone Number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007DA5",
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
  phoneNumberSection: {
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: "#007DA5",
    fontWeight: "bold",
  },
  phoneInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  saveButton: {
    backgroundColor: "#007DA5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 36,
    color: "#ccc",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default AddBoardMember;
