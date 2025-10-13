// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, isTokenExpired, getUser } from "@/utils/auth";

/**
 * Props:
 *   roles: array of allowed roles (e.g. ["admin", "user"])
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const token = getToken();

  // Not logged in or token expired → redirect to login
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser(); // should return user object from localStorage or context

  // If roles are defined, check if user role is allowed
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />; // unauthorized
  }

  return children;
};

export default ProtectedRoute;
