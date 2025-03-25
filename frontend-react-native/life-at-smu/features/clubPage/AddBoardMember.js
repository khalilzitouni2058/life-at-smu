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
import { useClub } from "../../Context/ClubContext";
import Constants from "expo-constants";
import axios from "axios";

const AddBoardMember = ({ navigation }) => {
  const { clubId } = useClub();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("TN +216");
  const [profileImage, setProfileImage] = useState(null);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  const handleSave = async () => {
    if (!clubId) {
      Alert.alert("Error", "Club ID not found.");
      return;
    }

    if (!name.trim() || !email.trim() || !role.trim() || !phoneNumber.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    const formattedPhoneNumber = `${countryCode} ${phoneNumber}`;

    const newMember = {
      name,
      email,
      facebookLink,
      role,
      phoneNumber: formattedPhoneNumber,
      profilePicture:
        profileImage ||
        "https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/469963732_2801171663397034_3870197941446985944_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uqzP4t61bloQ7kNvgGuZweS&_nc_oc=AdiZi3rCnmG1hpiNhZIlx-rDtV1XEM0uwGxQef6qz8dJ724A7BKL5cPjYMLA5Di_4-4&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=Akr1sLeZP0dLZ-JjE-afwYi&oh=00_AYAjfD91fKYDbB1FqX_D4lx-qx5KrgPJCj9enbH2X8cEIg&oe=67AFB8AB",
    };

    try {
      await axios.put(
        `http://${ipAddress}:8000/api/auth/clubs/${clubId}/add-board-member`,
        newMember
      );
      Alert.alert("Success", "Board member added successfully!");
      navigation.navigate("ClubUpdate"); // ✅ Navigate back to ClubUpdate
    } catch (error) {
      console.error("Error adding board member:", error);
      Alert.alert("Error", "Could not add board member.");
    }
  };

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
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
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
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
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
            onPress={() => navigation.navigate("ClubUpdate")}
            <Text style={styles.ignoreButtonText}>Cancel</Text>
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
};
export default AddBoardMember;
