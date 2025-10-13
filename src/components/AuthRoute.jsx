// src/components/AuthRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "@/utils/auth";

const AuthRoute = ({ children }) => {
  const [token, setTokenState] = useState(getToken());

  // Listen for localStorage changes (other tabs)
  useEffect(() => {
    const handleStorage = () => setTokenState(getToken());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // If token exists, redirect to dashboard
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AuthRoute;
