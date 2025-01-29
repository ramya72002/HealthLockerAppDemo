import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import MedicalFooter from "../components/MedicalFooter";

const CalendarView = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        const parsedDetails = userDetails ? JSON.parse(userDetails) : null;

        if (parsedDetails?.user_id) {
          const response = await axios.post(
            `https://health-project-backend-url.vercel.app/get_medications_wrt_userId`,
            { user_id: parsedDetails.user_id }
          );

          const userMedications = response.data?.medications || [];
          setMedications(userMedications);

          const medicationDates = {};

          userMedications.forEach((med) => {
            const schedule = med.schedule ? JSON.parse(med.schedule) : [];
            const { start_date, end_date, frequency, selected_days, selected_dates } = med;

            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            if (isNaN(startDate) || isNaN(endDate)) {
              console.error(`Invalid start_date or end_date for ${med.medication_name}`);
              return;
            }

            let currentDate = new Date(startDate);
            const freq = frequency || "daily";

            // Iterate over dates within the range based on frequency
            while (currentDate <= endDate) {
              const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

              if (freq === "Every day" || freq === "daily") {
                if (!medicationDates[dateStr]) {
                  medicationDates[dateStr] = { dots: [], selected: true };
                }
                medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
              } else if (freq === "Day of the week" && selected_days) {
                const dayOfWeek = currentDate.toLocaleString("en-US", { weekday: "short" });
                if (selected_days.includes(dayOfWeek)) {
                  if (!medicationDates[dateStr]) {
                    medicationDates[dateStr] = { dots: [], selected: true };
                  }
                  medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
                }
              } else if (freq === "Day of the month" && selected_dates) {
                // Handle "Day of the month" frequency
                const selectedDatesArray = selected_dates.split(",").map((date) => date.trim());
                if (selectedDatesArray.includes(currentDate.getDate().toString())) {
                  if (!medicationDates[dateStr]) {
                    medicationDates[dateStr] = { dots: [], selected: true };
                  }
                  medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
                }
              }

              // Increment the date based on frequency
              if (freq === "Every day" || freq === "daily") {
                currentDate.setDate(currentDate.getDate() + 1);
              } else if (freq === "Day of the week" && selected_days) {
                // Increment until we reach a valid day of the week
                currentDate.setDate(currentDate.getDate() + 1);
              } else if (freq === "Day of the month" && selected_dates) {
                // For day of the month, just increment by one day
                currentDate.setDate(currentDate.getDate() + 1);
              }
            }
          });

          setMarkedDates(medicationDates);
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
        markedDates={markedDates}
        markingType={"multi-dot"}
        style={styles.calendar}
      />

      <View style={styles.footerContainer}>
        <MedicalFooter />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 40,
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
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
});

export default CalendarView;
