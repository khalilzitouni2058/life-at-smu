import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";

const BoardMembersScreen = ({ route, navigation }) => {
  const { boardMembers } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔙 Back Tab */}
      <View style={styles.backTab}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={22} color="#fff" />
          <Text style={styles.backText}>Club Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.contentBox}>
            <Text style={styles.title}>Our Board Members</Text>
            <View style={styles.grid}>
              {boardMembers?.map((member, index) => (
                <TouchableOpacity key={index} style={styles.card}>
                  <Image
                    source={{ uri: member.user?.picture }}
                    style={styles.image}
                  />
                  <Text style={styles.text}>
                    <Text style={styles.label}>Name: </Text>
                    {member.user?.fullname}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Role: </Text>
                    {member.role}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Email: </Text>
                    {member.user?.email}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Phone: </Text>
                    {member.phoneNumber}
                  </Text>
                  {member.facebookLink && (
                    <Text
                      style={styles.link}
                      onPress={() => {
                        Linking.openURL(member.facebookLink).catch((err) =>
                          console.error("Failed to open URL:", err)
                        );
                      }}
                    >
                      Facebook Profile
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#007DA5",
  },
  backTab: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007DA5",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#007DA5",
    paddingBottom: 30,
  },
  contentBox: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007DA5",
    textAlign: "center",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  card: {
    width: "45%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#007DA5",
    borderWidth: 1,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 13,
    color: "black",
  },
  link: {
    fontSize: 14,
    color: "#007DA5",
    textDecorationLine: "underline",
    marginTop: 5,
    textAlign: "center",
  },
});

export default BoardMembersScreen;
