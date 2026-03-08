import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import PageHeader from "../components/PageHeader";

export default function CreateUser({ onSubmit }) {
  const navigate = useNavigate();
  
  // Local state to track what the user is typing
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    department: "Development", // Default value
  });

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop page refresh
    
    // Basic validation check
    if (!formData.name || !formData.username) {
      alert("Please fill in the Name and Username");
      return;
    }

    onSubmit(formData); // Send data to App.jsx
    navigate("/users"); // Redirect back to list
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="BrightFlow Create User" subtitle="Register a new team member" />

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New User Details</h2>
            <button
              onClick={() => navigate("/users")}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name" // Matches the key in formData
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. John Smith"
                required
              />
            </div>

            {/* User Name */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <label className="block text-sm font-semibold text-blue-800">User Name / ID</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="flex-1 border border-blue-300 rounded-lg p-2 placeholder:text-blue-300"
                  placeholder="JS1"
                  required
                />
                <button
                  type="button"
                  onClick={() => alert(`Checking if ${formData.username} is available...`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.smith@company.com"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Department</label>
              <select 
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white"
              >
                <option value="Development">Development</option>
                <option value="RFC">RFC</option>
                <option value="Accounting">Accounting</option>
                <option value="Breakdown">Breakdown</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}