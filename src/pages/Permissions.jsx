import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";

export default function Permissions() {
  const [selectedDept, setSelectedDept] = useState("");
  const [permissions, setPermissions] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [departmentError, setDepartmentError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState("");

  useEffect(() => {
    if (selectedDept) {
      getPermissionForDepartment(selectedDept);
    } else {
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

    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        setPermissionsError("");

        const response = await fetch("/api/permissions");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load permissions");
        }

        setAllPermissions(Array.isArray(data.permissions) ? data.permissions : []);
      } catch (error) {
        console.error(error);
        setPermissionsError(error.message || "Something went wrong while loading permissions");
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchDepartments();
    fetchPermissions();
  }, []);

  const getPermissionForDepartment = async (departmentId) => {
    if (!departmentId) return;

    setPermissions({});

    try {
      setLoadingPermissions(true);
      setPermissionsError("");

      const response = await fetch(`/api/permissions/${departmentId}/permissions`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load department permissions");
      }

      const mappedPermissions = {};

      (data.permissions || []).forEach((perm) => {
        const key = typeof perm === "string" ? perm : perm.name;
        mappedPermissions[key] = true;
      });

      setPermissions(mappedPermissions);
    } catch (error) {
      console.error(error);
      setPermissionsError(
          error.message || "Something went wrong while loading department permissions"
      );
    } finally {
      setLoadingPermissions(false);
    }
  };

  const savePermissionsForDepartment = async () => {
    if (!selectedDept) return;

    const enabledPermissions = Object.entries(permissions)
        .filter(([, enabled]) => enabled)
        .map(([permissionName]) => permissionName);

    try {
      setLoadingPermissions(true);
      setPermissionsError("");

      const response = await fetch(`/api/permissions/departments/${selectedDept}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: enabledPermissions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save permissions");
      }

      alert(`Saved settings for ${selectedDepartmentName}`);
    } catch (error) {
      console.error(error);
      setPermissionsError(
          error.message || "Something went wrong while saving permissions"
      );
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleToggle = (permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const selectedDepartmentName =
      departments.find((dept) => String(dept.id) === String(selectedDept))?.name || selectedDept;

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
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
              ))}
            </select>

            {departmentError && (
                <p className="mt-2 text-sm text-red-600">{departmentError}</p>
            )}
          </div>

          {selectedDept && (
              <div
                  key={selectedDept}
                  className="bg-white rounded-xl shadow-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                  Permissions for <span className="text-blue-600">{selectedDepartmentName}</span>
                </h3>

                {permissionsError && (
                    <p className="mb-4 text-sm text-red-600">{permissionsError}</p>
                )}

                <div className="space-y-4">
                  {allPermissions.map((perm) => (
                      <div
                          key={perm.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                  <span className="text-gray-700 font-medium">
                    {perm.label}
                  </span>

                        <button
                            type="button"
                            onClick={() => handleToggle(perm.name)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                permissions[perm.name] ? "bg-green-500" : "bg-gray-300"
                            }`}
                        >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            permissions[perm.name] ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                        </button>
                      </div>
                  ))}
                </div>

                <button
                    className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50"
                    onClick={savePermissionsForDepartment}
                    disabled={loadingPermissions}
                >
                  {loadingPermissions ? "Saving..." : `Save ${selectedDepartmentName} Permissions`}
                </button>
              </div>
          )}
        </div>
      </div>
  );
}