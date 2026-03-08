import React from "react";
import PageHeader from "../components/PageHeader";

// Keep the StatusBadge helper - it's great!
const StatusBadge = ({ status }) => {
  const styles = {
    "In Review": "bg-blue-100 text-blue-800 border-blue-200",
    Draft: "bg-gray-100 text-gray-800 border-gray-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles["Draft"]}`}
    >
      {status}
    </span>
  );
};

export default function Dashboard({ rfcs }) { // Accept 'rfcs' prop from App.jsx
  
  // Dynamic Metrics Calculation
  const totalRequests = rfcs.length;
  const activeJira = rfcs.filter(r => r.jiraTicket || r.jira).length;
  const awaitingApproval = rfcs.filter(r => r.status === "Pending" || r.status === "In Review").length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader
        title="BrightFlow Dashboard"
        subtitle="Real-time RFC tracking & metrics"
        buttonText="+ New RFC"
        buttonPath="/create"
      />

      {/* Dynamic Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-400">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
            Total Requests
          </p>
          <p className="text-3xl font-black text-gray-800">{totalRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-400">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
            Active Jira Links
          </p>
          <p className="text-3xl font-black text-gray-800">{activeJira}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
            Awaiting Approval
          </p>
          <p className="text-3xl font-black text-gray-800">{awaitingApproval}</p>
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
            {rfcs.map((rfc) => (
              <tr
                key={rfc.id}
                className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
              >
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
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    {rfc.jiraTicket || rfc.jira || "Not Linked"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {rfcs.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 italic">No RFCs created yet. Start by clicking "+ New RFC".</p>
          </div>
        )}
      </div>
    </div>
  );
}