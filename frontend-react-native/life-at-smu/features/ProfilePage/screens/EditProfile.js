import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import Constants from "expo-constants";


const EditProfile = ({ navigation, route }) => {
  console.log(route.params.user);

  const [fullname, setFullname] = useState(route.params.user.fullname);
  const [email, setEmail] = useState(route.params.user.email);
  const [major, setMajor] = useState(route.params.user.major);
  const [program, setProgram] = useState(route.params.user.program);
  const [picture, setPicture] = useState(route.params.user.picture);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const validateEmail = (email) => {
    return email.endsWith("@medtech.tn");
  };

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";


  const handleSave = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    console.log("Saved user details:", { fullname, email, major, program, picture });
  
    try {
      const response = await axios.put(`http://${ipAddress}:8000/api/auth/users/${route.params.user.id}`, {
        fullname,
        email,
        major,
        program,
        picture,
      });
  
      if (response.status === 200) {
        console.log('User updated:', response.data);
        navigation.navigate('Profile', {
          updatedUser: { fullname, email, major, program, picture },
        });
      } else {
        console.error('Update failed:', response.data);
        alert('Error updating user!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error or server unavailable!');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/backgroundProfile.jpg")} style={styles.backgroundImage} />
      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: picture }} style={styles.profilePicture} />
        <TouchableOpacity onPress={pickImage} style={styles.changePictureButton}>
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>

      
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <MaterialIcons
            name={validateEmail(email) ? "check-circle" : "cancel"}
            size={24}
            color={validateEmail(email) ? "green" : "red"}
            style={styles.icon}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Major"
            value={major}
            onChangeText={setMajor}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Program"
            value={program}
            onChangeText={setProgram}
          />
        </View>
      

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    width: "100%",
    resizeMode: "cover",
    zIndex:3,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 30,
    zIndex:4,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePictureButton: {
    marginTop: 10,
    backgroundColor: "#007DA5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  changePictureText: {
    color: "#fff",
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    zIndex:1,
  },
  inputField: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
    zIndex:2,
  },
  icon: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#007DA5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfile;
