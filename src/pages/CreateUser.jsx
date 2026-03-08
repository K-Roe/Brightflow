import React, { useState } from "react";
import PageHeader from "../components/PageHeader";

export default function CreateUser({ onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    Name: "",
    UserName: "",
    Email: "",
    Department: "",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="BrightFlow Create User" subtitle="Create New users" />

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New User
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Name of User"
              />
            </div>

            {/* User Name */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <label className="block text-sm font-semibold text-blue-800">
                User Name
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="flex-1 border border-blue-300 rounded-lg p-2 placeholder:text-blue-300"
                  placeholder="KR1"
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                >
                  Verify User Name
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2 italic">
                ※ When the backend is ready, this will pull data directly
                backend to check user name is free.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email of User"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Department
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white">
                <option>Development</option>
                <option>RFC</option>
                <option>Accounting</option>
                <option>Breakdown</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                onClick={() => onSubmit()}
              >
                Submit New User
              </button>
              <button
                type="button"
                onClick={onCancel}
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
