import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebaseInit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const initialState = {
  isLoggedIn: false,
  user: null,
  message: true,
  loadingAuth: true,
};

const auth = getAuth();

export const createUser = createAsyncThunk(
  "auth/createUser",
  (payload, thunkAPI) => {
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        // Signed in
        const new_user = userCredential.user;
        // console.log(new_user);

        const docNew = {
          uid: new_user.uid,
          email: new_user.email,
          name: payload.name,
          password: payload.password,
          created_at: new Date(),
        };

        saveUser(docNew);

        thunkAPI.dispatch(
          authActions.login({
            user: {
              uid: new_user.uid,
              apiKey: new_user.apiKey,
              email: new_user.email,
            },
          })
        );
        thunkAPI.dispatch(
          authActions.setNotification({ success: "User Sign-Up Successfull" })
        );
      })
      .catch((error) => {
        // const errorCode = error.code;
        // thunkAPI.dispatch(authActions.logout());
        thunkAPI.dispatch(
          authActions.setNotification({
            error: error.message.split("Firebase:")[1],
          })
        );
      });
  }
);

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  (payload, thunkAPI) => {
    thunkAPI.dispatch(authActions.setLoading());
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        // Signed in
        const new_user = userCredential.user;
        // console.log(new_user);

        thunkAPI.dispatch(
          authActions.login({
            user: {
              uid: new_user.uid,
              apiKey: new_user.apiKey,
              email: new_user.email,
            },
          })
        );
        thunkAPI.dispatch(
          authActions.setNotification({ success: "User Sign-In Successfull" })
        );
      })
      .catch((error) => {
        // const errorCode = error.code;
        // thunkAPI.dispatch(authActions.logout());
        thunkAPI.dispatch(
          authActions.setNotification({
            error: error.message.split("Firebase:")[1],
          })
        );
      });
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  (_, thunkAPI) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        thunkAPI.dispatch(authActions.logout());
        thunkAPI.dispatch(
          authActions.setNotification({ success: "User Sign-Out Successfull" })
        );
      })
      .catch((error) => {
        // const errorCode = error.code;
        // thunkAPI.dispatch(authActions.login());
        thunkAPI.dispatch(
          authActions.setNotification({
            error: error.message.split("Firebase:")[1],
          })
        );
      });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loadingAuth = true;
    },
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.loadingAuth = false;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loadingAuth = false;
    },
    setNotification: (state, action) => {
      state.message = true;
    },
  },
});

const saveUser = async (user) => {
  const docRef = collection(db, "users");
  await addDoc(docRef, user);
};

export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;

export const authSelector = (state) => state.authReducer;
