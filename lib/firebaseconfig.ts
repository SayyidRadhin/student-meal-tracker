// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfm9evbwj_bG5ue6TfW4QN-FMqVY39vpQ",
  authDomain: "students-tracker-3e7bd.firebaseapp.com",
  projectId: "students-tracker-3e7bd",
  storageBucket: "students-tracker-3e7bd.appspot.com",
  messagingSenderId: "896428735150",
  appId: "1:896428735150:web:fcae9aedf70a5c5a3d4b3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore(app)