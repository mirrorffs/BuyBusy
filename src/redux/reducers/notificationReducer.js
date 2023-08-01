import { createSlice } from "@reduxjs/toolkit";
import { authActions } from "./authReducer";
import { cartActions } from "./cartReducer";

const initialState = {
  error_notification: null,
  success_notification: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    reset: (state, action) => {
      state.error_notification = null;
      state.success_notification = null;
    },
  },
  extraReducers: {
    [authActions.setNotification]: (state, action) => {
      if (action.payload.success) {
        state.success_notification = action.payload.success;
      } else if (action.payload.error) {
        state.error_notification = action.payload.error;
      }
    },
    [cartActions.setNotification]: (state, action) => {
      if (action.payload.success) {
        state.success_notification = action.payload.success;
      } else if (action.payload.error) {
        state.error_notification = action.payload.error;
      }
    }
  },
});

export const notificationReducer = notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;

export const notificationSelector = (state) => state.notificationReducer;
