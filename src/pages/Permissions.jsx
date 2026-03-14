import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";

const DEPARTMENTS = ["RFC", "Development", "Sales", "Human Resources", "Finance", "Accounts"];
const PERMISSIONS_LIST = [
  { id: "view_reports", label: "View Reports" },
  { id: "edit_users", label: "Edit Users" },
  { id: "delete_records", label: "Delete Records" },
  { id: "manage_billing", label: "Manage Billing" },
];

export default function Permissions() {
  const [selectedDept, setSelectedDept] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loadingDepartments, setLoadingDepartments]  = useState(true);
  const [departmentError, setDepartmentError]  = useState('');
  const [departments, setDepartments] = useState([]);

  // This effect runs every time the department changes
  useEffect(() => {
    if (selectedDept) {
      // Logic: Fetch existing permissions from DB for this dept.
      // For now, we'll just reset them or load a mock "Saved State"
      console.log(`Loading permissions for: ${selectedDept}`);
      
      // Simulate a DB fetch: 
      // In a real app, you'd do: fetchPermissions(selectedDept).then(data => setPermissions(data))
      setPermissions({}); 
    }
  }, [selectedDept]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        setDepartmentError("");

        const response = await fetch("/api/getAllDepartments");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load departments");
        }

        setDepartments(Array.isArray(data.departments) ? data.departments : []);
      } catch (error) {
        console.error(error);
        setDepartmentError(error.message || "Something went wrong while loading departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleToggle = (permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="BrightFlow Permissions" subtitle="Department Access Control" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <label className="block text-sm font-bold text-gray-700">Select Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="mt-2 block w-full border-2 border-blue-500 rounded-lg p-3 bg-white font-medium focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="">-- Choose Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.department}</option>
            ))}
          </select>
        </div>

        {selectedDept && (
          <div key={selectedDept} className="bg-white rounded-xl shadow-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              Permissions for <span className="text-blue-600">{selectedDept}</span>
            </h3>
            
            <div className="space-y-4">
              {PERMISSIONS_LIST.map((perm) => (
                <div key={perm.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-700 font-medium">{perm.label}</span>
                  
                  <button
                    onClick={() => handleToggle(perm.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      permissions[perm.id] ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        permissions[perm.id] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <button 
              className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-[0.98]"
              onClick={() => {
                alert(`Saved settings for ${selectedDept}`);
                console.log("Saving to DB:", { department: selectedDept, roles: permissions });
              }}
            >
              Save {selectedDept} Permissions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}