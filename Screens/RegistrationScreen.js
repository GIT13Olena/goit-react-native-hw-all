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
  Image,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

import { useDispatch } from "react-redux";
import { updateUser, registerDB } from "../redux/auth/sliseRegistration";

const RegistrationScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardAvoidingViewEnabled, setKeyboardAvoidingViewEnabled] =
    useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (login.trim() === "") {
      console.log("Login is required");
      return;
    }

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
    } else if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters long");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: login });

      const { displayName, uid } = userCredential.user;

      dispatch(updateUser({ userId: uid, login: displayName, email }));

      dispatch(registerDB({ login, email, password }));

      // Redirect to the home screen after successful registration
      navigation.navigate("Home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError(
          "Email is already in use. Please choose a different email."
        );
      } else {
        console.log("Registration error:", error.message);
        setRegistrationError("Registration error: " + error.message);
      }
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -190 : -80}
        enabled={keyboardAvoidingViewEnabled}
      >
        <ImageBackground
          source={require("../images/image.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>
            <Image
              source={require("../images/userPhoto.png")}
              style={styles.photo}
            />
            <Text style={styles.title}>Реєстрація</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Логін"
                value={login}
                onChangeText={setLogin}
              />
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Адреса електронної пошти"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? (
                <Text style={styles.errorTextEmail}>{emailError}</Text>
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
              {registrationError ? (
                <Text style={styles.errorText}>{registrationError}</Text>
              ) : null}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRegister()}
              >
                <Text style={styles.buttonText}>Зареєструватися</Text>
              </TouchableOpacity>
              <Text
                style={styles.loginText}
                onPress={() => navigation.navigate("Увійти")}
              >
                Вже є аккаунт? Увійти
              </Text>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
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
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "white",
    padding: 20,
    bottom: 0,
    borderTopEndRadius: 40,
    borderTopLeftRadius: 40,
    position: "absolute",
    width: 390,
    height: 510,
    alignSelf: "center",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: -90,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 32,
    textAlign: "center",
    color: "#212121",
    fontFamily: "Roboto",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  inputContainer: {
    marginBottom: 16,
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
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    width: "100%",
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    alignItems: "center",
    padding: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  errorTextEmail: {
    color: "red",
    marginTop: -6,
  },
});

export default RegistrationScreen;
