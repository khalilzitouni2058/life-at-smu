import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../../../assets/logo.png";
import { useUser } from "../../../Context/UserContext";
import { useClub } from "../../../Context/ClubContext";

const Home = () => {
  const navigation = useNavigation();
  const { setUser } = useUser();
  const { setClubId, setFirstLogin } = useClub();
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    const userType = await AsyncStorage.getItem("userType");
  
    if (userType === "user") {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (user) {
        setUser(user);
        navigation.replace("MainTabs");
        return;
      }
    }
  
    if (userType === "club") {
      const club = JSON.parse(await AsyncStorage.getItem("club"));
      if (club) {
        setClubId(club._id);
        setFirstLogin(club.firstLogin);
        navigation.replace(club.firstLogin ? "ClubUpdate" : "MainTabs");
        return;
      }
    }
  
    // fallback: not logged in
    navigation.replace("Login");
  };
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      await checkLogin();
      setLoading(false);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.tit}>Life@SMU</Text>
      <Text style={styles.tit2}>Discover , Connect , Thrive</Text>
      {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007DA5",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 200,
  },
  tit: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  tit2: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default Home;
