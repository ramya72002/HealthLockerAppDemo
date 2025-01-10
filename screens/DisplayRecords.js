import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import axios from "axios";

const DisplayRecords = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  
  // Fetch email from localStorage
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      const userDetails = await AsyncStorage.getItem("userDetails");
      const parsedDetails = userDetails ? JSON.parse(userDetails) : null;
      if (parsedDetails && parsedDetails.email) {
        setEmail(parsedDetails.email);
      } else {
        alert("User details not found. Please log in again.");
        setLoading(false);
      }
    };
    
    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) {
      // Fetch records from the API once email is available
      axios
        .get(`https://health-project-backend-url.vercel.app/get_uploaded_records?email=${email}`)
        .then((response) => {
          setRecords(response.data.uploads);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setLoading(false);
        });
    }
  }, [email]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.recordContainer}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{new Date(item.date_time).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Health Records</Text>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  recordContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
};

export default DisplayRecords;
