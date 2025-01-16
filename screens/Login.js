import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Block, Text } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("screen");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,  // New state for toggling password visibility
    };
  }

  // Check AsyncStorage on component mount
  async componentDidMount() {
    try {
      const userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails) {
        // If user is already logged in, navigate directly to "App"
        this.props.navigation.navigate("App");
      }
    } catch (error) {
      console.error("Error checking AsyncStorage", error);
    }
  }

  handleLogin = async () => {
    const { email, password } = this.state;
    console.log(email, password);

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("https://health-project-backend-url.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.success) {
        // Store user details in AsyncStorage
        const userDetails = JSON.stringify(data.user); // Assuming `data.user` contains the user details
        await AsyncStorage.setItem("userDetails", userDetails);

        Alert.alert("Success", "Login successful!");
        this.props.navigation.navigate("App"); // Navigate to the App screen
      } else {
        Alert.alert("Error", data.message || "Login failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
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
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      borderless
                      placeholder="Email"
                      value={this.state.email}
                      onChangeText={(text) => this.setState({ email: text })}
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="user"  // Changed to valid icon from Feather
                          family="Feather"  // Changed to Feather family
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      password={true}
                      borderless
                      placeholder="Password"
                      value={this.state.password}
                      onChangeText={(text) => this.setState({ password: text })}
                      secureTextEntry={!this.state.showPassword}  // Toggle password visibility
                      iconContent={
                        <>
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="lock"  // Changed to valid icon from Feather
                            family="Feather"  // Changed to Feather family
                            style={styles.inputIcons}
                          />
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name={!this.state.showPassword ? "eye-off" : "eye"}  // Valid icons for visibility toggle
                            family="Feather"  // Using Feather for "eye" icons
                            style={styles.eyeIcon}
                            onPress={this.togglePasswordVisibility}  // Toggle visibility
                          />
                        </>
                      }
                    />
                  </Block>
                  <Block middle>
                    <Button
                      color="primary"
                      style={styles.loginButton}
                      onPress={this.handleLogin}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        LOGIN
                      </Text>
                    </Button>
                  </Block>
                  <Block middle style={styles.linkContainer}>
                    <Text size={12} color={argonTheme.COLORS.MUTED}>
                      Don't have an account?{" "}
                      <Text
                        style={styles.linkText}
                        onPress={() => {
                          this.props.navigation.navigate("Register");
                        }}
                      >
                        Sign Up
                      </Text>
                    </Text>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.75,
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
  inputIcons: {
    marginRight: 12,
  },
  eyeIcon: {
    marginLeft: 10,
    position: 'absolute',  // Position it absolutely to place it at the far right
    right: 10,  // Align it to the right
    top: 15,  // Center it vertically in the input field
  },
  loginButton: {
    width: width * 0.5,
    marginTop: 25,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: argonTheme.COLORS.PRIMARY,
    textDecorationLine: "underline",
  },
});

export default Login;
