import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image,ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


// Validation schema using Yup
const schema = yup.object().shape({
  eventName: yup.string().min(3, "Must be at least 3 characters").required("Event Name is required"),
  date: yup.string().required("Date is required"),
  place: yup.string().required("Place is required"),
  participants: yup.number().typeError("Must be a number").min(1, "Must be at least 1").required("Participants are required"),
  description: yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
});

const EventForm = () => {
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [image, setImage] = useState(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // Show Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Handle Date Selection
  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; 
    setValue("date", formattedDate);
    hideDatePicker();
  };

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

  // Handle Form Submission
  const onSubmit = (data) => {
    if (!image) {
      Alert.alert("Error", "Please upload an event image.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Event proposal submitted!", [{ text: "OK" }]);
      console.log("Submitted Data:", { ...data, image });
    }, 2000);
  };

  return (
    
    <View style={styles.container}>
      <ScrollView>
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
          <MaterialIcons name="event" size={24} color="#007da5" style={styles.icon} />
          <Controller
            control={control}
            name="eventName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Event Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        {errors.eventName && <Text style={styles.errorText}>{errors.eventName.message}</Text>}

        {/* Date Picker */}
        <TouchableOpacity onPress={showDatePicker} style={styles.inputWrapper}>
          <Entypo name="calendar" size={24} color="#007da5" style={styles.icon} />
          <Controller
            control={control}
            name="date"
            render={({ field: { value } }) => (
              <Text style={[styles.input, { color: value ? "#000" : "#aaa" }]}>{value || "Select Date"}</Text>
            )}
          />
        </TouchableOpacity>
        {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

        

        {/* Place */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="place" size={24} color="#007da5" style={styles.icon} />
          <Controller
            control={control}
            name="place"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Event Place"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        {errors.place && <Text style={styles.errorText}>{errors.place.message}</Text>}

        {/* Participants */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="users" size={24} color="#007da5" style={styles.icon} />
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
        {errors.participants && <Text style={styles.errorText}>{errors.participants.message}</Text>}

        {/* Description */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="description" size={24} color="#007da5" style={styles.icon} />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Event Description"
                multiline
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = {
  container: {
    paddingTop:60,
    flex: 1,
    backgroundColor: "#f7fcff",
  },
  titleContainer: {
    backgroundColor: "#007da5",  // Matching color to the rest of the design
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
    fontWeight: "700",  // Bold font style for prominence
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
