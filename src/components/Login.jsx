import React, { useState } from "react";
// UPDATED: Import the secure sign-in methods from Firebase Auth
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider, db } from "../firebase";
// UPDATED: Added getDoc to read the user's role
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- HELPER FUNCTION (Only for Email/Password login) ---
  const getRoleAndWallet = (email) => {
    if (email.startsWith('customer')) {
      return { assignedRole: 'customer', assignedWallet: 500 };
    } else if (email.startsWith('stall')) {
      return { assignedRole: 'store', assignedWallet: 0 };
    } else {
      // No role can be assigned
      return { assignedRole: null, assignedWallet: undefined };
    }
  };
  // --- END HELPER FUNCTION ---

  // UPDATED: This function now derives role from email
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Authenticate the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Check the user's role in Firestore
      const userDocRef = doc(db, "user", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // --- EXISTING USER ---
        const userData = userDocSnap.data(); 
        const storedRole = userData.role;

        // Prepare update
        const updateData = { lastLogin: serverTimestamp() };

        // --- UPDATED WALLET LOGIC ---
        if (storedRole === 'customer' && userData.wallet === undefined) {
          updateData.wallet = 500;
        } 
        else if (storedRole === 'store' && userData.wallet === undefined) {
          updateData.wallet = 0;
        }
        // --- END WALLET LOGIC ---

        await setDoc(userDocRef, updateData, { merge: true });
        alert(`✅ Login successful as ${storedRole}!`);

      } else {
        // --- NEW USER / NO FIRESTORE DOC ---
        
        // --- NEW: Derive role and wallet from email ---
        const { assignedRole, assignedWallet } = getRoleAndWallet(user.email);
        
        if (!assignedRole) {
          // Block user creation if email prefix is invalid
          alert(`❌ Login failed. Your email (${user.email}) does not have a valid role prefix ('customer' or 'stall').`);
          await auth.signOut(); // Sign out the user
          return;
        }
        // --- END NEW LOGIC ---

        const newUserPayload = {
          uid: user.uid,
          email: user.email,
          role: assignedRole, // Sets the role based on email
          lastLogin: serverTimestamp(),
          wallet: assignedWallet // Sets wallet based on email
        };
        
        await setDoc(userDocRef, newUserPayload, { merge: true });
        alert(`✅ Welcome! Your profile has been created as a ${assignedRole}.`);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert("❌ Invalid email or password. Please try again.");
      } else {
        alert(`⚠️ Something went wrong: ${error.message}`);
      }
    }
  };

  // Google Sign-In now also derives role from email
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

      const userDocRef = doc(db, "user", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // --- EXISTING USER ---
        const userData = userDocSnap.data();
        const storedRole = userData.role;
        
        const updateData = {
          Username: user.displayName,
          email: user.email,
          photo: user.photoURL,
          lastLogin: serverTimestamp(),
        };

        // --- UPDATED WALLET LOGIC ---
        if (storedRole === 'customer' && userData.wallet === undefined) {
          updateData.wallet = 500;
        } 
        else if (storedRole === 'store' && userData.wallet === undefined) {
          updateData.wallet = 0;
        }
        // --- END WALLET LOGIC ---

        await setDoc(userDocRef, updateData, { merge: true });
        alert(`Welcome back, ${user.displayName}!`);

      } else {
        // --- NEW USER ---

        // --- MODIFIED LOGIC FOR GOOGLE SIGN-IN ---
        // We no longer check for 'customer' or 'stall' prefix.
        // Any new user from @iiitn.ac.in is a customer with 500.
        
        // --- REMOVED LOGIC ---
        // const { assignedRole, assignedWallet } = getRoleAndWallet(user.email);
        // if (!assignedRole) { ... }
        // --- END REMOVED LOGIC ---
        
        // --- NEW LOGIC ---
        const assignedRole = 'customer';
        const assignedWallet = 500;
        // --- END NEW LOGIC ---

        const newUserPayload = {
          uid: user.uid,
          Username: user.displayName,
          email: user.email,
          photo: user.photoURL,
          lastLogin: serverTimestamp(),
          role: assignedRole, // Automatically 'customer'
          wallet: assignedWallet // Automatically 500
        };

        await setDoc(userDocRef, newUserPayload);
        alert(`Welcome ${user.displayName}! Your profile has been created.`);
      }

    } catch (error)
     {
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