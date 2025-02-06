import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "react-native-vector-icons";
import * as ImagePicker from 'expo-image-picker'; // Image picker to allow users to choose a new picture

const EditProfile = ({  navigation }) => {

  const [user, setUser] = useState({
    picture:
      "https://th.bing.com/th/id/OIP.QZIRZKUSWt1HBifjDRKGzAHaFj?w=212&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    fullname: "John Doe",
    email: "john.doe@example.com",
    program: "Computer Science",
    major: "Software Engineering",
  });

  // States for input fields
  const [username, setUsername] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [program, setProgram] = useState(user.program);
  const [profilePicture, setProfilePicture] = useState(user.picture);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };


  

  const handleSave = () => {
    console.log("Saved user details:", { username, email, major, program, profilePicture });
    
    navigation.navigate('Profile', {
      updatedUser: { username, email, major, program, profilePicture }
    });
  
    
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <TouchableOpacity onPress={pickImage} style={styles.changePictureButton}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Input fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Major"
          value={major}
          onChangeText={setMajor}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Program"
          value={program}
          onChangeText={setProgram}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePictureButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007DA5",
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputField: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
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
