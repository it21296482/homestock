import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import Household from "./pages/Household";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import CreateHousehold from "./pages/CreateHousehold"; // ✅ Import Create Household
import Inventory from './components/Inventory';
import ShoppingList from './components/ShoppingList';

// 🔹 Get role from JWT or fallback to localStorage user
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.role;
  } catch (err) {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role;
  }
};

// 🔹 Auth check
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// 🔹 Inline placeholder pages
const About = () => (
  <div style={{ padding: "2rem" }}>
    <h2>About Us</h2>
    <p>This page is under construction.</p>
  </div>
);
const Privacy = () => (
  <div style={{ padding: "2rem" }}>
    <h2>Privacy Policy</h2>
    <p>This page is under construction.</p>
  </div>
);
const Terms = () => (
  <div style={{ padding: "2rem" }}>
    <h2>Terms & Conditions</h2>
    <p>This page is under construction.</p>
  </div>
);
const Sitemap = () => (
  <div style={{ padding: "2rem" }}>
    <h2>Sitemap</h2>
    <p>This page is under construction.</p>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const userRole = getUserRole()?.toUpperCase();

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected User Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/household"
          element={isAuthenticated() ? <Household /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-household"
          element={isAuthenticated() ? <CreateHousehold /> : <Navigate to="/login" />}
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route path="/shopping-list" element={<ShoppingList />} />

        {/* ✅ Admin-Only Routes */}
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated() && userRole === "ADMIN" ? (
              <AdminDashboard />
            ) : isAuthenticated() ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated() && userRole === "ADMIN" ? (
              <AdminPanel />
            ) : isAuthenticated() ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Footer/Static Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sitemap" element={<Sitemap />} />

        {/* ✅ Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
