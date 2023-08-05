import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MapScreen } from "./MapScreen"; // Import the MapScreen component

const PostsScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);

  // Load posts from AsyncStorage when the component mounts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const savedPosts = await AsyncStorage.getItem("posts");
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadPosts();
  }, []);

  // Save posts to AsyncStorage whenever they change
  useEffect(() => {
    const savePosts = async () => {
      try {
        await AsyncStorage.setItem("posts", JSON.stringify(posts));
      } catch (error) {
        console.error(error);
      }
    };
    savePosts();
  }, [posts]);

  const newPost = route.params?.newPost;
  useEffect(() => {
    if (newPost) {
      // Check if the newPost is already in the posts list to avoid duplicates
      if (!posts.some((post) => post.id === newPost.id)) {
        setPosts((prevPosts) => [...prevPosts, newPost]);
      }
    }
  }, [newPost, posts]);

  const handleAddComment = (postId, newCommentText) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newCommentText],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const handleComment = (postId) => {
    navigation.navigate("Comments", {
      postId,
      comments: posts.find((post) => post.id === postId)?.comments || [],
      handleAddComment,
      navigation, // Pass the navigation prop
    });
  };

  const handleViewMap = (latitude, longitude, namePost, photo) => {
    navigation.navigate("Map", {
      photo,
      namePost,
      location: { latitude, longitude },
      showUserLocation: false, // Додаємо параметр showUserLocation, щоб показувати маркер на місці фото, а не на геолокації
    });
  };

  const handleDeletePost = (postId) => {
    // Remove the post with the given postId from the posts array
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const getCommentCountForPost = (postId) => {
    const post = posts.find((item) => item.id === postId);
    return post ? post.comments.length : 0;
  };

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <TouchableOpacity
        onPress={() =>
          handleViewMap(
            item.latitude,
            item.longitude,
            item.title,
            item.imageUri
          )
        }
      >
        <Text style={styles.postLocation}>{item.location}</Text>
      </TouchableOpacity>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.postImage} />
      )}
      <Text style={styles.postTitle}>{item.title}</Text>
      <TouchableOpacity
        onPress={() => handleComment(item.id)}
        style={styles.commentContainer}
      >
        <Icon name="message-circle" size={24} color="#BDBDBD" />
        <Text style={styles.commentCount}>
          {getCommentCountForPost(item.id)} Comments
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeletePost(item.id)} // Call the handleDeletePost function on button press
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    padding: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#212121",
    fontWeight: "bold",
  },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: -20,
  },
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
    marginTop: -14,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postLocation: {
    color: "#888",
  },
  postImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginTop: 8,
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  commentCount: {
    marginLeft: 8,
  },
});

export default PostsScreen;
