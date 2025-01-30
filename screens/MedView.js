import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon library
import MedicalFooter from "../components/MedicalFooter"; // Ensure the path is correct

const MedView = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch medications
  const fetchMedications = async () => {
    try {
      setLoading(true); // Show loader during fetch
      const userDetails = await AsyncStorage.getItem("userDetails");
      const parsedDetails = userDetails ? JSON.parse(userDetails) : null;

      if (parsedDetails?.user_id) {
        const response = await axios.post(
          `https://health-project-backend-url.vercel.app/get_medications_wrt_userId`,
          { user_id: parsedDetails.user_id }
        );
        const userMedications = response.data?.medications || [];
        setMedications(userMedications);
      } else {
        Alert.alert("Error", "User details not found. Please log in again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch medications.");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a medication
  const deleteMedication = async (medicationId) => {
    try {
      const userDetails = await AsyncStorage.getItem("userDetails");
      const parsedDetails = userDetails ? JSON.parse(userDetails) : null;

      if (parsedDetails?.user_id) {
        const response = await axios.post(
          "https://health-project-backend-url.vercel.app/delete_medication_wrt_id",
          {
            user_id: parsedDetails.user_id,
            medication_id: medicationId,
          }
        );

        if (response.data.success) {
          Alert.alert("Success", "Medication deleted successfully.");
          fetchMedications(); // Re-fetch medications after deletion
        } else {
          Alert.alert("Error", "Failed to delete medication.");
        }
      } else {
        Alert.alert("Error", "User details not found. Please log in again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while deleting the medication.");
    }
  };

  // Fetch medications on component mount
  useEffect(() => {
    fetchMedications();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleDelete = (medicationId) => {
    Alert.alert("Delete Medication", "Are you sure you want to delete this medication?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteMedication(medicationId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medications Added</Text>
      <FlatList
        data={medications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const schedule = item.schedule ? JSON.parse(item.schedule) : [];
          return (
            <View style={styles.medicationItem}>
              <Text style={styles.medicationName}>{item.medication_name}</Text>
              <Text style={styles.medicationFrequency}>Frequency: {item.frequency}</Text>
              {item.count && (
                <Text style={styles.medicationDays}>
                  <Text style={styles.boldText}>Repeat every: </Text>
                  {item.count} days
                </Text>
              )}
              {/* Schedule Box */}
              <View style={styles.scheduleBox}>
                <Text style={styles.scheduleTitle}>Schedule:</Text>
                {schedule.map((entry, index) => (
                  <Text key={index} style={styles.medicationSchedule}>
                    {entry.time} - {entry.dosage} dosage
                  </Text>
                ))}
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.medicationDates}>
                  <Text style={styles.boldText}>Start Date: </Text>
                  {item.start_date}
                </Text>
                <Text style={styles.medicationDates}>
                  <Text style={styles.boldText}>End Date: </Text>
                  {item.end_date}
                </Text>
              </View>

              {item.selected_days && (
                <Text style={styles.medicationDays}>
                  <Text style={styles.boldText}>Selected Days: </Text>
                  {item.selected_days}
                </Text>
              )}
              

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.medication_id)} // Assuming item.medication_id is available
              >
                <Icon name="delete" size={20} color="white" />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <MedicalFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007BFF",
  },
  medicationItem: {
    padding: 20,
    marginVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative", // Important for positioning the delete button
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  medicationFrequency: {
    fontSize: 15,
    fontWeight: "600",

    color: "#555",
    marginTop: 5,
  },

  scheduleBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#e6f2ff",
    borderRadius: 8,
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  medicationSchedule: {
    fontSize: 15,
    color: "#333",
    marginTop: 5,
  },

  dateContainer: {
    marginTop: 10,
  },
  medicationDates: {
    fontSize: 15,
    color: "#555",
    marginTop: 5,
  },
  medicationDays: {
    fontSize: 15,
    color: "#555",
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },

  // Delete Button
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});

export default MedView;
