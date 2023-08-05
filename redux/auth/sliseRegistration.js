import { createSlice } from "@reduxjs/toolkit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/config";

const initialState = {
  userId: null,
  login: null,
  email: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.userId = action.payload.userId;
      state.login = action.payload.login;
      state.email = action.payload.email;
    },
    authStateChange: (state, action) => {
      state.stateChange = action.payload.stateChange;
    },
    authSignOut: () => initialState,
  },
});

export const { updateUser, authSignOut, authStateChange } = authSlice.actions;
export default authSlice.reducer;

export const authStateChanged = () => async (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { uid, displayName, email } = user;
      dispatch(updateUser({ userId: uid, login: displayName, email }));
    }
    dispatch(authStateChange({ stateChange: true }));
  });
};

export const registerDB =
  ({ login, email, password }) =>
  async (dispatch) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: login });
      const { displayName, uid } = userCredential.user;
      await dispatch(updateUser({ userId: uid, login: displayName, email }));
    } catch (error) {
      throw error;
    }
  };

export const loginDB =
  ({ email, password }) =>
  async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return auth.currentUser;
    } catch (error) {
      throw error;
    }
  };

export const authLogOut = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    console.log("error", error.message);
  }
};
