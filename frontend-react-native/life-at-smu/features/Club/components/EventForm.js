import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useClub } from "../../../Context/ClubContext"; // Import useClub hook
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const schema = yup.object().shape({
  eventName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Event Name is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  eventEndTime: yup.string().required("End time is required"), // ✅ New field
  place: yup.string().required("Place is required"),
  room: yup.string().required("Room is required"),
  participants: yup
    .number()
    .typeError("Must be a number")
    .min(1, "Must be at least 1")
    .required("Participants are required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  mandatoryParentalAgreement: yup
    .boolean()
    .oneOf([true], "Parental Agreement is required"), // ✅ Checkbox validation
  transportationProvided: yup.boolean(), // ✅ No validation needed, optional checkbox
  formLink: yup
    .string()
    .url("Invalid URL format")
    .required("Event link is required"),
});

const EventForm = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [roomsList, setRoomsList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [urlphoto, setUrlphoto] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // ✅ Stores selected date
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);

  const [selectedTime, setSelectedTime] = useState(new Date());
  const { clubId } = useClub(); // Get clubId from context
  const [eventName, seteventName] = useState("");
  const [eventLocation, seteventLocation] = useState("");
  const [eventDescription, seteventDescription] = useState("");
  const [additionalNotes, setadditionalNotes] = useState("");
  const [eventEndTime, setEventEndTime] = useState(new Date(null)); // ✅ New State
  const [mandatoryParentalAgreement, setMandatoryParentalAgreement] =
    useState(false); // ✅ New State
  const [transportationProvided, setTransportationProvided] = useState(false); // ✅ New State
  const [formLink, setformLink] = useState(false); // ✅ New State

  const navigation = useNavigation();

  const [roomOverlayVisible, setRoomOverlayVisible] = useState(false);

  function getRoomAvailabilityStatus(
    roomsList,
    selectedDate,
    selectedStartTime,
    selectedEndTime
  ) {
    const selectedDateStr = new Date(selectedDate)
      .toISOString()
      .substring(0, 10);

    const getHourMinute = (value) => {
      if (value instanceof Date) {
        // Extract hours and minutes from the Date object
        const hours = String(value.getHours()).padStart(2, "0");
        const minutes = String(value.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }

      if (typeof value === "string") {
        // If value is a string in "HH:mm" format, return as is
        return value;
      }

      // Return a default time if value is neither a Date nor a string
      console.log("Invalid time value:", value);
      return "00:00";
    };

    const eventStart = getHourMinute(selectedStartTime);
    const eventEnd = getHourMinute(selectedEndTime);

    const availabilityMap = {};

    roomsList.forEach((room) => {
      let hasConflict = false;

      room.reservations.forEach((res) => {
        const resDate = new Date(res.DayOfReservation);
        if (isNaN(resDate.getTime())) {
          return; // Skip this reservation if it's invalid
        }
        const resDateStr = resDate.toISOString().substring(0, 10);
        if (resDateStr !== selectedDateStr) return;

        if (!res.TimeInterval.start || !res.TimeInterval.end) {
          return; // Skip this reservation if time interval is missing
        }

        const resStart = res.TimeInterval.start;
        const resEnd = res.TimeInterval.end;

        const conflict = eventStart < resEnd && eventEnd > resStart;

        if (conflict) {
          hasConflict = true;
        }
      });

      availabilityMap[room.value] = !hasConflict;
    });

    return availabilityMap;
  }

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

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0].uri;

    if (result.canceled) {
      return;
    }

    const uploadedImageUrl = await uploadImage(uri);
    if (uploadedImageUrl) {
      console.log("Uploaded Image URL:", uploadedImageUrl);
      // Use uploadedImageUrl instead of result.uri
    }

    setImage(uploadedImageUrl);
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("source", {
      uri,
      name: "photo.jpg", // Required for FormData
      type: "image/jpeg",
    });

    try {
      const response = await fetch("https://postimage.me/api/1/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-Key":
            "chv_ZtFY_1d68e60bdc2a3a9f47650fa766b07390e1b69aac2a4ee7d94a3d52e0b853cd8783e54a37fef88448278f2c92526b7f87b9da5acdc486f91f784f0891e651454a",
        },
      });

      const data = await response.json();

      if (data) {
        setUrlphoto(data.image.url);
        return data.image.url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const toggleRoomSelection = (roomId) => {
    if (selectedRooms?.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedRooms, setSelectedRooms] = useState([]);

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  const handleSubmitForm = async () => {
    const eventData = {
      eventName,
      eventDescription,
      eventLocation,
      additionalNotes,
      eventImage: { uri: image },
      eventDate: selectedDate.toISOString().split("T")[0],
      eventTime: `${selectedTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${selectedTime
        .getMinutes()
        .toString()
        .padStart(2, "0")} - ${eventEndTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${eventEndTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      rooms: selectedRooms,
      mandatoryParentalAgreement,
      transportationProvided,
      formLink, // Add the formLink data here
    };

    console.log(eventData);

    axios
      .post(
        `http://${ipAddress}:8000/api/auth/clubs/${clubId}/events`,
        eventData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Event created successfully:", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error creating event:", error.response.data);
        } else {
          console.error("Error:", error.message);
        }
      });

    navigation.navigate("HomeMain");
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://${ipAddress}:8000/api/auth/rooms`
        );
        if (response.data && response.data.rooms) {
          const formattedRooms = response.data.rooms.map((room) => ({
            label: room.number,
            value: room._id,
            reservations: room.reservations,
          }));
          setRoomsList(formattedRooms);
          console.log("This is the second log", roomsList);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Event Proposal</Text>
          </View>

          {/* Event Image */}
          <TouchableOpacity
            onPress={handleUploadPhoto}
            style={styles.imageContainer}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-a-photo" size={50} color="#007da5" />
                <Text style={styles.imageText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            {/* Event Name */}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="event"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Controller
                control={control}
                name="eventName"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Event Name"
                    value={value}
                    onChangeText={(val) => {
                      onChange(val); // Update react-hook-form value
                      seteventName(val); // Update state value
                    }}
                  />
                )}
              />
            </View>
            {errors.eventName && (
              <Text style={styles.errorText}>{errors.eventName.message}</Text>
            )}

            {/* Date Picker Button */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputWrapper}
            >
              <Entypo
                name="calendar"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Text style={[styles.input, { color: "#000" }]}>
                {selectedDate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>

            {/* Show Date Picker Modal when button is clicked */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setSelectedDate(date);
                    setValue("date", date.toISOString().split("T")[0]); // ✅ Set value in form
                  }
                }}
              />
            )}

            {errors.date && (
              <Text style={styles.errorText}>{errors.date.message}</Text>
            )}

            {/* Time Picker Button */}
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.inputWrapper}
            >
              <MaterialIcons
                name="access-time"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Text style={[styles.input, { color: "#000" }]}>
                Event Start Time:{" "}
                {selectedTime
                  ? selectedTime.getHours().toString().padStart(2, "0") +
                    ":" +
                    selectedTime.getMinutes().toString().padStart(2, "0")
                  : "Not set"}
              </Text>
            </TouchableOpacity>

            {/* Show Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, time) => {
                  setShowTimePicker(false);
                  if (time) {
                    setSelectedTime(time);
                    const formattedTime =
                      time.getHours().toString().padStart(2, "0") +
                      ":" +
                      time.getMinutes().toString().padStart(2, "0");

                    setValue("time", formattedTime);
                  }
                }}
              />
            )}
            {errors.time && (
              <Text style={styles.errorText}>{errors.time.message}</Text>
            )}
            {/*Event End time*/}
            <TouchableOpacity
              onPress={() => setShowTimePicker2(true)}
              style={styles.inputWrapper}
            >
              <MaterialIcons
                name="access-time"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Text style={[styles.input, { color: "#000" }]}>
                Event End Time:{" "}
                {eventEndTime
                  ? eventEndTime.getHours().toString().padStart(2, "0") +
                    ":" +
                    eventEndTime.getMinutes().toString().padStart(2, "0")
                  : "Not set"}
              </Text>
            </TouchableOpacity>

            {/* Show Time Picker */}
            {showTimePicker2 && (
              <DateTimePicker
                value={eventEndTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, time) => {
                  setShowTimePicker2(false);
                  if (time) {
                    setEventEndTime(time);
                    const formattedTime =
                      time.getHours().toString().padStart(2, "0") +
                      ":" +
                      time.getMinutes().toString().padStart(2, "0");

                    setValue("time", formattedTime); // ✅ Store time
                  }
                }}
              />
            )}
            {errors.time && (
              <Text style={styles.errorText}>{errors.time.message}</Text>
            )}

            {/* Place */}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="place"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Controller
                control={control}
                name="place"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Event Place"
                    value={value}
                    onChangeText={(val) => {
                      onChange(val); // Update react-hook-form value
                      seteventLocation(val); // Update state value
                    }}
                  />
                )}
              />
            </View>
            {errors.place && (
              <Text style={styles.errorText}>{errors.place.message}</Text>
            )}
            {/*Rooms*/}
            <View>
              {/* Room selection button */}
              <TouchableOpacity
                onPress={() => setRoomOverlayVisible(true)}
                style={styles.inputWrapper}
              >
                <MaterialIcons
                  name="meeting-room"
                  size={24}
                  color="#007da5"
                  style={styles.icon}
                />
                <Text style={styles.selectText}>
                  {selectedRooms?.length > 0
                    ? `${selectedRooms?.length} room(s) selected`
                    : "Select rooms"}
                </Text>
              </TouchableOpacity>

              {/* Room selection overlay modal */}
              <Modal
                visible={roomOverlayVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setRoomOverlayVisible(false)}
              >
                <View style={styles.overlayBackground}>
                  <View style={styles.overlayContainer}>
                    <Text style={styles.overlayTitle}>Select Rooms</Text>

                    {(() => {
                      const roomAvailability = getRoomAvailabilityStatus(
                        roomsList,
                        selectedDate,
                        selectedTime,
                        eventEndTime
                      );

                      console.log(roomAvailability);
                      console.log(selectedDate);
                      console.log(selectedTime);
                      console.log(eventEndTime);

                      return (
                        <ScrollView
                          contentContainerStyle={styles.roomCardContainer}
                        >
                          {roomsList.map((room) => {
                            const isSelected = selectedRooms.includes(
                              room.value
                            );
                            const isAvailable = roomAvailability[room.value];

                            return (
                              <TouchableOpacity
                                key={room.value}
                                style={[
                                  styles.roomCard,
                                  isSelected && styles.roomCardSelected,
                                  !isAvailable && styles.roomCardDisabled,
                                ]}
                                onPress={() => {
                                  if (isAvailable) {
                                    toggleRoomSelection(room.value);
                                  }
                                }}
                                disabled={!isAvailable}
                                activeOpacity={isAvailable ? 0.7 : 1}
                              >
                                <Text
                                  style={[
                                    styles.roomCardText,
                                    isSelected && styles.roomCardTextSelected,
                                    !isAvailable && styles.roomCardTextDisabled,
                                  ]}
                                >
                                  {room.label} {!isAvailable ? "🔴" : "🟢"}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      );
                    })()}

                    <Button
                      title="Confirm Selection"
                      onPress={() => setRoomOverlayVisible(false)}
                      color="#007da5"
                    />
                  </View>
                </View>
              </Modal>
            </View>
            {/* Participants */}
            <View style={styles.inputWrapper}>
              <FontAwesome
                name="users"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Controller
                control={control}
                name="participants"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Estimated Participants"
                    keyboardType="numeric"
                    value={value ? String(value) : ""}
                    onChangeText={(val) => onChange(val.replace(/[^0-9]/g, ""))}
                  />
                )}
              />
            </View>
            {errors.participants && (
              <Text style={styles.errorText}>
                {errors.participants.message}
              </Text>
            )}

            {/* Description */}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="description"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    placeholder="Event Description"
                    multiline
                    value={value}
                    onChangeText={(val) => {
                      onChange(val);
                      seteventDescription(val);
                    }}
                  />
                )}
              />
            </View>
            {errors.description && (
              <Text style={styles.errorText}>{errors.description.message}</Text>
            )}

            {/* Event Link (formLink) */}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="link"
                size={24}
                color="#007da5"
                style={styles.icon}
              />
              <Controller
                control={control}
                name="formLink"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Event Link (Google Form URL)"
                    value={value}
                    onChangeText={(val) => {
                      setformLink(val);
                      onChange(val); // Update react-hook-form value
                    }}
                  />
                )}
              />
            </View>
            {errors.formLink && (
              <Text style={styles.errorText}>{errors.formLink.message}</Text>
            )}

            <View style={styles.checkboxContainer}>
              <Controller
                control={control}
                name="mandatoryParentalAgreement"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      setMandatoryParentalAgreement(
                        !mandatoryParentalAgreement
                      );
                      setValue(
                        "mandatoryParentalAgreement",
                        !mandatoryParentalAgreement
                      ); // ✅ Sync with react-hook-form
                    }}
                  >
                    <MaterialIcons
                      name={
                        mandatoryParentalAgreement
                          ? "check-box"
                          : "check-box-outline-blank"
                      }
                      size={24}
                      color="#007da5"
                    />
                    <Text style={styles.checkboxLabel}>
                      Mandatory Parental Agreement
                    </Text>
                  </TouchableOpacity>
                )}
              />

              {errors.mandatoryParentalAgreement && (
                <Text style={styles.errorText}>
                  {errors.mandatoryParentalAgreement.message}
                </Text>
              )}

              <Controller
                control={control}
                name="transportationProvided"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      setTransportationProvided(!transportationProvided);
                      setValue(
                        "transportationProvided",
                        !transportationProvided
                      ); // ✅ Sync with react-hook-form
                    }}
                  >
                    <MaterialIcons
                      name={
                        transportationProvided
                          ? "check-box"
                          : "check-box-outline-blank"
                      }
                      size={24}
                      color="#007da5"
                    />
                    <Text style={styles.checkboxLabel}>
                      Transportation Provided
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitForm}
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = {
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#f7fcff",
  },
  titleContainer: {
    backgroundColor: "#007da5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  imageContainer: {
    width: "90%",
    height: 200,
    borderWidth: 2,
    borderColor: "#007da5",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f2f7",
    marginVertical: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#007da5",
    fontSize: 16,
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007da5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007da5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
  },
  checkboxContainer: {
    marginBottom: 30,
    marginLeft: 20,
  },

  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    justifyContent: "flex-start",
    width: "80%",
    borderRadius: 10,
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  roomCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  roomCard: {
    backgroundColor: "#e0e0e0",
    padding: 18,
    margin: 10,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  roomCardSelected: {
    backgroundColor: "#007da5",
    borderColor: "#005f7f",
  },
  roomCardText: {
    color: "#333",
    fontSize: 14,
  },
  roomCardTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  roomCardDisabled: {
    backgroundColor: "#ffe5e5", // soft red tone
    border: "1px solid #ff4d4f", // subtle red border
    opacity: 1, // keep it clear
    boxShadow: "0 2px 6px rgba(255, 0, 0, 0.15)", // soft red shadow
    transition: "all 0.3s ease-in-out",
  },

  roomCardTextDisabled: {
    color: "#cc0000",
    fontWeight: "600",
  },
};

export default EventForm;
