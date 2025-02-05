import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, StatusBar, Image, ScrollView } from "react-native";
import { Images, argonTheme } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("screen");

const AddUserID = () => {
  const navigation = useNavigation();
  const [userID, setUserID] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    if (!userID) {
      alert("Please enter a user ID.");
      return;
    }
  
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
  
    try {
      const formData = new FormData();
      images.forEach((imageUri, index) => {
        formData.append("files", {
          uri: imageUri,
          name: `image${index}.jpg`,
          type: "image/jpeg",
        });
      });
  
      // Step 1: Upload images to get URLs
      const uploadResponse = await fetch("https://health-project-backend-url.vercel.app/multi_upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const uploadResult = await uploadResponse.json();
  
      if (!uploadResponse.ok) {
        alert(`Image upload failed: ${uploadResult.error}`);
        return;
      }
  
      const imageUrls = uploadResult.image_urls; // Assume this returns an array of image URLs
  
      // Step 2: Call the `/uploads_wrt_userId` API with the image URLs
      const payload = {
        user_id: userID,
        image_urls: imageUrls,
        title: "Sample Title", // Add appropriate title
        category: "Sample Category", // Add appropriate category
        date_time: new Date().toISOString(), // Use current date/time
      };
  
      const response = await fetch("https://health-project-backend-url.vercel.app/uploads_wrt_userId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Images and details uploaded successfully!");
        navigation.navigate("App");
      } else {
        alert(`Failed to save uploads: ${result.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };  
  

  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.granted) {
        let result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
        });

        if (!result.canceled) {
          await saveImage(result.assets[0].uri);
        }
      } else {
        alert("Camera permission is required!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        result.assets.forEach(asset => saveImage(asset.uri));
      }
    } catch (error) {
      alert("Failed to pick images from gallery");
    }
  };

  const saveImage = async (imageUri) => {
    try {
      setImages(prevImages => {
        const newImages = [...prevImages, imageUri];
        return newImages;
      });
    } catch (error) {
      alert("Error uploading image.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <ImageBackground
        source={Images.CameraUploadBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
          <View style={styles.container}>
            <Text style={styles.header}>Send Records To User ID</Text>
            
            {/* User ID Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter User ID"
              placeholderTextColor="#8a8a8a"
              value={userID}
              onChangeText={setUserID}
            />
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChooseFromGallery}>
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
          </View>

          {/* Display selected images at the bottom */}
          <View style={styles.imagePreviewContainer}>
            {images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.imagePreview}
              />
            ))}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderRadius: 10,
    // marginTop: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: argonTheme.COLORS.BUTTON_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 35,
    margin: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: argonTheme.COLORS.WHITE,
    fontSize: 18,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 100,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default AddUserID;
