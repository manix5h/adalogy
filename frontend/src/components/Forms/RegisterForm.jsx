import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'worker',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await register(formData.name, formData.email, formData.password, formData.role);
      // Registration successful के बाद
if (response.data.success) {
  
      if (response.data.success) {
      // ✅ METHOD 1: window.location (99.9% success rate)
      window.location.href = '/verify-email';
      return; // Exit immediately
    }
}
    
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <div className="bg-danger text-white p-2 mb-4 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="worker">Worker</option>
          <option value="advertiser">Advertiser</option>
        </select>
      </div>

      <button
       onClick={() => {
      console.log('🔍 Manual redirect test');
      window.location.href = '/verify-email';
    }}
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
