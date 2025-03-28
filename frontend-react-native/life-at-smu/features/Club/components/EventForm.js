import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
  
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import DropDownPicker from 'react-native-dropdown-picker';
import { useClub } from "../../../Context/ClubContext"; // Import useClub hook


const schema = yup.object().shape({
  eventName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Event Name is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
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
});




const EventForm = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [roomsList, setRoomsList] = useState([]);  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // ✅ Stores selected date
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const { clubId } = useClub(); // Get clubId from context
  const [eventName, seteventName] = useState("");
  const [eventLocation, seteventLocation] = useState("");
  const [eventDescription, seteventDescription] = useState("");
  const [additionalNotes, setadditionalNotes] = useState("");
  

  
  const [message, setMessage] = useState(""); // Message for empty state

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

const [open, setOpen] = useState(false);
const [selectedRoom, setSelectedRoom] = useState(null);

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
      eventTime: selectedTime.toISOString(),
      room: selectedRoom,
    };

// If eventImage is a file from input


axios.post(`http://${ipAddress}:8000/api/auth/clubs/${clubId}/events`, eventData, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    console.log("Event created successfully:", response.data);
  })
  .catch(error => {
    if (error.response) {
      console.error("Error creating event:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  });
  };
  
  
  


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`http://${ipAddress}:8000/api/auth/rooms`);
        if (response.data && response.data.rooms) {
          const formattedRooms = response.data.rooms.map((room) => ({
            label: room.number,
            value: room._id,
          }));
          setRoomsList(formattedRooms);
          console.log("This is the second log",roomsList)
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
  
    fetchRooms();
  }, []);

  // Handle Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Event Proposal</Text>
        </View>

        {/* Event Image */}
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
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
              {selectedTime.getHours().toString().padStart(2, "0") +
                ":" +
                selectedTime.getMinutes().toString().padStart(2, "0")}
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
<View style={styles.inputWrapper}>
    <MaterialIcons name="meeting-room" size={24} color="#007da5" style={styles.icon} />

    <Controller
      control={control}
      name="room"
      render={({ field: { onChange, value } }) => (
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          items={roomsList}
          value={value || selectedRoom}  // Show selected room in dropdown
          setValue={(callback) => {
            const newValue = callback(selectedRoom);
            setSelectedRoom(newValue);
            console.log(selectedRoom);
            onChange(newValue); // Update form field
          }}
          placeholder="Select a room"
          containerStyle={styles.dropdown}
          listMode="MODAL"  // Prevents VirtualizedList nesting error
          dropDownDirection="BOTTOM"
        />
      )}
    />
  </View>

{errors.room && <Text style={styles.errorText}>{errors.room.message}</Text>}
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
                  onChangeText={(val) => onChange(val.replace(/[^0-9]/g, ""))
                  }
                />
              )}
            />
          </View>
          {errors.participants && (
            <Text style={styles.errorText}>{errors.participants.message}</Text>
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
    backgroundColor: "#007da5", // Matching color to the rest of the design
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
    fontWeight: "700", // Bold font style for prominence
    color: "#fff",
    textAlign: "center",
  },
  imageContainer: {
    width: "90%", // Leaves space on each side
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
};

export default EventForm;
