import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import branch from "../../../assets/branch.png";
import logo from "../../../assets/logo.png";
import { useUser } from "../../../Context/UserContext";
import { useClub } from "../../../Context/ClubContext";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = () => {
  const { setUser } = useUser();
  const { setClubId, setFirstLogin } = useClub();
  const [showText, setShowText] = useState(false);
  const topRightAnim = useRef(new Animated.Value(-500)).current;
  const bottomLeftAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }
    try {
      const clubResponse = await axios.post(
        `http://${ipAddress}:8000/api/auth/clubs/login`,
        {
          email,
          password,
        }
      );

      if (clubResponse.status === 200 && clubResponse.data.club) {
        const club = clubResponse.data.club;
        console.log("Club login successful:", club);
        setClubId(club._id);
        setFirstLogin(club.firstLogin);
        setUser(null); 

        await AsyncStorage.setItem("userType", "club");
        await AsyncStorage.setItem("club", JSON.stringify(club));

        if (club.firstLogin === true) {
          navigation.replace("ClubUpdate");
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "MainTabs", params: { screen: "HomeMain" } }],
            })
          );
        }
        return;
      }
    } catch (clubError) {
      if (clubError.response?.status === 401) {
        console.error("Invalid club credentials.");
      } else {
        console.error("Club login error:", clubError.message);
      }
    }

    try {
      // If club login fails, attempt user login
      const userResponse = await axios.post(
        `http://${ipAddress}:8000/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (userResponse.status === 200 && userResponse.data.user) {
        const user = userResponse.data.user; 
        console.log("User login successful:", userResponse.data.user);
        setUser(user);
        setClubId(null);

        await AsyncStorage.setItem("userType", "user");
        await AsyncStorage.setItem("user", JSON.stringify(user));

        handlelogin();
        return;
      }
    } catch (userError) {
      if (userError.response?.status === 401) {
        console.error("Invalid user credentials.");
      } else {
        console.error("User login error:", userError.message);
      }
    }
  }

  useEffect(() => {
    Animated.timing(topRightAnim, {
      toValue: 30,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    Animated.timing(bottomLeftAnim, {
      toValue: 20,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setShowText(true);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);
  }, []);

  const handlesignup = () => {
    navigation.navigate("signup");
  };
  const handlelogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "HomeMain" } }],
      })
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.Image
          source={branch}
          style={[styles.image, styles.topRight, { top: topRightAnim }]}
        />
        <Animated.Image
          source={branch}
          style={[styles.image, styles.bottomLeft, { bottom: bottomLeftAnim }]}
        />
        {showText && (
          <>
            <Animated.View
              style={[styles.animatedContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.text}>Welcome </Text>
              <Text style={styles.text2}>Sign in to Continue</Text>
              <Image source={logo} style={styles.logo} />
              <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <ScrollView
                  contentContainerStyle={styles.contentContainer}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.EmailPasscontainer}>
                    <Text style={styles.text3}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="someone@medtech.tn"
                      placeholderTextColor="#888"
                      keyboardType="email-address"
                    />
                    <Text style={styles.text3}>Password</Text>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
                      placeholderTextColor="#888"
                      secureTextEntry={true}
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        // Handle button press
                        handleLogin();
                      }}
                    >
                      <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.text4}>Forget password?</Text>
                  <Text style={styles.text5}>
                    Don't have an account?
                    <TouchableOpacity onPress={() => handlesignup()}>
                      <Text style={styles.signupText}>Sign up</Text>
                    </TouchableOpacity>
                  </Text>
                </ScrollView>
              </KeyboardAvoidingView>
            </Animated.View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    color: "#007DA5",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007DA5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  EmailPasscontainer: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 10,
  },
  keyboardContainer: {
    width: "100%",
  },
  contentContainer: {
    padding: 16,
    width: "100%",
  },
  text: {
    color: "#007DA5",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 150,
  },
  text2: {
    color: "#007DA5",
    fontSize: 32,
    fontWeight: "bold",
  },
  text4: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 80,
    marginTop: 20,
  },
  text5: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 60,
  },
  text3: {
    color: "#007DA5",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  image: {
    width: 130,
    height: 130,
    position: "absolute",
  },
  topRight: {
    top: 40,
    right: -50,
    transform: [{ rotate: "130deg" }],
  },
  bottomLeft: {
    bottom: 10,
    left: -50,
    transform: [{ rotate: "-45deg" }],
  },
});

export default Login;
