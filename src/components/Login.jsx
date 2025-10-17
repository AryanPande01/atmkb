import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Enforce organization email
      const allowedDomain = "iiitn.ac.in";
      if (!user.email.endsWith(`@${allowedDomain}`)) {
        alert("Access denied: Only IIITN users can sign in.");
        await auth.signOut(); // Log out the user
        return;
      }

      // Save user info to Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastLogin: serverTimestamp(),
      });

      alert(`Welcome ${user.displayName}!`);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login with Google</h2>
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px" }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
