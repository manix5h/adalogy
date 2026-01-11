import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function WorkerDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Worker Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">Total Earned</p>
          <p className="text-3xl font-bold text-primary">₹{user?.totalEarned || 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">Current Balance</p>
          <p className="text-3xl font-bold text-success">₹{user?.balance || 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">Tasks Completed</p>
          <p className="text-3xl font-bold">{user?.totalTasksCompleted || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/worker/campaigns"
          className="bg-primary text-white p-6 rounded text-center hover:bg-blue-700"
        >
          <h3 className="text-xl font-bold">Find Campaigns</h3>
          <p>Browse available campaigns</p>
        </Link>

        <Link
          to="/worker/tasks"
          className="bg-secondary text-white p-6 rounded text-center hover:bg-gray-700"
        >
          <h3 className="text-xl font-bold">My Tasks</h3>
          <p>View your assigned tasks</p>
        </Link>

        <Link
          to="/worker/earnings"
          className="bg-success text-white p-6 rounded text-center hover:bg-green-700"
        >
          <h3 className="text-xl font-bold">Earnings</h3>
          <p>Track your earnings</p>
        </Link>

        <Link
          to="/worker/withdrawals"
          className="bg-warning text-white p-6 rounded text-center hover:bg-yellow-700"
        >
          <h3 className="text-xl font-bold">Withdrawals</h3>
          <p>Manage your withdrawals</p>
        </Link>
      </div>
    </div>
  );
}