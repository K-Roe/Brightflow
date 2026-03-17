import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || 'Login failed. Please check your email and password.');
        return;
      }

      if (!data?.access_token) {
        setError('Login succeeded, but no access token was returned.');
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("permissions", JSON.stringify(data.user.permissions || []));
      onLogin?.(data.user);
      navigate('/');
    } catch (err) {
      setError('Unable to sign in right now. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">BrightFlow</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your workspace</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="you@company.com"
              required
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
              onChange={(e) => updateField('password', e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}