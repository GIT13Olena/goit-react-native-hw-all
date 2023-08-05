import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authReducer";

const rootReduser = combineReducers({
  [authSlice.name]: authSlice.reducer,
});

export const store = configureStore({
  reducer: rootReduser,
});
