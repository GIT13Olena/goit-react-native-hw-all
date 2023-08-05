import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA15S1W7XQmRCX_RZ7JVMPqR7vuhoNLISU",
  authDomain: "photoscreen-96e7f.firebaseapp.com",
  projectId: "photoscreen-96e7f",
  storageBucket: "photoscreen-96e7f.appspot.com",
  messagingSenderId: "896441646986",
  appId: "1:896441646986:web:695b7eecda1e3791405273",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const uploadPhotoToServer = async (photoUri, postId) => {
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    const imageName = `images/${postId}.jpg`; // Adjust the image name as needed
    const imageRef = storage.ref().child(imageName);
    await imageRef.put(blob);
    const imageUrl = await imageRef.getDownloadURL();
    return imageUrl;
  } catch (error) {
    console.log("Error uploading photo:", error.message);
    throw error;
  }
};
