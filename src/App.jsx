import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// --- UPDATED IMPORTS ---
import Login from "./components/Login";
import UserPage from "./components/UserPage"; // Import customer page
import StallPage from "./components/StallPage"; // Import stall owner page

// --- INLINE COMPONENTS (UserPage, StallPage) HAVE BEEN REMOVED ---

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is logged in, fetch their role from Firestore
        const userDocRef = doc(db, "user", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          setUserData({
            auth: currentUser,
            role: firestoreData.role,
          });
        } else {
          // Fallback if doc doesn't exist
          console.error("No user document found in Firestore!");
          setUserData({ auth: currentUser, role: null }); // No role
        }
      } else {
        // User is logged out
        setUserData(null);
      }
      setLoading(false); // Stop loading once auth check is complete
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // Main render logic (This logic is unchanged, but now uses imported components)
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {!userData ? (
        <Login />
      ) : userData.role === 'customer' ? (
        <UserPage user={userData.auth} handleLogout={handleLogout} />
      ) : userData.role === 'store' ? (
        <StallPage user={userData.auth} handleLogout={handleLogout} />
      ) : (
        // Fallback
        <div>
          <h2>Welcome, {userData.auth.displayName || userData.auth.email}</h2>
          <p>Your role is not defined. Please contact support.</p>
          <button
            onClick={handleLogout}
            style={{ padding: "10px 20px", marginTop: "20px" }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;