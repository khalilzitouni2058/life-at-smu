import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const ClubDetailsScreen = ({ route }) => {
  const { club } = route.params || {};
  const navigation = useNavigation();

  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 300 });
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const openEmail = () => {
    if (club.contactInfo?.includes("@")) {
      Linking.openURL(`mailto:${club.contactInfo}`);
    }
  };

  if (!club) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>
          Club data not available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 16,
          marginBottom: 10,
          paddingVertical: 8,
          paddingHorizontal: 14,
          backgroundColor: "#007DA5",
          borderRadius: 10,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
          Back to Clubs
        </Text>
      </TouchableOpacity>
      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        style={fadeStyle}
      >
        <Image
          source={{
            uri: club?.profilePicture,
          }}
          style={styles.image}
        />

        <Text style={styles.title}>{club?.clubName}</Text>

        <View style={styles.categoryWrapper}>
          <Text style={styles.categoryChip}>
            {club?.category || "Uncategorized"}
          </Text>
        </View>

        <Text style={styles.description}>
          {club?.clubDescription || "No description provided."}
        </Text>

        {club?.contactInfo && (
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.contact}>📧 {club.contactInfo}</Text>
          </TouchableOpacity>
        )}

        {club?.boardMembers?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 Board Members</Text>
            {club.boardMembers.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                <Image
                  source={{
                    uri: member?.profilePicture,
                  }}
                  style={styles.memberImage}
                />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member?.name}</Text>
                  <Text style={styles.memberRole}>{member?.role}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  scroll: {
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    borderColor: "#007DA5",
    borderWidth: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007DA5",
    marginBottom: 4,
  },
  categoryWrapper: {
    backgroundColor: "#E0F4FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 10,
  },
  categoryChip: {
    color: "#007DA5",
    fontSize: 13,
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  contact: {
    fontSize: 14,
    color: "#007DA5",
    fontWeight: "500",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  section: {
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003366",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F8FF",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberDetails: {
    flexShrink: 1,
  },
  memberName: {
    fontWeight: "600",
    fontSize: 15,
  },
  memberRole: {
    fontSize: 13,
    color: "#555",
  },
});

export default ClubDetailsScreen;
