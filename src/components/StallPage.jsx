import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// --- Stall Owner Page Component ---
const StallPage = ({ user, handleLogout }) => {
  const [showQR, setShowQR] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  // Generate unique QR code based on user's UID
  const qrData = user.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "user", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setWallet(userData.wallet || 0);
          
          // Fetch transactions for this stall owner
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("stallOwnerId", "==", user.uid)
          );
          const transactionsSnapshot = await getDocs(transactionsQuery);
          const transactionsList = [];
          transactionsSnapshot.forEach((doc) => {
            transactionsList.push({ id: doc.id, ...doc.data() });
          });
          // Sort by timestamp, newest first
          transactionsList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
          setTransactions(transactionsList);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Welcome Stall Owner, {user.displayName || user.email}</h2>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="User"
          style={{ width: "100px", borderRadius: "50%" }}
        />
      )}
      
      {/* Wallet Balance */}
      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f9ff", borderRadius: "8px" }}>
        <h3>Wallet Balance</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
          {wallet} Points
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => setShowQR(!showQR)}
          style={{ 
            padding: "12px 20px", 
            backgroundColor: "#10b981", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "16px", 
            cursor: "pointer" 
          }}
        >
          {showQR ? "Hide QR Code" : "Generate QR Code"}
        </button>

        <button
          onClick={() => setShowTransactions(!showTransactions)}
          style={{ 
            padding: "12px 20px", 
            backgroundColor: "#3b82f6", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "16px", 
            cursor: "pointer" 
          }}
        >
          {showTransactions ? "Hide Transactions" : "View Transactions"}
        </button>

        <button
          onClick={handleLogout}
          style={{ 
            padding: "12px 20px", 
            backgroundColor: "#ef4444", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "16px", 
            cursor: "pointer" 
          }}
        >
          Logout
        </button>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <h3>Your Unique QR Code</h3>
          <div style={{ padding: "20px", backgroundColor: "#fafafa", borderRadius: "8px" }}>
            <QRCodeSVG value={qrData} size={256} />
          </div>
          <p style={{ marginTop: "15px", color: "#6b7280", fontSize: "14px" }}>
            Customers can scan this to make purchases
          </p>
        </div>
      )}

      {/* Transaction History */}
      {showTransactions && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <p style={{ color: "#6b7280", marginTop: "10px" }}>No transactions yet</p>
          ) : (
            <div style={{ marginTop: "15px" }}>
              {transactions.map((tx) => (
                <div 
                  key={tx.id}
                  style={{ 
                    padding: "15px", 
                    marginBottom: "10px", 
                    backgroundColor: "#f9fafb", 
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: "bold", margin: 0 }}>
                        {tx.customerName || "Unknown Customer"}
                      </p>
                      <p style={{ color: "#6b7280", fontSize: "14px", margin: "5px 0 0 0" }}>
                        {tx.customerEmail}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "#10b981", fontWeight: "bold", margin: 0 }}>
                        +{tx.points} Points
                      </p>
                      <p style={{ color: "#6b7280", fontSize: "12px", margin: "5px 0 0 0" }}>
                        {tx.timestamp ? new Date(tx.timestamp.toMillis()).toLocaleString() : "Unknown date"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StallPage;