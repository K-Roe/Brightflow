import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
export default function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call your Laravel API route
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate('/login');
    } else {
      alert('Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-8">Join BrightFlow and start managing RFCs</p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="p-2 border rounded" 
                   onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            <input type="text" placeholder="Last Name" className="p-2 border rounded" 
                   onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
          </div>
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
                 onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
                 onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}