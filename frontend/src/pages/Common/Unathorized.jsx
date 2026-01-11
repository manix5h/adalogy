import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-danger mb-4">403</h1>
      <p className="text-2xl text-gray-600 mb-6">Access Denied</p>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <Link to="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
        Go Home
      </Link>
    </div>
  );
}
