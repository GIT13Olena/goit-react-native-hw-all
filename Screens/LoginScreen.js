import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useDispatch } from "react-redux";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardAvoidingViewEnabled, setKeyboardAvoidingViewEnabled] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (email.trim() === "") {
      setEmailError("Email is required");
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    }

    try {
      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // If login is successful, navigate to the Home screen
      navigation.navigate("Home");
    } catch (error) {
      console.log("Login error:", error.message);
      setRegistrationError("Login error: " + error.message);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardAvoidingViewEnabled(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardAvoidingViewEnabled(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../images/image.jpg")}
          style={styles.backgroundImage}
        >
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? -150 : -80}
            enabled={keyboardAvoidingViewEnabled}
          >
            <View style={styles.overlay}>
              <Text style={styles.title}>Увійти</Text>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Адреса електронної пошти"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordError && styles.inputError,
                  ]}
                  placeholder="Пароль"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordButton}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? "Сховати" : "Показати"}
                  </Text>
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
              <TouchableOpacity
                style={[
                  styles.buttonLogin,
                  keyboardAvoidingViewEnabled && styles.hidden,
                ]}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Увійти</Text>
              </TouchableOpacity>
              <Text
                style={styles.loginText}
                onPress={() => navigation.navigate("Реєстрація")}
              >
                Немає аккаунту? Зареєструватися
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "cover",
    justifyContent: "center",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  overlay: {
    backgroundColor: "white",
    padding: 20,
    bottom: 0,
    borderTopEndRadius: 40,
    borderTopLeftRadius: 40,
    position: "absolute",
    width: 390,
    height: 500,
    alignSelf: "center",
  },
  title: {
    color: "#212121",
    fontFamily: "Roboto",
    fontSize: 30,
    fontWeight: "500",
    marginTop: 27,
    marginBottom: 32,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  buttonLogin: {
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    marginTop: 40,
    alignItems: "center",
    padding: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    borderColor: "#E8E8E8",
    borderBottomColor: "#E8E8E8",
    marginBottom: 10,
    padding: 10,
    color: "#BDBDBD",
  },
  inputError: {
    borderColor: "red",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderColor: "#E8E8E8",
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    color: "#BDBDBD",
    backgroundColor: "#F6F6F6",
    padding: 10,
    borderRadius: 10,
  },
  showPasswordButton: {
    padding: 12,
    backgroundColor: "#F6F6F6",
  },
  showPasswordText: {
    color: "#FF6C00",
    fontWeight: "bold",
  },
  hidden: {
    opacity: 0,
    height: 0,
  },
  loginText: {
    marginTop: 20,
    textAlign: "center",
    color: "#1B4371",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    textAlign: "center",
  },
});

export default LoginScreen;
