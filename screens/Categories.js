import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { format } from "date-fns";  // Use date-fns for formatting

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Record uploaded successfully!");
    }, 2000);
  };

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
