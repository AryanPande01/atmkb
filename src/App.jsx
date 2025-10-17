import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <img
            src={user.photoURL}
            alt="User"
            style={{ width: "100px", borderRadius: "50%" }}
          />
          <br />
          <button
            onClick={handleLogout}
            style={{ padding: "10px 20px", marginTop: "20px" }}
          >
            Logout
          </button>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
