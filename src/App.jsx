import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRFC from './pages/CreateRFC';
import Users from './pages/Users';
import CreateUser from './pages/CreateUser'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        {!isLoggedIn ? (
          <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        ) : (
          /* Protected Routes inside the Layout */
          <Route element={<Layout onLogout={() => setIsLoggedIn(false)} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateRFC />} />
            
            {/* Future pages go here */}
            <Route path="/sync" element={<div className="p-8">Jira Syncing Coming Soon...</div>} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/new" element={<CreateUser />} />
            
            {/* Redirect any 404s to Dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;