import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const AddBoardMember = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("TN +216");
  const [profileImage, setProfileImage] = useState(null);

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
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    let errorMessages = [];
    console.log("Save button clicked!");
    if (!name.trim()) {
      errorMessages.push("Name is required.");
    }
    if (!email.trim()) {
      errorMessages.push("Email is required.");
    }
    if (!role.trim()) {
      errorMessages.push("Role is required.");
    }
    if (!phoneNumber.trim()) {
      errorMessages.push("Phone number is required.");
    }
    console.log("Error Messages:", errorMessages);
    if (errorMessages.length > 0) {
      Alert.alert("Error", errorMessages.join("\n")); // Show all errors
      return; // Stop execution if there are errors
    }

    // If no errors, navigate to the UpdateProfile screen with data
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
    <View style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Add Board Member</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Upload */}
        <TouchableOpacity
          onPress={handleImageUpload}
          style={styles.imageWrapper}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.placeholderText}>+</Text>
          )}
        </TouchableOpacity>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter Name"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
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
            <Text style={styles.label}>
              Role <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={role}
              onChangeText={setRole}
              placeholder="Enter Role"
              placeholderTextColor="#888"
            />
          </View>

          {/* Phone Number Section */}
          <View style={styles.phoneNumberSection}>
            <Text style={styles.label}>
              Add Phone Number <Text style={styles.required}>*</Text>
            </Text>
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
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* Ignore Button */}
        <TouchableOpacity
          style={styles.ignoreButton}
          onPress={() => navigation.navigate("UpdateProfile")}
        >
          <Text style={styles.ignoreButtonText}>Ignore</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007DA5",
    paddingVertical: 20,
  },
  logo: {
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
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 20,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 36,
    color: "#ccc",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  required: {
    color: "red",
    fontSize: 16,
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
  ignoreButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  ignoreButtonText: {
    color: "#007DA5",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AddBoardMember;
