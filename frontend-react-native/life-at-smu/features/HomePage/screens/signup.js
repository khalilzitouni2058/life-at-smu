import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Button,
  Pressable,
  Alert,
} from "react-native";
import branch from "../../../assets/branch.png";
import { Dropdown } from "react-native-element-dropdown";
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
  const navigation = useNavigation();
  const { setUser } = useUser();
  const data = [
    { label: "MSB", value: "MSB" },
    { label: "Medtech", value: "Medtech" },
    { label: "LCI", value: "LCI" },
  ];
  const Major = [
    { label: "software-engineering", value: "software-engineering" },
    {
      label: "Computer-systems-Engineering",
      value: "Computer-systems-Engineering2",
    },
    {
      label: "Renewable-Energy-Engineering",
      value: "Renewable-Energy-Engineering",
    },
  ];
  const userData = {
    email: email,
    fullname: fullname,
    password: password,
    picture: photo,
    program: value,
    major: major,
  };
  const handleMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs", params: { screen: "HomeMain" } }],
    });
  };

  const signupUser = async (signupData) => {
    try {
      const response = await axios.post(
        `http://${ipAddress}:8000/api/auth/signup`,
        signupData
      );
      setUser(response.data.user);
      console.log("User signup successful:", response.data);
      handleMain();
    } catch (error) {
      if (error.response) {
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error setting up signup request:", error.message);
      }
    }
  };
  const handleEmailValidation = () => {
    if (email.length > 0 && !email.endsWith("@medtech.tn")) {
      return true;
    }
    return false;
  };
  const submithandler = () => {
    console.log(currentStep);
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
      if (handleemailsumbit()) {
        alert(
          "Email is wrong it must end with @medtech.tn ! Please try again."
        );
        return;
      }
    }
    if (currentStep === 2) {
      if (!handleConfirmPasswordValidation()) {
        alert("Passwords do not match. Please try again.");
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
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onEndEditing={handleEmailValidation}
            placeholder="someone@medtech.tn"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <Text style={styles.text3}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullname}
            onChangeText={setfullname}
            placeholder="Full Name"
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
            onChangeText={setPassword}
            placeholder="password"
            placeholderTextColor="#888"
          />
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
          <Text style={styles.text4}>Pick Your Program</Text>

          <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select an option"
            value={value}
            onChange={(item) => {
              console.log(item.label);
              setValue(item.value);
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            dropdownPosition={"top"}
          />
          <Text style={styles.text4}>Pick Your Major</Text>

          <Dropdown
            style={styles.dropdown}
            data={Major}
            labelField="label"
            valueField="value"
            placeholder="Select an option"
            value={major}
            onChange={(item) => setmajor(item.value)}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            dropdownPosition={"top"}
          />
        </View>
      )}

      {/* Next Button */}
      <TouchableOpacity
        onPress={currentStep === 4 ? () => submithandler() : handleNextStep}
        style={[styles.button, currentStep === 3 ? styles.button2 : null]}
      >
        <Text style={styles.buttonText}>
          {currentStep === 3 ? "Submit" : "Next Step"}
        </Text>
      </TouchableOpacity>
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
  dropdown: {
    marginTop: "20",
    color: "white",
    height: 50,
    borderColor: "#007DA5",
    backgroundColor: "#007DA5",
    borderWidth: 1,
    paddingHorizontal: 8,
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

    top: -80,

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
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "center",
  },
});
