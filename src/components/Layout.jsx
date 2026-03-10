import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ onLogout }) {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Create RFC', path: '/create' },
    { name: 'Jira Sync', path: '/sync' },
    { name: 'Users', path: '/users' },
    { name: 'Build Form', path: '/buildForm'}
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-blue-100">BrightFlow</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition ${
                location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-blue-300 hover:bg-blue-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-blue-300 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Outlet /> 
      </main>
    </div>
  );
}