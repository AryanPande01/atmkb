import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Your Firebase project configuration
// Load from environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.apiKey,
  authDomain: import.meta.env.authDomain,
  projectId: import.meta.env.projectId,
  storageBucket: import.meta.env.storageBucket,
  messagingSenderId: import.meta.env.messagingSenderId,
  appId: import.meta.env.appId,
  measurementId: import.meta.env.measurementId
};

// Validate that all required environment variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Missing required Firebase configuration. Please check your .env.local file.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Initialize Firestore with long-polling enabled as a workaround for network issues.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});