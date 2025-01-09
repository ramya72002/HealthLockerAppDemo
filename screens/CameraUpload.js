import React, { useState } from "react";
import { StyleSheet, ImageBackground, Dimensions, StatusBar, View, TouchableOpacity, Text } from "react-native";
import { Images, argonTheme } from "../constants";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("screen");

const CameraUpload = () => {
  const [image, setImage] = useState();
  const [modelVisible, setModelVisible] = useState(false); // added missing state

  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.granted) {
        let result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true, // fixed typo here
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
      setModelVisible(false);
    }
  };

  const saveImage = async (imageUri) => {
    try {
      setImage(imageUri);
      setModelVisible(false); // close modal or handle visibility
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
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
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
      alert("Failed to pick image from gallery");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <ImageBackground
        source={Images.CameraUploadBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
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
