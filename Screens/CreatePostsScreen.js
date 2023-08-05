import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");

  const takePhoto = async () => {
    if (cameraRef.current) {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === "granted") {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1, // Висока якість
          aspect: [1, 1], // Аспектне відношення 1:1
        });
        setPhoto(photo.uri);
      } else {
        alert("Дозвольте доступ до камери, щоб зробити знімок.");
      }
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Аспектне відношення 1:1
        quality: 1, // Висока якість
      });

      if (!result.cancelled) {
        setPhoto(result.uri);
      }
    } else {
      alert("Дозвольте доступ до галереї, щоб обрати фото.");
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const handlePublish = async () => {
    // Request permission to access location data
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    // Create a new post object
    const newPost = {
      id: new Date().getTime(),
      title: photoTitle,
      location: photoLocation,
      imageUri: photo,
      comments: [],
      latitude,
      longitude,
    };

    // Use navigation to go back to the previous screen and pass the new post data
    navigation.navigate("Home", { newPost });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={(ref) => (cameraRef.current = ref)}>
          {photo ? (
            <View style={styles.cameraImageContainer}>
              <Image source={{ uri: photo }} style={styles.cameraImage} />
              <TouchableOpacity
                onPress={removePhoto}
                style={styles.photoActionButton}
              >
                <Text style={styles.photoActionButtonText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraIconContainer}>
              <TouchableOpacity
                onPress={takePhoto}
                style={styles.snapContainer}
              >
                <MaterialIcons name="camera-alt" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
          )}
        </Camera>
      </View>
      {!photo && (
        <TouchableOpacity onPress={pickFromGallery} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Завантажити з галереї</Text>
        </TouchableOpacity>
      )}
      <TextInput
        placeholder="Назва"
        value={photoTitle}
        onChangeText={setPhotoTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Розташування"
        value={photoLocation}
        onChangeText={setPhotoLocation}
        style={styles.input}
      />
      <TouchableOpacity onPress={handlePublish} style={styles.publishButton}>
        <Text style={styles.publishButtonText}>Опублікувати</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#ffffff",
    flex: 1,
  },
  cameraContainer: {
    marginTop: "5%",
    marginHorizontal: "5%",
    alignItems: "center",
    height: 300,
    justifyContent: "flex-start",
    position: "relative",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "#FFFFFF4D",
  },
  snapContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  cameraImageContainer: {
    flex: 1,
    position: "relative",
  },
  cameraImage: {
    flex: 1,
    width: "100%",
  },
  photoActionButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#FFFFFF4D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  photoActionButtonText: {
    color: "#000",
  },
  uploadButton: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF4D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 16,
  },
  uploadButtonText: {
    color: "#000",
  },
  input: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  publishButton: {
    alignSelf: "center",
    backgroundColor: "#FF6C00",
    paddingVertical: 14,
    paddingHorizontal: 130,
    borderRadius: 100,
    marginTop: 35,
  },
  publishButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreatePostsScreen;
