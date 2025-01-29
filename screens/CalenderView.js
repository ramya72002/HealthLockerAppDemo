import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const CalenderView = () => {
  const medications = [
    { id: "1", name: "Paracetamol", frequency: "Every 8 hours" },
    { id: "2", name: "Amoxicillin", frequency: "Twice a day" },
    { id: "3", name: "Ibuprofen", frequency: "Once a day" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medications Added</Text>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.medicationItem}>
            <Text style={styles.medicationName}>{item.name}</Text>
            <Text style={styles.medicationFrequency}>{item.frequency}</Text>
          </View>
        )}
      />
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  medicationItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  medicationFrequency: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default CalenderView;
