import React, { useState } from "react";
import { StyleSheet, ImageBackground, Dimensions, StatusBar, View, TouchableOpacity, Text } from "react-native";
import { Images, argonTheme } from "../constants";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const { width, height } = Dimensions.get("screen");

const CameraUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image URI

  // Function to handle camera launch
  const handleCameraLaunch = () => {
    console.log("Launching camera..."); // Add this log
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
  
    console.log("Launching camera with options: ", options); // Log options too
  
    launchCamera(options, (response) => {
      console.log("Camera response:", response); // Log response
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri); // Update the state with the selected image URI
        console.log("Image URI:", imageUri);
      }
    });
  };
  

  // Function to handle choosing image from gallery
  const handleChooseFromGallery = () => {
    console.log("Choose from Gallery button pressed");
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri); // Update the state with the selected image URI
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <ImageBackground
        source={Images.CameraUploadBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} onPress={handleCameraLaunch}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleChooseFromGallery}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  CameraUploadContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  button: {
    backgroundColor: argonTheme.COLORS.BUTTON_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 35,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: argonTheme.COLORS.WHITE,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CameraUpload;
