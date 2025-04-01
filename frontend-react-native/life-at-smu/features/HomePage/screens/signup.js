import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import branch from "../../../assets/branch.png";
import { useUser } from "../../../Context/UserContext";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import axios from "axios";

export default function SignUpPage() {
  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [fullname, setfullname] = useState("");
  const [photo, setPhoto] = useState(null);
  const [value, setValue] = useState(null);
  const [major, setmajor] = useState(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const navigation = useNavigation();
  const { setUser } = useUser();

  const programOptions = ["MSB", "Medtech"];
  const medtechMajors = [
    "Software Engineering",
    "Computer Systems Engineering",
    "Renewable Energy Engineering",
  ];
  const msbMajors = [
    "Marketing",
    "Finance",
    "Business Analytics",
    "Management",
  ];

  const getMajorsForProgram = (program) => {
    if (program === "Medtech") return medtechMajors;
    if (program === "MSB") return msbMajors;
    return [];
  };

  const [majorOptions, setMajorOptions] = useState([]);

  const defaultPhotoUrl =
    "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";

  const userData = {
    email: email,
    fullname: fullname,
    password: password,
    picture: photo || defaultPhotoUrl,
    program: value,
    major: major,
  };
  const handleMain = () => {
    navigation.navigate("HomeMain");
  };
  const signupUser = async (signupData) => {
    try {
      const response = await axios.post(
        `http://${ipAddress}:8000/api/auth/signup`,
        signupData
      );
      if (response.data && response.data.user) {
        setUser(response.data.user);
        console.log("User signup successful:", response.data.user);
        handleMain();
      }
    } catch (error) {
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data.message === "User already exists"
        ) {
          alert("This email is already registered. Please use another one.");
        } else {
          alert("Signup failed: " + error.response.data.message);
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("Server not responding. Please try again later.");
      } else {
        console.error("Error setting up signup request:", error.message);
        alert("Something went wrong. Please try again.");
      }
    }
  };
  const handleEmailValidation = () => {
    if (
      email.length > 0 &&
      !email.endsWith("@medtech.tn") &&
      !email.endsWith("@msb.tn")
    ) {
      return true;
    }
    return false;
  };
  const submithandler = () => {
    if (!value || !major) {
      alert("Please select both your program and major.");
      return;
    }
    signupUser(userData);
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

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!email || !fullname) {
        alert("Email and username are required.");
        return;
      }

      if (emailAvailable === false) {
        alert("This email is already registered. Please use another one.");
        return;
      }

      if (handleemailsumbit()) {
        alert(
          "Email is wrong. It must end with @medtech.tn or @msb.tn. Please try again."
        );
        return;
      }
    }
    if (currentStep === 2) {
      if (!password || !confirmpassword) {
        alert("Please fill out both password fields.");
        return;
      }

      if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if (!handleConfirmPasswordValidation()) {
        alert("Passwords do not match.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleConfirmPasswordValidation = () => {
    if (password === confirmpassword) {
      return true;
    }
  };
  const handleemailsumbit = () => {
    return handleEmailValidation();
  };

  let emailCheckTimeout;

  const checkEmailExists = (inputEmail) => {
    if (emailCheckTimeout) clearTimeout(emailCheckTimeout);

    setCheckingEmail(true);
    emailCheckTimeout = setTimeout(async () => {
      try {
        const response = await axios.post(
          `http://${ipAddress}:8000/api/auth/check-email`,
          {
            email: inputEmail,
          }
        );

        setEmailAvailable(!response.data.exists); // true if not found
      } catch (error) {
        console.error("Email check failed:", error);
        setEmailAvailable(false);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
  };

  const getBarStyle = (step) => {
    return {
      backgroundColor: currentStep >= step ? "#007DA5" : "#ccc",
    };
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={branch} />
      {currentStep != 3 && <Image style={styles.image2} source={branch} />}

      {/* Progress Bars */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, getBarStyle(1)]}></View>
        <View style={[styles.progressBar, getBarStyle(2)]}></View>
        <View style={[styles.progressBar, getBarStyle(3)]}></View>
      </View>
      <Text style={styles.title}>
        {currentStep === 1
          ? "Create Account"
          : currentStep === 2
          ? "Next Step"
          : "Almost Done !"}
      </Text>
      {/* Form steps */}
      {currentStep === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.text3}>Email</Text>
          <TextInput
            style={[styles.input]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              checkEmailExists(text);
            }}
            onEndEditing={handleEmailValidation}
            autoCapitalize="none"
            placeholder="someone@medtech.tn"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          {emailAvailable === false && (
            <Text style={{ color: "red", fontSize: 13, marginTop: 4 }}>
              This email is already registered.
            </Text>
          )}
          <Text style={styles.text3}>Username</Text>
          <TextInput
            style={styles.input}
            value={fullname}
            onChangeText={setfullname}
            placeholder="Username"
            placeholderTextColor="#888"
          />
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.text3}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordTooShort(text.length > 0 && text.length < 8);
            }}
            placeholder="Password"
            placeholderTextColor="#888"
          />
          {passwordTooShort && (
            <Text style={{ color: "red", fontSize: 13, marginTop: 4 }}>
              Password must be at least 8 characters long.
            </Text>
          )}
          <Text style={styles.text3}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmpassword}
            onChangeText={setconfirmpassword}
            onEndEditing={handleConfirmPasswordValidation}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry={true}
          />
        </View>
      )}

      {currentStep === 3 && (
        <View style={styles.stepContainer}>
          <Pressable onPress={handleUploadPhoto} style={styles.imageWrapper}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.circularImage} />
            ) : (
              <Text style={styles.placeholderText}>Tap to Upload</Text>
            )}
          </Pressable>

          {/* Program Picker */}
          <Text style={styles.text4}>Pick Your Program</Text>
          <TouchableOpacity
            onPress={() => setShowProgramModal(true)}
            style={styles.selectBox}
          >
            <Text style={styles.selectText}>{value || "Select a program"}</Text>
          </TouchableOpacity>

          {/* Major Picker */}
          <Text style={styles.text4}>Pick Your Major</Text>
          <TouchableOpacity
            onPress={() => {
              if (value) {
                setShowMajorModal(true);
              } else {
                alert("Please select a program first.");
              }
            }}
            style={[
              styles.selectBox,
              !value && { backgroundColor: "#ccc" }, // gray out when disabled
            ]}
          >
            <Text style={styles.selectText}>{major || "Select a major"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Next Button */}
      <TouchableOpacity
        onPress={currentStep === 3 ? submithandler : handleNextStep}
        style={[styles.button, currentStep === 3 ? styles.button2 : null]}
      >
        <Text style={styles.buttonText}>
          {currentStep === 3 ? "Submit" : "Next Step"}
        </Text>
      </TouchableOpacity>

      {/* Program Picker Modal */}
      <Modal
        visible={showProgramModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProgramModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowProgramModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <FlatList
              data={programOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setValue(item);
                    setMajorOptions(getMajorsForProgram(item)); // ✅ update major list
                    setmajor(null); // ✅ reset previous major
                    setShowProgramModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Major Picker Modal */}
      <Modal
        visible={showMajorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMajorModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMajorModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <FlatList
              data={majorOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setmajor(item);
                    setShowMajorModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedTextStyle: {
    color: "white",
  },
  placeholderStyle: {
    color: "white",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
    marginTop: 65,
  },
  image: {
    width: 130,
    height: 130,
    position: "absolute",
    left: 260,
    top: 150,
    transform: [{ rotate: "150deg" }],
  },
  image2: {
    width: 180,
    height: 150,
    position: "absolute",
    right: 260,
    top: 450,
    transform: [{ rotate: "-50deg" }],
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",

    padding: 20,
  },
  text3: {
    color: "#007DA5",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingTop: 20,
  },
  text4: {
    color: "#007DA5",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",

    paddingTop: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 100,
    color: "#007DA5",
    alignSelf: "center",
  },
  title2: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#007DA5",
    alignSelf: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  progressBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 50,
    marginTop: 20,
  },
  progressBar: {
    width: "30%",
    height: 5,
    borderRadius: 3,
    margin: 2,
  },
  stepContainer: {},
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    left: 80,
    top: -40,
    borderWidth: 2,
    borderColor: "#ddd",
    marginTop: 16,
  },
  circularImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  stepText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007DA5",
    padding: 10,
    borderRadius: 5,
    marginTop: 210,
  },
  button2: {
    backgroundColor: "#007DA5",
    padding: 10,
    borderRadius: 5,
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  selectBox: {
    backgroundColor: "#007DA5",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    width: "100%",
  },
  selectText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  modalOptionText: {
    fontSize: 16,
    color: "#007DA5",
    textAlign: "center",
  },
});
