import React, { useState } from "react";
// UPDATED: Import the secure sign-in methods from Firebase Auth
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider, db } from "../firebase";
// UPDATED: Added getDoc to read the user's role
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  // RE-ADDED: State for the active tab
  const [activeTab, setActiveTab] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UPDATED: This function now also verifies the user's role and wallet after login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Authenticate the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Check the user's role in Firestore
      // UPDATED: Changed collection name to "user"
      const userDocRef = doc(db, "user", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data(); // Get all existing data
        const storedRole = userData.role;

        // Step 3: Verify if the stored role matches the selected tab
        if (storedRole === activeTab) {
          // Role matches, login is successful. Prepare update.
          const updateData = { lastLogin: serverTimestamp() };

          // --- UPDATED WALLET LOGIC ---
          // If the user is a customer and doesn't have a wallet, create one with 500.
          if (activeTab === 'customer' && userData.wallet === undefined) {
            updateData.wallet = 500;
          } 
          // If the user is a store owner and doesn't have a wallet, create one with 0.
          else if (activeTab === 'store' && userData.wallet === undefined) {
            updateData.wallet = 0;
          }
          // --- END WALLET LOGIC ---

          await setDoc(userDocRef, updateData, { merge: true });
          alert(`✅ Login successful as ${activeTab}!`);
          // Redirection is handled by App.jsx's onAuthStateChanged
        } else {
          // Role mismatch. Alert the user and sign them out.
          alert(`❌ Authentication failed. You are registered as a ${storedRole}, not a ${activeTab}.`);
          await auth.signOut();
        }
      } else {
        // User is authenticated but has no Firestore document. Create one.
        // --- UPDATED WALLET LOGIC ---
        const newUserPayload = {
          uid: user.uid,
          email: user.email,
          role: activeTab, // Sets the role for the first time
          lastLogin: serverTimestamp()
        };

        // If the new user is a customer, grant 500 credits
        if (activeTab === 'customer') {
          newUserPayload.wallet = 500;
        } 
        // If the new user is a store owner, set wallet to 0
        else if (activeTab === 'store') {
          newUserPayload.wallet = 0;
        }
        
        // UPDATED: Changed collection name to "user"
        await setDoc(userDocRef, newUserPayload, { merge: true });
        // --- END WALLET LOGIC ---
        alert(`✅ Welcome! Your profile has been created as a ${activeTab}.`);
        // Redirection is handled by App.jsx's onAuthStateChanged
      }
    } catch (error) {
      console.error("Login error:", error);
      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert("❌ Invalid email or password. Please try again.");
      } else {
        alert(`⚠️ Something went wrong: ${error.message}`);
      }
    }
  };

  // Google Sign-In now checks for role and adds wallet credits
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const allowedDomain = "iiitn.ac.in";
      if (!user.email.endsWith(`@${allowedDomain}`)) {
        alert("Access denied: Only IIITN users can sign in.");
        await auth.signOut();
        return;
      }

      // --- MODIFIED: Check existing user data for role and wallet ---
      // UPDATED: Changed collection name to "user"
      const userDocRef = doc(db, "user", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // --- EXISTING USER ---
        const userData = userDocSnap.data();
        
        // Check for role mismatch
        if (userData.role !== activeTab) {
          alert(`❌ Authentication failed. You are registered as a ${userData.role}, not a ${activeTab}.`);
          await auth.signOut();
          return;
        }

        // Role matches. Prepare data for update.
        const updateData = {
          Username: user.displayName,
          email: user.email,
          photo: user.photoURL,
          lastLogin: serverTimestamp(),
        };

        // --- UPDATED WALLET LOGIC ---
        // If they are a customer and don't have a wallet, create one with 500.
        if (activeTab === 'customer' && userData.wallet === undefined) {
          updateData.wallet = 500;
        } 
        // If they are a store owner and don't have a wallet, create one with 0.
        else if (activeTab === 'store' && userData.wallet === undefined) {
          updateData.wallet = 0;
        }
        // --- END WALLET LOGIC ---

        await setDoc(userDocRef, updateData, { merge: true });
        alert(`Welcome back, ${user.displayName}!`);
        // Redirection is handled by App.jsx's onAuthStateChanged

      } else {
        // --- NEW USER ---
        const newUserPayload = {
          uid: user.uid,
          Username: user.displayName,
          email: user.email,
          photo: user.photoURL,
          lastLogin: serverTimestamp(),
          role: activeTab
        };

        // --- UPDATED WALLET LOGIC ---
        // If the new user is a customer, grant 500 credits
        if (activeTab === 'customer') {
          newUserPayload.wallet = 500;
        } 
        // If the new user is a store owner, set wallet to 0
        else if (activeTab === 'store') {
          newUserPayload.wallet = 0;
        }
        // --- END WALLET LOGIC ---

        await setDoc(userDocRef, newUserPayload);
        alert(`Welcome ${user.displayName}! Your profile has been created.`);
        // Redirection is handled by App.jsx's onAuthStateChanged
      }
      // --- END MODIFIED BLOCK ---

    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
          height: "fit-content",
        }}
      >
        <h2>Login</h2>
        {/* RE-ADDED: Tabs for Customer/Store Owner */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("customer")}
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderBottom: activeTab === "customer" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "customer" ? "#2563eb" : "#6b7280",
            }}
          >
            Customer
          </button>
          <button
            onClick={() => setActiveTab("store")}
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderBottom: activeTab === "store" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "store" ? "#2563eb" : "#6b7280",
            }}
          >
            Store Owner
          </button>
        </div>
        <form onSubmit={handleEmailPasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: '1px solid #ccc', width: '94%' }}
          />
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "10px 45px 10px 10px", fontSize: "16px", borderRadius: "8px", border: '1px solid #ccc', width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '1px', top: '1px', bottom: '1px',
                width: '45px', background: 'transparent', border: 'none',
                borderTopRightRadius: '8px', borderBottomRightRadius: '8px',
                cursor: 'pointer', fontSize: '12px', color: '#6b7280'
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" style={{ padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", width: "100%" }}>
            Login
          </button>
        </form>
        <div style={{ margin: "10px 0" }}>OR</div>
        <button
          onClick={handleGoogleLogin}
          style={{ padding: "10px", backgroundColor: "#4285F4", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", width: "100%" }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;