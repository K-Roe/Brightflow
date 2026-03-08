import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import PageHeader from "../components/PageHeader";

export default function CreateRFC({ onSubmit }) {
  const navigate = useNavigate();

  // 1. Link state to all form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jiraTicket: '',
    priority: 'Medium',
    reviewer: ''
  });

  // 2. Simple handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert("Please provide an RFC Title");
      return;
    }

    // 3. Send data to the handler in App.jsx
    onSubmit(formData); 
    
    // 4. Redirect to Dashboard to see the new entry
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="BrightFlow Create New RFC" subtitle="Draft a technical change request" />
      
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">RFC Details</h2>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* RFC Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">RFC Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g. Upgrade Production Load Balancer"
                required
              />
            </div>

            {/* Jira Integration Section */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <label className="block text-sm font-semibold text-blue-800">Link Jira Ticket</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text" 
                  name="jiraTicket"
                  value={formData.jiraTicket}
                  onChange={handleChange}
                  className="flex-1 border border-blue-300 rounded-lg p-2 placeholder:text-blue-300" 
                  placeholder="PROJ-123"
                />
                <button type="button" onClick={() => alert("Verification logic will go here!")} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
                  Verify
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Proposed Changes</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4" 
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2" 
                placeholder="Describe what is changing and why..."
              ></textarea>
            </div>

            {/* Reviewer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Reviewer</label>
              <select 
                name="reviewer"
                value={formData.reviewer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white"
              >
                <option value="">Select a Lead RFC...</option>
                <option value="Barry Allan">Barry Allan</option>
                <option value="Peter Parker">Peter Parker</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95"
              >
                Submit RFC
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/')}
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