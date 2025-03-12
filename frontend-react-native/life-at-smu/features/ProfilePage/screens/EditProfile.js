import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import Constants from "expo-constants";
import usericon from "../../../assets/usericon.png"
import majoricon from "../../../assets/majoricon.png"
import mailicon from "../../../assets/mailicon.png"
import programicon from "../../../assets/programicon.png"
import { Animated } from "react-native";
import branch from "../../../assets/branch.png";



const EditProfile = ({ navigation, route }) => {
  console.log(route.params?.user);

  const [fullname, setFullname] = useState(route.params?.user.fullname || "Seif");
  const [email, setEmail] = useState(route.params?.user.email || "X@medtech.tn");
  const [major, setMajor] = useState(route.params?.user.major || "Software Engineer");
  const [program, setProgram] = useState(route.params?.user.program || "Medtech");
  const [picture, setPicture] = useState(route.params?.user.picture || "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D");

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


  const slideAnim = useRef(new Animated.Value(300)).current; // Start below the screen
    const branchOpacity = useRef(new Animated.Value(0)).current; // Initial opacity for branches
  
    useEffect(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to its position
          duration: 500, // Duration of the animation
          useNativeDriver: true, // Enable native driver
        }),
        Animated.timing(branchOpacity, {
          toValue: 1, // Make branches fully visible
          duration: 300, // Slightly faster to appear before the grid finishes
          useNativeDriver: true,
        }),
      ]).start();
    }, [slideAnim, branchOpacity]);



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
      <Animated.Image
                source={branch}
                style={[styles.image, styles.topRight, { opacity: branchOpacity }]}
              />
              <Animated.Image
                source={branch}
                style={[styles.image, styles.bottomLeft, { opacity: branchOpacity }]}
              />

      <Image source={require("../../../assets/bluecurves.jpg")} style={styles.backgroundImage} />
      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: picture }} style={styles.profilePicture} />
        <TouchableOpacity onPress={pickImage} style={styles.changePictureButton}>
        <Image source={require("../../../assets/camera.png") } style={styles.changePictureButton} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
         
        <Image source={usericon } style={styles.Inputicon} />
        <View style={{display:"flex",width:"90%",marginLeft:10,marginTop:5}} >
        <Text style={{color:"gray"}}>Username</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            value={fullname}
            onChangeText={setFullname}
          /></View>
        </View>
        <View style={styles.inputWrapper}>
        <Image source={ mailicon } style={styles.Inputicon} />
        <View style={{display:"flex",width:"90%",marginLeft:10,marginTop:5}} >
        <Text style={{color:"gray"}}>Email</Text>
          <View style={{display:"flex",flexDirection:"row"}}>
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
          /></View></View>
        </View>
        <View style={styles.inputWrapper}>
        <Image source={majoricon } style={styles.Inputicon} />
        <View style={{display:"flex",width:"90%",marginLeft:10,marginTop:5}} >
        <Text style={{color:"gray"}}>Major</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Major"
            value={major}
            onChangeText={setMajor}
          /></View>
        </View>
        <View style={styles.inputWrapper}>
        <Image source={programicon } style={styles.Inputicon} />
        <View style={{display:"flex",width:"90%",marginLeft:10,marginTop:5}} >
        <Text style={{color:"gray"}}>Program</Text>

          <TextInput
            style={styles.inputField}
            placeholder="Program"
            value={program}
            onChangeText={setProgram}
          /></View>
        </View>
        </View>

      <TouchableOpacity  style={styles.saveButton}>
        <Text style={styles.saveButtonText} onPress={handleSave}>Update</Text>
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

  Inputicon:{
    height:35,
    width:35,

  },

  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 300,
    height: 800,
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
    borderWidth:2,
    borderColor:"#007DA5" ,
  },
  changePictureButton: {
    height:30,
    width:30,
    top:-10,
    left:15,
  },
  changePictureText: {
    color: "#fff",
    fontSize: 14,
  },
  inputContainer: {
    display:"flex",
    flexDirection:"column",
    marginBottom: 20,
    gap:10,
    zIndex:10,
    
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical:5,
    borderRadius: 30,
    marginBottom: 15,
    zIndex:1,
    borderWidth:2,
    borderColor:"#007DA5" ,
  },
  inputField: {
    flex: 1,
    padding: 20,
    fontSize: 20,
    fontWeight:400,
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
    zIndex:5,
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
    zIndex:10,
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
});

export default EditProfile;
