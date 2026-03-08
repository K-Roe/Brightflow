import React from 'react';

export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">BrightFlow</h1>
        <p className="text-gray-500 mb-8">Sign in to manage your RFCs</p>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="you@company.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-200">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}