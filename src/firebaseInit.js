// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6MN1h1JPMByjJe5Yy83jno5oyKLsXEAM",
  authDomain: "buybusy-50c0e.firebaseapp.com",
  projectId: "buybusy-50c0e",
  storageBucket: "buybusy-50c0e.appspot.com",
  messagingSenderId: "506057812923",
  appId: "1:506057812923:web:66e5aa31449fa137d0b29e",
  measurementId: "G-S5H2HFS9EW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);