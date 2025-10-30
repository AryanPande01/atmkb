import React from "react";

// --- Customer Page Component ---
const UserPage = ({ user, handleLogout }) => (
  <div>
    <h2>Welcome Customer, {user.displayName || user.email}</h2>
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

export default UserPage;