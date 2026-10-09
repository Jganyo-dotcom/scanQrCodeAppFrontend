import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard.jsx";
import HomePage from "./pages/Home.jsx";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import CreateQR from "./pages/CreateQR.jsx";
import MyQRs from "./pages/MyQRs.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // 👈 1. Import the guard
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-slate-800 dark:text-white font-medium",
          style: { borderRadius: "8px" },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateQR />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />

        {/* Authenticated Dashboard Routes (Wrapped for protection) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <MyQRs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* 🚀 Removed the duplicate /history route that was causing the blank screen */}
      </Routes>
    </BrowserRouter>
  );
}
