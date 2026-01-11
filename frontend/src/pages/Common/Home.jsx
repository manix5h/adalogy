import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (   
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-red-500 mb-4">Welcome to LogoPromo</h1>
        <p className="text-gray-600 text-lg mb-6">
          Connect workers with paid campaigns and grow your business
        </p>
      </div>

      {!user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">For Workers</h2>
            <p className="text-gray-600 mb-4">
              Complete tasks and earn money. Join campaigns that interest you.
            </p>
            <Link
              to="/register?role=worker"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Join as Worker
            </Link>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">For Advertisers</h2>
            <p className="text-gray-600 mb-4">
              Create campaigns and reach thousands of workers.
            </p>
            <Link
              to="/register?role=advertiser"
              className="bg-success text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Join as Advertiser
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-4">
            {user.role === 'worker' && 'Find campaigns and complete tasks'}
            {user.role === 'advertiser' && 'Create campaigns and manage workers'}
            {user.role === 'admin' && 'Manage platform and resolve disputes'}
          </p>
          <Link
            to={user.role === 'worker' ? '/worker/dashboard' : user.role === 'advertiser' ? '/advertiser/dashboard' : '/admin/dashboard'}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
