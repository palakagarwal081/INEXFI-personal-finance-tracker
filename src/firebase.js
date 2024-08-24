// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqDwpNfLYg97K7KgI9s8v12GNiXasVxgo",
  authDomain: "inexfi-rec.firebaseapp.com",
  projectId: "inexfi-rec",
  storageBucket: "inexfi-rec.appspot.com",
  messagingSenderId: "383676036919",
  appId: "1:383676036919:web:0889703170cc4b0f048cb2",
  measurementId: "G-DR1D8Q7Q1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };