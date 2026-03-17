import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";

const StatusBadge = ({ status }) => {
  const styles = {
    "In Review": "bg-blue-100 text-blue-800 border-blue-200",
    Draft: "bg-gray-100 text-gray-800 border-gray-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    submitted: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
      <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              styles[status] || styles["Draft"]
          }`}
      >
      {status}
    </span>
  );
};

const formatLabel = (value) =>
    value?.replace(/_/g, " ")?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";

const RFCModal = ({ rfc, onClose }) => {
  if (!rfc) return null;

  const fieldEntries = Array.isArray(rfc.field_values)
      ? rfc.field_values
      : Object.entries(rfc.field_values || {}).map(([field_name, field_value]) => ({
        field_name,
        field_value,
      }));

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
          <div className="flex items-start justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{rfc.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                RFC #{rfc.id} • {rfc.application}
              </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                  Status
                </p>
                <div className="mt-2">
                  <StatusBadge status={rfc.status} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                  Created By
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {rfc.created_by?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500">{rfc.created_by?.email || ""}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                  Created At
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {rfc.created_at || "Unknown"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Field Values</h3>
              <div className="space-y-3">
                {fieldEntries.length === 0 ? (
                    <p className="text-sm text-gray-500">No field values found.</p>
                ) : (
                    fieldEntries.map((field, index) => (
                        <div
                            key={`${field.field_name}-${index}`}
                            className="border rounded-xl p-4 bg-gray-50"
                        >
                          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {formatLabel(field.field_name)}
                          </p>
                          <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap break-words">
                            {field.field_value || "—"}
                          </p>
                        </div>
                    ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Attachments</h3>
              <div className="space-y-3">
                {(rfc.attachments || []).length === 0 ? (
                    <p className="text-sm text-gray-500">No attachments uploaded.</p>
                ) : (
                    rfc.attachments.map((attachment) => (
                        <a
                            key={attachment.id}
                            href={attachment.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="block border rounded-xl p-4 bg-gray-50 hover:bg-blue-50 transition"
                        >
                          <p className="text-sm font-semibold text-blue-700">
                            {attachment.original_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {attachment.mime_type || "Unknown type"}
                            {attachment.file_size ? ` • ${attachment.file_size} bytes` : ""}
                          </p>
                        </a>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default function Dashboard() {
  const [rfcs, setRfcs] = useState([]);
  const [selectedRfc, setSelectedRfc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRfcs = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch("/api/rfcs", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load RFCs");
        }

        setRfcs(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch RFCs", err);
        setError(err.message || "Something went wrong while loading RFCs");
      } finally {
        setLoading(false);
      }
    };

    fetchRfcs();
  }, []);

  const totalRequests = rfcs.length;
  const activeJira = rfcs.filter((r) => r.jiraTicket || r.jira).length;
  const awaitingApproval = rfcs.filter(
      (r) => r.status === "Pending" || r.status === "In Review" || r.status === "submitted"
  ).length;

  const rows = useMemo(() => rfcs || [], [rfcs]);

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
          <PageHeader
              title="BrightFlow Dashboard"
              subtitle="Real-time RFC tracking & metrics"
              buttonText="+ New RFC"
              buttonPath="/create"
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
            Loading RFCs...
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
          <PageHeader
              title="BrightFlow Dashboard"
              subtitle="Real-time RFC tracking & metrics"
              buttonText="+ New RFC"
              buttonPath="/create"
          />

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
            {error}
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PageHeader
            title="BrightFlow Dashboard"
            subtitle="Real-time RFC tracking & metrics"
            buttonText="+ New RFC"
            buttonPath="/create"
        />

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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Jira Ticket
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Created By
              </th>
            </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((rfc) => (
                <tr
                    key={rfc.id}
                    onClick={() => setSelectedRfc(rfc)}
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

                  <td className="px-6 py-4 text-sm text-gray-700">{rfc.application}</td>

                  <td className="px-6 py-4">
                    <StatusBadge status={rfc.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      {rfc.jiraTicket || "Not Linked"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {rfc.created_by?.name || "Unknown"}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          {rows.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500 italic">
                  No RFCs created yet. Start by clicking "+ New RFC".
                </p>
              </div>
          )}
        </div>

        <RFCModal rfc={selectedRfc} onClose={() => setSelectedRfc(null)} />
      </div>
  );
}