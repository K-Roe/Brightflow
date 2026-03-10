import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateRFC from "./pages/CreateRFC";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import FormArchitect from "./pages/FormArchitect";
import Permissons from "./pages/Permissions";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // 1. Added loading state
  const [users, setUsers] = useState([]);
  const [rfcs, setRfcs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchData(token);
    } else {
      setLoading(false); // 2. No token, finish loading immediately
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const [userRes, rfcRes] = await Promise.all([
        fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` }}),
        fetch('/api/rfcs', { headers: { 'Authorization': `Bearer ${token}` }})
      ]);
      
      if (userRes.ok) setUsers(await userRes.json());
      if (rfcRes.ok) setRfcs(await rfcRes.json());
    } catch (err) {
      console.error("Data fetch failed", err);
    } finally {
      setLoading(false); // 3. Finished checking
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // 4. Show a loading screen while checking auth
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading BrightFlow...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirect logic now waits for loading to finish */}
        <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} />

        {isLoggedIn && (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/" element={<Dashboard rfcs={rfcs} />} />
            <Route path="/create" element={<CreateRFC />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/new" element={<CreateUser />} />
            <Route path="/buildForm" element={<FormArchitect />} />
            <Route path="/Permissons" element={<Permissons />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;