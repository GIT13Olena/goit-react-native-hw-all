import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CommentsScreen = ({ route, navigation }) => {
  const { postId, imageUri } = route.params;
  console.log("imageUri:", imageUri);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Load comments from AsyncStorage when the component mounts
    const loadComments = async () => {
      try {
        const savedComments = await AsyncStorage.getItem(`comments_${postId}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadComments();
  }, []);

  useEffect(() => {
    // Save comments to AsyncStorage whenever they change
    const saveComments = async () => {
      try {
        await AsyncStorage.setItem(
          `comments_${postId}`,
          JSON.stringify(comments)
        );
      } catch (error) {
        console.error(error);
      }
    };
    saveComments();
  }, [comments, postId]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return; // Ignore empty comments
    const comment = {
      id: new Date().getTime(),
      text: newComment.trim(),
      timestamp: new Date().toLocaleString(),
      author: "Anonymous",
    };
    setComments((prevComments) => [...prevComments, comment]);
    setNewComment("");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.postImage} />
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.commentCount}>{comments.length} Comments</Text>
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment..."
        style={styles.commentInput}
      />
      <TouchableOpacity onPress={handleAddComment} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  postImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 16,
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
    paddingBottom: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
  },
  commentAuthor: {
    color: "#888",
    marginTop: 4,
  },
  commentTimestamp: {
    color: "#888",
    fontSize: 12,
  },
  commentCount: {
    color: "#888",
    marginBottom: 8,
  },
  commentInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#FF6C00",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CommentsScreen;
