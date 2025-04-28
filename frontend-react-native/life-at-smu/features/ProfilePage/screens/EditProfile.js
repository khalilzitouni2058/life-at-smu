import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Menu, Button, Divider, Provider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Constants from "expo-constants";
import usericon from "../../../assets/usericon.png";
import majoricon from "../../../assets/majoricon.png";
import mailicon from "../../../assets/mailicon.png";
import programicon from "../../../assets/programicon.png";
import { Animated } from "react-native";
import branch from "../../../assets/branch.png";

const EditProfile = ({ navigation, route }) => {
  console.log(route.params?.user);

  const [fullname, setFullname] = useState(
    route.params?.user.fullname || "Seif"
  );
  const [email, setEmail] = useState(
    route.params?.user.email || "X@medtech.tn"
  );
  const [major, setMajor] = useState(
    route.params?.user.major || "Software Engineer"
  );
  const [program, setProgram] = useState(
    route.params?.user.program || "Medtech"
  );
  const [picture, setPicture] = useState(
    route.params?.user.picture ||
      "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"
  );
    const [urlphoto, setUrlphoto] = useState("");
  

  const [programMenuVisible, setProgramMenuVisible] = useState(false);
  const [majorMenuVisible, setMajorMenuVisible] = useState(false);

  const programs = ["MSB", "Medtech"];
  const medtechmajors = [
    "Pre-engineering",
    "Software Engineering",
    "Renewable Energy",
    "Computer Engineering",
  ];

  const msbMajors = [
    "Marketing",
    "Finance",
    "Business Analytics",
    "Management",
  ];

  


  const userData = {
    email: email,
    fullname: fullname,
    picture: picture ,
    program: program,
    major: major,
  };


  const handleUploadPhoto = async () => {
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
    
      if (result.canceled) {
        return;
      }
    
      const uri = result.assets[0].uri;
      
  
      if (result.canceled) {
        return;
      }
  
      
  
      const uploadedImageUrl = await uploadImage(uri);
      if (uploadedImageUrl) {
        console.log("Uploaded Image URL:", uploadedImageUrl);
        // Use uploadedImageUrl instead of result.uri
      }

      setPicture(uploadedImageUrl);

    };
  
    const uploadImage = async (uri) => {
      const formData = new FormData();
      formData.append("source", {
        uri,
        name: "photo.jpg", // Required for FormData
        type: "image/jpeg",
      });
  
      try {
        const response = await fetch("https://postimage.me/api/1/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key":
              "chv_ZtFY_1d68e60bdc2a3a9f47650fa766b07390e1b69aac2a4ee7d94a3d52e0b853cd8783e54a37fef88448278f2c92526b7f87b9da5acdc486f91f784f0891e651454a",
          },
        });
  
        const data = await response.json();
  
        if (data) {
          setUrlphoto(data.image.url);
          return data.image.url;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    };

  

  const validateEmail = (email) => {
    return email.endsWith("@medtech.tn") || email.endsWith("@msb.tn");
  };

  const slideAnim = useRef(new Animated.Value(300)).current;
  const branchOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(branchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, branchOpacity]);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  

  const handleSave = async () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    console.log("Saved user details:", {
      fullname,
      email,
      major,
      program,
      picture,
    });

    try {
      const response = await axios.put(
        `http://${ipAddress}:8000/api/auth/users/${route.params.user.id}`,
        userData
      );

      if (response.status === 200) {
        console.log("User updated:", response.data);
        navigation.navigate("Profile", {
          updatedUser: { fullname, email, major, program, picture },
        });
      } else {
        console.error("Update failed:", response.data);
        alert("Error updating user!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error or server unavailable!");
    }
  };

  return (
    <Provider>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <Animated.Image
                source={branch}
                style={[
                  styles.image,
                  styles.topRight,
                  { opacity: branchOpacity },
                ]}
              />

              

              <View style={styles.profilePictureContainer}>
                <Image
                  source={{ uri: picture }}
                  style={styles.profilePicture}
                />
                <TouchableOpacity
                  onPress={handleUploadPhoto}
                  style={styles.changePictureButton}
                >
                  <Image
                    source={require("../../../assets/change.png")}
                    style={styles.changePictureButton}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Image source={usericon} style={styles.Inputicon} />
                  <View
                    style={{
                      display: "flex",
                      width: "90%",
                      marginLeft: 10,
                    }}
                  >
                    <TextInput
                      style={styles.inputField}
                      placeholder="Username"
                      value={fullname}
                      onChangeText={setFullname}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Image source={mailicon} style={styles.Inputicon} />
                  <View
                    style={{
                      display: "flex",
                      width: "90%",
                      marginLeft: 10,
                    }}
                  >
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                      />
                      <MaterialIcons
                        name={validateEmail(email) ? "check-circle" : "cancel"}
                        size={25}
                        color={validateEmail(email) ? "green" : "red"}
                        style={styles.icon}
                      />
                    </View>
                  </View>
                </View>

                {/* Program Dropdown */}
                <View style={styles.inputWrapper}>
                  <Image source={programicon} style={styles.Inputicon} />
                  <Menu
                    visible={programMenuVisible}
                    onDismiss={() => setProgramMenuVisible(false)}
                    anchor={
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setProgramMenuVisible(true)}
                      >
                        <Text style={styles.dropdownText}>{program}</Text>
                      </TouchableOpacity>
                    }
                  >
                    {programs.map((item, index) => (
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          setProgram(item);
                          setProgramMenuVisible(false);
                        }}
                        title={item}
                        titleStyle={styles.menuItemText}
                      />
                    ))}
                  </Menu>
                </View>

                {/* Major Dropdown */}
                <View style={styles.inputWrapper}>
                  <Image source={majoricon} style={styles.Inputicon} />
                  <Menu
                    visible={majorMenuVisible}
                    onDismiss={() => setMajorMenuVisible(false)}
                    anchor={
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setMajorMenuVisible(true)}
                      >
                        <Text style={styles.dropdownText}>{major}</Text>
                      </TouchableOpacity>
                    }
                  >
                    {(program === "MSB" ? msbMajors : medtechmajors).map((item, index) => (
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          setMajor(item);
                          setMajorMenuVisible(false);
                        }}
                        title={item}
                        titleStyle={styles.menuItemText}
                      />
                    ))}
                  </Menu>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText} onPress={handleSave}>
                    Update
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },

  Inputicon: {
    height: 30,
    width: 30,
  },

  profilePictureContainer: {
    alignItems: "center",
    position: "relative",
    zIndex: 4,
    marginTop: 40,
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#004F71",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  changePictureButton: {
    height: 40,
    width: 40,
    top: -15,
    left: 22,
  },
  changePictureText: {
    color: "#fff",
    fontSize: 14,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",

    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 30,
    zIndex: 6,
    padding: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 15,
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#007DA5",
  },
  inputField: {
    flex: 1,
    padding: 8,
    fontSize: 18,
    fontWeight: 400,
    color: "#333",
    zIndex: 2,
  },
  icon: {
    marginLeft: 10,
    top:7,
  },
  saveButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 5,
    marginHorizontal: 60,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  image: {
    width: 130,
    height: 130,
    position: "absolute",
    zIndex: 10,
  },
  topRight: {
    top: 40,
    right: -50,
    transform: [{ rotate: "130deg" }],
  },
  bottomLeft: {
    bottom: 100,
    left: -50,
    transform: [{ rotate: "-25deg" }],
  },
  dropdownButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingRight: 30,
    marginLeft: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  dropdownText: { fontSize: 16, fontWeight: "bold", color: "#007DA5" },
  menuItemText: { fontSize: 16, color: "#007DA5" },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    zIndex: 10,
    gap: 20,
  },
  cancelButton: {
    backgroundColor: "#ff5b51",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "50%",
  },
  cancelButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  
  saveButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "50%",
  },
  saveButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});

export default EditProfile;
