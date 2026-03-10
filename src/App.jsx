import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRFC from './pages/CreateRFC';
import Users from './pages/Users';
import CreateUser from './pages/CreateUser';
import FormArchitect from './pages/FormArchitect';
import Permissons from './pages/Permissions';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- 1. USER STATE (Local Storage) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('bf_users');
    return saved ? JSON.parse(saved) : [
      { id: "01", name: "Karl Aboltins-Roe", email: "Karl@test.com", username: "KR1", department: "Development" },
      { id: "02", name: "Alex Blake", email: "Alex@test.com", username: "AK2", department: "Accounting" }
    ];
  });

  // --- 2. RFC STATE (Local Storage) ---
  const [rfcs, setRfcs] = useState(() => {
    const saved = localStorage.getItem('bf_rfcs');
    return saved ? JSON.parse(saved) : [
      { id: 'RFC-101', title: 'Update Auth Logic', status: 'In Review', jira: 'PROJ-12' },
      { id: 'RFC-102', title: 'AWS Migration Phase 1', status: 'Draft', jira: 'CLOUD-44' }
    ];
  });

  // --- 3. PERSISTENCE (Auto-save to browser) ---
  useEffect(() => {
    localStorage.setItem('bf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bf_rfcs', JSON.stringify(rfcs));
  }, [rfcs]);

  // --- 4. HANDLERS (The "Plumbing") ---
  const handleAddUser = (userData) => {
    const newUser = {
      ...userData,
      id: (users.length + 1).toString().padStart(2, '0')
    };
    setUsers([...users, newUser]);
  };

  const handleAddRFC = (rfcData) => {
    const newRFC = {
      ...rfcData,
      id: `RFC-${rfcs.length + 101}`,
      status: 'Draft' // Default status for new ones
    };
    setRfcs([...rfcs, newRFC]);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        ) : (
          <Route element={<Layout onLogout={() => setIsLoggedIn(false)} />}>
            {/* Dashboard gets the RFCs list */}
            <Route path="/" element={<Dashboard rfcs={rfcs} />} />
            
            {/* CreateRFC gets the add function */}
            <Route path="/create" element={<CreateRFC onSubmit={handleAddRFC} />} />
            
            <Route path="/sync" element={<div className="p-8 text-blue-900 font-bold">Jira Syncing Coming Soon...</div>} />
            
            {/* Users get the users list */}
            <Route path="/users" element={<Users users={users} />} />

            {/* CreateUser gets the add function */}
            <Route path="/users/new" element={<CreateUser onSubmit={handleAddUser} />} />

            <Route path="/buildForm" element={<FormArchitect />} />
            <Route path="/Permissons" element={<Permissons />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;