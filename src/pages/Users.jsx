import React from "react";
import PageHeader from "../components/PageHeader";

export default function Users({ users }) { // Component now uses the live 'users' from App.jsx
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader
        title="BrightFlow Users"
        subtitle="Manage team permissions and roles"
        buttonText="+ New User"
        buttonPath="/users/new"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">UserName</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* We map over 'users' (passed via props) instead of 'mockUsers' */}
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">
                  {user.id}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    {user.department}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Helper if no users exist */}
        {users.length === 0 && (
          <div className="p-10 text-center text-gray-500 italic">
            No users found. Click "+ New User" to add one.
          </div>
        )}
      </div>
    </div>
  );
}