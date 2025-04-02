import React, { useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from "../../../assets/logo.png";

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.tit}>Life@SMU</Text>
      <Text style={styles.tit2}>Discover , Connect , Thrive</Text>
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
