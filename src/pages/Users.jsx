import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function Users() {
  const navigate = useNavigate();
  const mockUsers = [
    {
      id: "01",
      name: "Karl Aboltins-Roe",
      email: "KarlAboltins-roe@test.com",
      username: "KR1",
      department: "Development",
    },
    {
      id: "02",
      name: "Alex Blake",
      email: "AlexBlake@test.com",
      username: "AK2",
      department: "Accounting",
    },
    {
      id: "03",
      name: "Andy Unwin",
      email: "AndyUnwin@text.com",
      username: "AU3",
      department: "RFC",
    },
  ];

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
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                UserName
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Department
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user) => (
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
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    {user.username}
                  </div>
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
      </div>
    </div>
  );
}
