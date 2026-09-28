// src/App.jsx
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
// import CreateQR from "./pages/dashboard/CreateQR";
// import History from "./pages/dashboard/History";
import "./index.css"; // <-- Critical for Tailwind to render

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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />

        {/* Authenticated Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateQR />} />
        <Route path="/history" element={<MyQRs />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />

        <Route
          path="/history"
          element={<DashboardLayout>{/* <History /> */}</DashboardLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
}
