import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar, CalendarList, Agenda } from "react-native-calendars"; // Import the Calendar component
import MedicalFooter from "../components/MedicalFooter"; // Ensure the path is correct

const CalendarView = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState({}); // To store dates with medications

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

          // Process medications to mark dates
          const medicationDates = {};
          userMedications.forEach((med) => {
            // Parse schedule to get specific dates for medications
            const schedule = med.schedule ? JSON.parse(med.schedule) : [];
            schedule.forEach((entry) => {
              const date = entry.date; // Assuming date is part of the entry
              if (!medicationDates[date]) {
                medicationDates[date] = { dots: [], selected: true };
              }
              medicationDates[date].dots.push({ color: "blue", selectedDotColor: "red" }); // Mark with a dot
            });
          });

          setMarkedDates(medicationDates); // Set marked dates
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
      <Text style={styles.header}>Medications Calendar</Text>

      <Calendar
        markedDates={markedDates} // Pass the marked dates to the calendar
        markingType={"multi-dot"} // Display multiple dots on the date if there are multiple medications
        style={styles.calendar}
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
  calendar: {
    marginBottom: 20,
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

export default CalendarView;
