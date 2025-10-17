// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZsNLC1XwktzE4dT-e-CaFL_ZP1YTNCCk",
  authDomain: "e-summit-2026-app.firebaseapp.com",
  projectId: "e-summit-2026-app",
  storageBucket: "e-summit-2026-app.firebasestorage.app",
  messagingSenderId: "606826344631",
  appId: "1:606826344631:web:860517b82e7958b0bcdd32",
  measurementId: "G-QD6VY1Y0H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
