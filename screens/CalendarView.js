import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Modal, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import MedicalFooter from "../components/MedicalFooter";

const CalendarView = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedMedications, setSelectedMedications] = useState([]); // State to store selected medications for the modal
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

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
              currentDate.setDate(currentDate.getDate() + 1);
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

  // Handle day press event
  const onDayPress = (day) => {
    const selectedDay = day.dateString;

    // Find all medications for the selected date
    const medicationsForDay = medications.filter((med) => {
      const schedule = med.schedule ? JSON.parse(med.schedule) : [];
      const { start_date, end_date, frequency, selected_days, selected_dates } = med;

      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (isNaN(startDate) || isNaN(endDate)) {
        return false;
      }

      let currentDate = new Date(startDate);
      const freq = frequency || "daily";

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        if (dateStr === selectedDay) {
          return true; // Medication is scheduled for the selected day
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return false;
    });

    if (medicationsForDay.length > 0) {
      setSelectedMedications(medicationsForDay); // Set all medications found for the selected day
      setModalVisible(true); // Open modal with medication details
    } else {
      Alert.alert("No Medication", "No medication scheduled for this day.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedications([]); // Clear selected medications
  };

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
        onDayPress={onDayPress} // Handle date press
      />

      <View style={styles.footerContainer}>
        <MedicalFooter />
      </View>

      {/* Modal for displaying medication details */}
      {selectedMedications.length > 0 && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Medication Details</Text>
              {selectedMedications.map((med, index) => (
                <View key={index} style={styles.medicationDetail}>
                  <Text style={styles.modalText}>Name: {med.medication_name}</Text>
                  <Text style={styles.modalText}>Start Date: {med.start_date}</Text>
                  <Text style={styles.modalText}>End Date: {med.end_date}</Text>
                  <Text style={styles.modalText}>Frequency: {med.frequency}</Text>
                  <Text style={styles.modalText}>Schedule: {med.schedule}</Text>
                  <Text style={styles.modalText}>-----</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  medicationDetail: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CalendarView;
