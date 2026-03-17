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
import Permissions from "./pages/Permissions";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("permissions");
    if (token) {
      setIsLoggedIn(true);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedPermissions) {
        setUserPermissions(JSON.parse(storedPermissions));
      }

      fetchData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const requests = [];

      const results = await Promise.all(requests);

      console.log(results);
    } catch (err) {
      console.error("Data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    setIsLoggedIn(false);
    setUser(null);
    setUserPermissions([]);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          Loading BrightFlow...
        </div>
    );
  }

  return (
      <BrowserRouter>
        <Routes>
          <Route
              path="/login"
              element={
                <Login
                    onLogin={(loggedInUser) => {
                      setIsLoggedIn(true);
                      setUser(loggedInUser || null);
                      setUserPermissions(loggedInUser?.permissions || []);
                    }}
                />
              }
          />

          <Route path="/register" element={<Register />} />

          <Route
              path="*"
              element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />}
          />

          {isLoggedIn && (
              <Route
                  element={
                    <Layout
                        onLogout={handleLogout}
                        user={user}
                        userPermissions={userPermissions}
                    />
                  }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateRFC />} />
                <Route path="/users" element={<Users users={users} />} />
                <Route path="/users/new" element={<CreateUser />} />
                <Route path="/buildForm" element={<FormArchitect />} />
                <Route path="/permissions" element={<Permissions />} />
              </Route>
          )}
        </Routes>
      </BrowserRouter>
  );
}

export default App;