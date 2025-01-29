import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MedicalFooter from "../components/MedicalFooter"; // Ensure the path is correct

const MedView = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        // Fetch user details from AsyncStorage
        const userDetails = await AsyncStorage.getItem("userDetails");
        const parsedDetails = userDetails ? JSON.parse(userDetails) : null;

        if (parsedDetails?.user_id) {
          // Fetch medications using the user ID
          const response = await axios.post(
            `https://health-project-backend-url.vercel.app/get_medications_wrt_userId`,
            { user_id: parsedDetails.user_id } // Include user ID in the request body
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
                  <Text style={styles.boldText}>Start Date: </Text>{item.start_date}
                </Text>
                <Text style={styles.medicationDates}>
                  <Text style={styles.boldText}>End Date: </Text>{item.end_date}
                </Text>
              </View>

              {item.selected_days && (
                <Text style={styles.medicationDays}>
                  <Text style={styles.boldText}>Selected Days: </Text>{item.selected_days}
                </Text>
              )}
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
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  medicationFrequency: {
    fontSize: 15,
    color: "#555",
    marginTop: 5,
  },

  // Schedule Box
  scheduleBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#e6f2ff",  // Light blue background for clarity
    borderRadius: 8,
    borderColor: "#007BFF", // Blue border
    borderWidth: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    color: "#007BFF",  // Blue for consistency
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
});

export default MedView;
