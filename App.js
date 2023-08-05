import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "./Screens/RegistrationScreen";
import LoginScreen from "./Screens/LoginScreen";
import PostsScreen from "./Screens/PostsScreen";
import HomeScreen from "./Screens/HomeScreen";
import CreatePostsScreen from "./Screens/CreatePostsScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import CommentsScreen from "./Screens/CommentsScreen";
import MapScreen from "./Screens/MapScreen";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Реєстрація">
          <Stack.Screen name="Реєстрація" component={RegistrationScreen} />
          <Stack.Screen name="Увійти" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Posts" component={PostsScreen} />
          <Stack.Screen name="Comments" component={CommentsScreen} />
          <Stack.Screen name="Create" component={CreatePostsScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
