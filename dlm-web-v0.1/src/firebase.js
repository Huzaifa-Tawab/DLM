// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0Wl6Ra19J7LZLZ_h2S_M9LIIamoJpBGU",
  authDomain: "dlm-webapp.firebaseapp.com",
  databaseURL: "https://dlm-webapp-default-rtdb.firebaseio.com/",
  projectId: "dlm-webapp",
  storageBucket: "dlm-webapp.appspot.com",
  messagingSenderId: "21260422106",
  appId: "1:21260422106:web:b14a7a03d720d52a668ee3",
  
  measurementId: "G-V09XVGZREJ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rdb = getDatabase(app);
