import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import usersReducer from "./slices/usersSlice";
import analyticsReducer from "./slices/analyticsSlice";
import activityReducer from "./slices/activitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    analytics: analyticsReducer,
    activity: activityReducer,
  },
});
