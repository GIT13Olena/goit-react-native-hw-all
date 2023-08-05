import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";
import PostsScreen from "./PostsScreen"; // Import PostsScreen component

const HomeScreen = ({ navigation, route }) => {
  const user = useSelector((state) => state.auth.user);
  const logOut = () => {
    navigation.navigate("Реєстрація");
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Home",
      headerRight: () => (
        <TouchableOpacity onPress={logOut} style={styles.logoutIconContainer}>
          <Icon name="log-out" size={24} color="#212121" />
        </TouchableOpacity>
      ),
    });

    // Extract the newPost and photoUri from the route's params
    const { newPost, photoUri } = route.params || {};

    if (newPost) {
      setShowPosts(true); // Show the Posts content on icon press
    }

    // You can use the photoUri here as needed, for example, to display the photo in the new post.
  }, [navigation, route.params]);

  const [showPosts, setShowPosts] = useState(true); // State to toggle showing Posts

  const handleNavigateToPosts = () => {
    setShowPosts(true); // Show the Posts content on icon press
  };

  const handleNavigateToCreate = () => {
    setShowPosts(false); // Hide the Posts content and show Create content on icon press
    navigation.navigate("Create");
  };

  const handleNavigateToProfile = () => {
    setShowPosts(false); // Hide the Posts content and show Profile content on icon press
    navigation.navigate("Profile");
  };

  const handleNavigateToComments = () => {
    setShowPosts(false); // Hide the Posts content and show Comments content on icon press
    navigation.navigate("Comments");
  };

  return (
    <View style={styles.container}>
      {user && user.login && (
        <>
          <Image
            source={require("../images/userPhoto.png")}
            style={styles.userPhoto}
          />
          <Text style={styles.userInfo}>{user.login}</Text>
          <Text style={styles.userInfo}>{user.email}</Text>
        </>
      )}
      {showPosts && <PostsScreen navigation={navigation} route={route} />}

      <View style={styles.line} />
      <View style={styles.iconBar}>
        <TouchableOpacity
          onPress={handleNavigateToPosts}
          style={styles.iconContainer}
        >
          <Icon name="grid" size={24} color="#212121" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigateToCreate}
          style={styles.iconContainer}
        >
          <Icon name="plus" size={24} color="#212121" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateToProfile}
          style={styles.iconContainer}
        >
          <Icon name="user" size={24} color="#212121" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  line: {
    height: 1,
    backgroundColor: "#C4C4C4",
    marginBottom: 10,
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  logoutIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  userPhoto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  userInfo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});

export default HomeScreen;
