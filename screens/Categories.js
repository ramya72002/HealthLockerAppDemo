import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { format } from "date-fns";  // Use date-fns for formatting
import { useRoute } from '@react-navigation/native';  // Import useRoute hook
import { useNavigation } from '@react-navigation/native'; // useNavigation hook
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage


const Categories = () => {
  const navigation = useNavigation(); // useNavigation hook

  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use the useRoute hook to access the params passed from the previous screen
  const route = useRoute();
  const { imageUrl } = route.params || {};  // Destructure imageUrl from params, default to an empty object

  const categories = [
    "Cardiology (Heart Health)",
    "Neurology (Brain & Nerves)",
    "Endocrinology (Hormonal Health)",
    "Dermatology (Skin Health)",
    "Oncology (Cancer)",
    "Orthopedics (Bone & Muscle Health)",
    "Pulmonology (Lung Health)",
    "Gastroenterology (Digestive Health)",
    "Nephrology (Kidney Health)",
    "Urology (Urinary Health)",
    "Gynecology & Obstetrics (Women’s Health)",
    "Pediatrics (Child Health)",
    "Psychiatry & Mental Health",
    "Ophthalmology (Eye Health)",
    "ENT (Ear, Nose, Throat)",
    "Dental Health",
    "Immunology (Allergies & Immune System)",
    "Rheumatology (Autoimmune Diseases)",
    "General Medicine",
    "Surgery & Procedures"
  ];

  const handleDateChange = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
  };

const handleUpload = async () => {
  if (!title || !selectedCategory || !date || !imageUrl) {
    alert("All fields are required!");
    return;
  }

  setLoading(true);

  try {
    // Retrieve user details from AsyncStorage
    const userDetails = await AsyncStorage.getItem("userDetails");
    const parsedDetails = userDetails ? JSON.parse(userDetails) : null;

    if (!parsedDetails || !parsedDetails.email) {
      alert("User details not found. Please log in again.");
      setLoading(false);
      return;
    }

    const payload = {
      email: parsedDetails.email, // Extract email from userDetails
      image_url: imageUrl,
      title: title,
      category: selectedCategory,
      date_time: date.toISOString(),
    };
    console.log(payload)

    const response = await fetch("https://health-project-backend-url.vercel.app/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    console.log("req",result)

    if (response.ok) {
      alert("Record uploaded successfully!");
      navigation.navigate("App");

    } else {
      alert(result.message || "Failed to upload record.");
    }
  } catch (error) {
    console.error("Error uploading record:", error);
    alert("An error occurred. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  
console.log("iiii",imageUrl)
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Tags</Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        placeholderTextColor="#8a8a8a"
        value={title}
        onChangeText={setTitle}
      />

      {/* Category Dropdown */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Category</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      {/* Date Picker */}
      <View style={styles.dateContainer}>
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {format(date, "dd MMM yyyy, h:mm a")} {/* Format date to readable format */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal DateTimePicker */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        date={date}
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* Display uploaded image if imageUrl is available */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>Uploaded Image</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      )}

      {/* Upload Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Record</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  dateInput: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    textAlign: "left",
  },
  dateContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  imageText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: 'lightgray',  // Add a background to see if the image container is being rendered.
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 3,  // Android shadow
    shadowColor: "#000",  // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Categories;
