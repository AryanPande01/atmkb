import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- Customer Page Component ---
const UserPage = ({ user, handleLogout }) => {
  const [wallet, setWallet] = useState(500);
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodeScanner, setQrCodeScanner] = useState(null);
  const [pointsToSend, setPointsToSend] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "user", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setWallet(userData.wallet || 500);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleScan = async (decodedText) => {
    try {
      // Validate points input
      const points = parseInt(pointsToSend);
      if (isNaN(points) || points <= 0) {
        alert("Please enter a valid positive number of points");
        return;
      }

      if (points > wallet) {
        alert("Insufficient points in your wallet!");
        return;
      }

      // Get stall owner data from the scanned QR code (decodedText is the UID)
      const stallOwnerDocRef = doc(db, "user", decodedText);
      const stallOwnerDocSnap = await getDoc(stallOwnerDocRef);

      if (!stallOwnerDocSnap.exists() || stallOwnerDocSnap.data().role !== 'store') {
        alert("Invalid QR code. This is not a valid stall owner QR code.");
        stopScanner();
        return;
      }

      // Check if user is trying to send points to themselves
      if (decodedText === user.uid) {
        alert("You cannot send points to yourself!");
        stopScanner();
        return;
      }

      const stallOwnerData = stallOwnerDocSnap.data();

      // Update customer wallet (subtract points)
      const customerWalletRef = doc(db, "user", user.uid);
      const newCustomerWallet = wallet - points;
      await updateDoc(customerWalletRef, {
        wallet: newCustomerWallet
      });

      // Update stall owner wallet (add points)
      const newStallOwnerWallet = (stallOwnerData.wallet || 0) + points;
      await updateDoc(stallOwnerDocRef, {
        wallet: newStallOwnerWallet
      });

      // Create transaction record
      await addDoc(collection(db, "transactions"), {
        stallOwnerId: decodedText,
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerEmail: user.email,
        points: points,
        timestamp: serverTimestamp()
      });

      alert(`Successfully transferred ${points} points to ${stallOwnerData.Username || stallOwnerData.email || "Stall Owner"}!`);
      
      // Update local wallet state
      setWallet(newCustomerWallet);
      stopScanner();
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Error processing transaction. Please try again.");
      stopScanner();
    }
  };

  const startScanner = () => {
    setShowScanner(true);
    
    // Use setTimeout to ensure the DOM element is rendered before initializing the scanner
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false // verbose
      );
      
      scanner.render(
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Error handling is silent for cleaner UI
        }
      );

      setQrCodeScanner(scanner);
    }, 100);
  };

  const stopScanner = () => {
    if (qrCodeScanner) {
      qrCodeScanner.clear().catch((err) => {
        console.error("Error stopping scanner:", err);
      });
      setQrCodeScanner(null);
    }
    setShowScanner(false);
  };

  const handleScannerButtonClick = () => {
    if (showScanner) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Welcome Customer, {user.displayName || user.email}</h2>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="User"
          style={{ width: "100px", borderRadius: "50%" }}
        />
      )}
      
      {/* Wallet Balance */}
      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "8px" }}>
        <h3>Wallet Balance</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
          {wallet} Points
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={handleScannerButtonClick}
          style={{ 
            padding: "12px 20px", 
            backgroundColor: "#8b5cf6", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "16px", 
            cursor: "pointer" 
          }}
        >
          {showScanner ? "Stop Scanner" : "Scan QR Code"}
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

      {/* Points Input */}
      {showScanner && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
            Enter Points to Send:
          </label>
          <input
            type="number"
            value={pointsToSend}
            onChange={(e) => setPointsToSend(e.target.value)}
            placeholder="Enter amount"
            min="1"
            max={wallet}
            style={{ 
              padding: "10px", 
              fontSize: "16px", 
              borderRadius: "8px", 
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          <p style={{ marginTop: "10px", color: "#6b7280", fontSize: "14px" }}>
            Points to send: {pointsToSend || 0}
          </p>
        </div>
      )}

      {/* QR Scanner Display */}
      {showScanner && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Scan Stall QR Code</h3>
          <div id="qr-reader" style={{ marginTop: "15px" }}></div>
          <p style={{ marginTop: "15px", color: "#6b7280", fontSize: "14px" }}>
            Point your camera at the stall's QR code
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPage;