import React from "react";

// --- Stall Owner Page Component ---
const StallPage = ({ user, handleLogout }) => (
  <div>
    <h2>Welcome Stall Owner, {user.displayName || user.email}</h2>
    {user.photoURL && (
      <img
        src={user.photoURL}
        alt="User"
        style={{ width: "100px", borderRadius: "50%" }}
      />
    )}
    <br />
    <button
      onClick={handleLogout}
      style={{ padding: "10px 20px", marginTop: "20px" }}
    >
      Logout
    </button>
  </div>
);

export default StallPage;