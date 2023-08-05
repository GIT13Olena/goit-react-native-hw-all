import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import {
  updateUser,
  authSignOut,
  authStateChange,
} from "../auth/sliseRegistration";

export const authStateChanged = () => async (dispach) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { uid, displayName, email } = auth.currentUser;
      dispach(updateUser({ userId: uid, login: displayName, email }));
    }
    dispach(authStateChange({ stateChange: true }));
  });
};

export const registerDB =
  ({ login, email, password }) =>
  async (dispach) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: login });
      const { displayName, uid } = auth.currentUser;
      await dispach(updateUser({ userId: uid, login: displayName, email }));
    } catch (error) {
      throw error;
    }
  };

export const loginDB =
  ({ email, password }) =>
  async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return credentials.user;
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

const updateUserProfile = async (update) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, update);
    } catch (error) {
      throw error;
    }
  }
};
