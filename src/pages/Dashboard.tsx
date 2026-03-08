import React from 'react';
import { useNavigate } from 'react-router-dom';


// A small helper component for the Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    'In Review': 'bg-blue-100 text-blue-800 border-blue-200',
    'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['Draft']}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
    const mockRFCs = [
    { id: 'RFC-101', title: 'Update Auth Logic', status: 'In Review', jira: 'PROJ-12' },
    { id: 'RFC-102', title: 'AWS Migration Phase 1', status: 'Draft', jira: 'CLOUD-44' },
    { id: 'RFC-103', title: 'API Rate Limiting', status: 'Approved', jira: 'PROJ-88' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">BrightFlow Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, RFC Department</p>
        </div>
        
        {/* Updated Button with onClick */}
        <button 
          onClick={() => navigate('/create')} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-all active:scale-95"
        >
          + New RFC
        </button>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-400">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Pending Requests</p>
          <p className="text-3xl font-black text-gray-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-400">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Active Jira Links</p>
          <p className="text-3xl font-black text-gray-800">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Awaiting Approval</p>
          <p className="text-3xl font-black text-gray-800">4</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jira Ticket</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRFCs.map((rfc) => (
              <tr key={rfc.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">
                  {rfc.id}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    {rfc.title}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={rfc.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    {rfc.jira}
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