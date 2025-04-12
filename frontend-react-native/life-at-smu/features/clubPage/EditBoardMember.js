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
import { useClub } from "../../Context/ClubContext";
import Constants from "expo-constants";
import axios from "axios";
import { useEffect } from "react";

const EditBoardMember = ({ navigation, route }) => {
  const { clubId } = useClub();
  const { editingMember } = route.params || {};
  const [name, setName] = useState(editingMember?.name || "");
  const [email, setEmail] = useState(editingMember?.email || "");
  const [facebookLink, setFacebookLink] = useState(
    editingMember?.facebookLink || ""
  );
  const [role, setRole] = useState(editingMember?.role || "");
  const [phoneNumber, setPhoneNumber] = useState(
    editingMember?.phoneNumber || ""
  );
  const [countryCode, setCountryCode] = useState("TN +216");
  const [profileImage, setProfileImage] = useState(
    editingMember?.profileImage || ""
  );
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [existingRoles, setExistingRoles] = useState([]);

  const isValidFacebookLink = (url) =>
    /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\/?=._-]+$/.test(url.trim());

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  useEffect(() => {
    if (editingMember) {
      setEmail(editingMember.user?.email || "");
      setFacebookLink(editingMember.facebookLink || "");
      setRole(editingMember.role || "");
      setPhoneNumber(editingMember.phoneNumber || "");
    }
  }, [editingMember]);

  useEffect(() => {
    const fetchUserByEmail = async () => {
      if (!email.trim()) {
        setInvalidEmail(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://${ipAddress}:8000/api/auth/user-by-email/${email
            .trim()
            .toLowerCase()}`
        );
        const user = response.data.user;
        setName(user.fullname || "");
        setProfileImage(user.picture || "");
        setInvalidEmail(false);
      } catch (error) {
        setName("");
        setProfileImage(null);
        setInvalidEmail(true);
      }
    };

    fetchUserByEmail();
  }, [email]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          `http://${ipAddress}:8000/api/auth/clubs/${clubId}`
        );
        const roles = res.data.club.boardMembers
          .filter((m) => m.user._id !== editingMember.user._id) // skip self
          .map((m) => m.role.toLowerCase());
        setExistingRoles(roles);
      } catch (e) {
        console.error("Failed to get roles", e);
      }
    };

    if (clubId && editingMember?.user?._id) fetchRoles();
  }, [clubId, editingMember]);

  const handleSave = async () => {
    if (!clubId) {
      Alert.alert("Error", "No club ID found.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Email is required.");
      return;
    }

    if (!role.trim()) {
      Alert.alert("Error", "Role is required.");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Phone number is required.");
      return;
    }

    const userId = editingMember?.user?._id;

    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }
    if (facebookLink && !isValidFacebookLink(facebookLink)) {
      Alert.alert("Invalid Link", "Please enter a valid Facebook link.");
      return;
    }

    if (existingRoles.includes(role.trim().toLowerCase())) {
      Alert.alert(
        "Role already exists",
        `The role "${role}" is already taken.`
      );
      return;
    }

    try {
      const response = await axios.put(
        `http://${ipAddress}:8000/api/auth/clubs/${clubId}/update-board-member`,
        {
          userId,
          role,
          phoneNumber,
          facebookLink,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Board member updated successfully.");
        navigation.navigate("ClubUpdate");
      }
    } catch (error) {
      console.error("Error updating board member:", error);
      Alert.alert("Error", "Could not update board member.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Edit Board Member</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.placeholderText}>+</Text>
          )}
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
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
            {invalidEmail && (
              <Text style={styles.errorText}>This email does not exist.</Text>
            )}
          </View>

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
              editable={false}
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
              editable={true}
              required={false}
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
              editable={true}
            />
          </View>

          {/* Phone Number Section */}
          <View style={styles.phoneNumberSection}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
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
                editable={true}
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
          onPress={() => navigation.navigate("ClubUpdate")}
        >
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
    paddingTop: 30,
  },
  logo: {
    position: "absolute",
    left: 0,
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
    marginLeft: 10,
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
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  ignoreButtonText: {
    color: "#007DA5",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
});

export default EditBoardMember;
