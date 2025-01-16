import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons'; // Import icons

const { width, height } = Dimensions.get("screen");

const Register = () => {
  const navigation = useNavigation();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    setLoading(true); // Show loading indicator
    try {
      const response = await fetch('https://health-project-backend-url.vercel.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.status === 201 && data.success) {
        // Navigate to the "app" screen after successful registration
        alert("Registration successful!");
        navigation.navigate("app");
      } else if (response.status === 400 && data.message === "Email already registered.") {
        alert("Email is already registered. Please log in.");
        navigation.navigate("Login"); // Redirect to login if email already exists
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block safe flex middle>
          <Block style={styles.registerContainer}>
            <Block flex={0.25} middle style={styles.socialConnect}>
              <Text size={18} style={{ fontWeight: "bold", color: argonTheme.COLORS.PRIMARY }}>
                Your Digital Vault for Health and Wellness
              </Text>
            </Block>

            <Block flex center>
              <Block middle style={styles.loginText}>
                <Text color={argonTheme.COLORS.MUTED} size={14}>
                  Already have an account?{" "}
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text color={argonTheme.COLORS.PRIMARY} size={14} bold>
                      Login
                    </Text>
                  </TouchableOpacity>
                </Text>
              </Block>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                enabled
              >
                <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                  <Input
                    borderless
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    iconContent={
                      <Feather
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="user"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>
                <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                  <Input
                    borderless
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    iconContent={
                      <MaterialIcons
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="mail-outline"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>
                <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                  <Input
                    password
                    borderless
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} // Toggle password visibility
                    iconContent={
                      <>
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="lock" // Valid icon for lock
                          family="Feather" // Using Feather family
                          style={styles.inputIcons}
                        />
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name={!showPassword ? "eye-off" : "eye"} // Toggle visibility icon
                          family="Feather" // Using Feather for "eye" icons
                          style={styles.eyeIcon}
                          onPress={togglePasswordVisibility} // Toggle visibility on press
                        />
                      </>
                    }
                  />
                </Block>

                <Block row width={width * 0.75}>
                  <Checkbox
                    checkboxStyle={{
                      borderWidth: 3,
                    }}
                    color={argonTheme.COLORS.PRIMARY}
                    label="I agree with the"
                  />
                  <Button
                    style={{ width: 100 }}
                    color="transparent"
                    textStyle={{
                      color: argonTheme.COLORS.PRIMARY,
                      fontSize: 14,
                    }}
                  >
                    Privacy Policy
                  </Button>
                </Block>
                <Block middle>
                  <Button
                    color="primary"
                    style={styles.createButton}
                    onPress={handleRegister}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={argonTheme.COLORS.WHITE} />
                    ) : (
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        CREATE ACCOUNT
                      </Text>
                    )}
                  </Button>
                </Block>
              </KeyboardAvoidingView>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
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
  socialConnect: {
    borderColor: "#8898AA",
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
  },
  inputIcons: {
    marginRight: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
  },
});

export default Register;
