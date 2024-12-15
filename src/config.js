import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBs_KejLFBmmSSF0KQd61jIwRnngk6Kbcc",
  authDomain: "expense-tracker-8d0a3.firebaseapp.com",
  projectId: "expense-tracker-8d0a3",
  storageBucket: "expense-tracker-8d0a3.firebasestorage.app",
  messagingSenderId: "730324675163",
  appId: "1:730324675163:web:a7eb0a8f8f959910872d7e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
