import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, TextInput, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is correctly imported
import QRCode from 'react-native-qrcode-svg'; // Import the QR code library
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const { width } = Dimensions.get('screen');

const Home = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [userId, setUserId] = useState(''); // Use TypeScript's string type for state
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails); // Parse the stored JSON string
          if (parsedDetails && parsedDetails.user_id) {
            setUserId(parsedDetails.user_id); // Assuming 'user_id' is the property to display
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchUserId();
  }, []); // Empty dependency array means this runs only once, when the component mounts

  const handleCopy = () => {
    Clipboard.setString(userId); // Copy userId to clipboard
    Alert.alert("Success", "User ID copied to clipboard!"); // Show a success message
  };

  const handleAddMedications = () => {
    navigation.navigate('AddMedications'); // Navigate to AddMedications screen
  };

  return (
    <View style={styles.home}>
      <View style={styles.container}>
        {/* Image */}
        <Image
          source={require('../assets/imgs/upload.png')} // Corrected local asset path
          style={styles.image}
        />
        {/* Text */}
        <Text style={styles.text}>
          Share your user ID with your doctor to upload your records from them.
        </Text>
        
        {/* Loading indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity onPress={handleCopy}>
              <TextInput
                style={styles.userId}
                editable={false} // Prevent editing, just display userId
                value={userId || 'Loading...'}
              />
            </TouchableOpacity>
            
            {/* QR Code */}
            {userId ? (
              <View style={styles.qrContainer}>
                <Text style={styles.qrText}>Scan this QR code to share your User ID:</Text>
                <QRCode
                  value={userId} // Pass the userId as the value for the QR code
                  size={150} // Set size for the QR code
                  backgroundColor="white" // Background color of the QR code
                  color="black" // Foreground color of the QR code
                />
              </View>
            ) : null}
          </>
        )}
      </View>

      {/* Add Medications Button */}
      <TouchableOpacity style={styles.addMedicationsContainer} onPress={handleAddMedications}>
        <Text style={styles.addMedicationsText}>ADD MEDICATIONS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#f7f7f7', // Soft background color
    height: '100%', // Full screen height
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    marginTop: 40, // Add space to separate from top
    backgroundColor: '#fff', // White background for the container
    borderRadius: 12, // Rounded corners for a soft look
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, // Subtle shadow effect
    elevation: 5, // For Android shadow
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc', // Light border around the image for a clean look
  },
  text: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Roboto', // Use a clean, modern font family
    flexShrink: 1,
    lineHeight: 24, // Better line spacing for readability
    textAlign: 'center',
    marginBottom: 20,
  },
  userId: {
    fontWeight: 'bold',
    fontSize: 16, // Slightly larger font for the user ID to make it stand out
    color: '#1e90ff', // Blue color for user ID to give it emphasis
    borderBottomWidth: 1,
    borderColor: '#ccc', // Border for better visibility
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '80%', // Set a width limit
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  addMedicationsContainer: {
    marginTop: 30, // Add space between QR code and button
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#007BFF', // Blue background for the button
    borderRadius: 12,
  },
  addMedicationsText: {
    color: '#fff', // White text for the button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
