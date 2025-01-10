import React, { useState } from "react";
import { StyleSheet, ImageBackground, Dimensions, StatusBar, View, TouchableOpacity, Text } from "react-native";
import { Images, argonTheme } from "../constants";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const { width, height } = Dimensions.get("screen");

const CameraUpload = () => {
  const navigation = useNavigation(); // useNavigation hook
  const [image, setImage] = useState();
  const [modelVisible, setModelVisible] = useState(false);

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

  const saveImage = async (imageUri) => {
    try {
      setImage(imageUri);
      setModelVisible(false);

      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `image.${fileType}`;

      const file = {
        uri: imageUri,
        type: `image/${fileType}`,
        name: fileName,
      };

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("https://health-project-backend-url.vercel.app/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const { image_url } = response.data;
        // After the image is uploaded successfully, navigate to Categories screen and pass the imageUrl
        navigation.navigate("Categories", { imageUrl: image_url });
      } else {
        alert("Error uploading image");
      }
    } catch (error) {
      alert("Error uploading image.");
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
