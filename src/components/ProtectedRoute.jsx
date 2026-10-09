import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if a token exists in localStorage
  const token = localStorage.getItem("token");

  // If there's no token, redirect them instantly to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, show them the page normally
  return children;
}
