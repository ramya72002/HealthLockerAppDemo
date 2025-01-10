import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";

const DisplayRecords = () => {
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    setLoading(true);

    // Simulate an API call
    setTimeout(() => {
      alert("Record uploaded successfully!");
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Tags</Text>

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

export default DisplayRecords;
