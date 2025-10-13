import React, { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function Dashboard() {
  const [showToast, setShowToast] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // ✅ Always load user info
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setUserId(user.email);
      setUserName(user.username);
      setUserRole(user.role);
      
    }

    // ✅ Handle welcome toast separately
    if (localStorage.getItem("show_welcome_toast")) {
      setShowToast(true);
      localStorage.removeItem("show_welcome_toast");
    }
  }, []);

  return (
    <div className="p-5">
      {showToast && (
        <Toast
          message="Welcome to Dashboard!"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Here’s your admin overview... {userName}</p>
    </div>
  );
}
