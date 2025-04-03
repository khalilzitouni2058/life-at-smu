import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {Menu, Button, Divider, Provider } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import Constants from "expo-constants";
import usericon from "../../../assets/usericon.png"
import majoricon from "../../../assets/majoricon.png"
import mailicon from "../../../assets/mailicon.png"
import programicon from "../../../assets/programicon.png"
import change from "../../../assets/change.png"
import { Animated } from "react-native";
import branch from "../../../assets/branch.png";
import RNPickerSelect from 'react-native-picker-select';




const EditProfile = ({ navigation, route }) => {
  console.log(route.params?.user);

  const [fullname, setFullname] = useState(route.params?.user.fullname || "Seif");
  const [email, setEmail] = useState(route.params?.user.email || "X@medtech.tn");
  const [major, setMajor] = useState(route.params?.user.major || "Software Engineer");
  const [program, setProgram] = useState(route.params?.user.program || "Medtech");
  const [picture, setPicture] = useState(route.params?.user.picture || "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D");


  const [programMenuVisible, setProgramMenuVisible] = useState(false);
  const [majorMenuVisible, setMajorMenuVisible] = useState(false);

  const programs = ["MSB", "Medtech"];
  const majors = ["Pre-engineering", "Software Engineering", "Renewable Energy", "Computer Engineering"];

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
    <Provider>
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Animated.Image
            source={branch}
            style={[styles.image, styles.topRight, { opacity: branchOpacity }]}
          />
  

          <Image source={require("../../../assets/bluecurves.jpg")} style={styles.backgroundImage} />
          
          <View style={styles.profilePictureContainer}>
            <Image source={{ uri: picture }} style={styles.profilePicture} />
            <TouchableOpacity onPress={pickImage} style={styles.changePictureButton}>
              <Image source={require("../../../assets/change.png")} style={styles.changePictureButton} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Image source={usericon} style={styles.Inputicon} />
              <View style={{ display: "flex", width: "90%", marginLeft: 10, marginTop: 5 }}>
                <Text style={{ color: "gray" }}>Username</Text>
                <TextInput style={styles.inputField} placeholder="Username" value={fullname} onChangeText={setFullname} />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Image source={mailicon} style={styles.Inputicon} />
              <View style={{ display: "flex", width: "90%", marginLeft: 10, marginTop: 5 }}>
                <Text style={{ color: "gray" }}>Email</Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TextInput style={styles.inputField} placeholder="Email" value={email} onChangeText={setEmail} />
                  <MaterialIcons name={validateEmail(email) ? "check-circle" : "cancel"} size={24} color={validateEmail(email) ? "green" : "red"} style={styles.icon} />
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
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setProgramMenuVisible(true)}>
                  <Text style={styles.dropdownText}>{program}</Text>
                </TouchableOpacity>
              }>
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
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setMajorMenuVisible(true)}>
                  <Text style={styles.dropdownText}>{major}</Text>
                </TouchableOpacity>
              }>
              {majors.map((item, index) => (
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
    <Text style={styles.saveButtonText} onPress={handleSave}>Update</Text>
  </TouchableOpacity>  
  <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
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
    position: "relative",
    width:400,
    height:"100%",
  },

  Inputicon:{
    height:35,
    width:35,

  },

  backgroundImage: {
    position: "absolute",
    height: 800,
    width: "100%",
    resizeMode: "cover",
    zIndex:3,
  },
  profilePictureContainer: {
    alignItems: "center", 
    position: "relative" ,
    zIndex:4,
    marginTop:40,
    
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
    height:40,
    width:40,
    top:-15,
    left:22,
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
    paddingHorizontal:30,
    zIndex:6,
    padding:0,
    
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
    padding: 8,
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
    marginHorizontal:60,
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
  dropdownButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingRight:30,
    marginLeft:20,
    paddingVertical: 10,
    alignItems: "center",
  },
  dropdownText: { fontSize: 16, fontWeight: "bold", color: "#007DA5" },
  menuItemText: { fontSize: 16, color: "#007DA5" },
  buttonContainer: { flexDirection: "column", alignItems:"center",marginTop: 20, zIndex:10, gap:20 },
cancelButton: { backgroundColor: "#FF4D4D", paddingVertical: 12, borderRadius: 8, alignItems: "center", width: "60%" },
cancelButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
saveButton: { backgroundColor: "#007DA5", paddingVertical: 12, borderRadius: 8, alignItems: "center", width: "70%" },
saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default EditProfile;