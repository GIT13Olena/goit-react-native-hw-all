import React from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";
import { auth } from "../firebase/config"; // Import your Firebase auth instance

const CustomHeaderLogout = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Call Firebase's signOut method to log the user out
    } catch (error) {
      console.log("Error during logout:", error.message);
    }
  };

  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="logout"
        iconName="log-out"
        IconComponent={Feather} // Specify the icon component (Feather in this case)
        onPress={handleLogout} // Call the handleLogout function on press
      />
    </HeaderButtons>
  );
};

export default CustomHeaderLogout;
