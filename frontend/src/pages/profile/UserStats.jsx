import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

export default function UserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ getUserStats - Backend call
  const fetchStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="text-center py-20">No stats available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">📈 Your Statistics</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Balance */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">💰 Current Balance</p>
          <p className="text-4xl font-bold mt-2">₹{stats.balance?.toLocaleString()}</p>
        </div>

        {/* Total Earned */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">📈 Total Earned</p>
          <p className="text-4xl font-bold mt-2">₹{stats.totalEarned?.toLocaleString()}</p>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">💸 Total Spent</p>
          <p className="text-4xl font-bold mt-2">₹{stats.totalSpent?.toLocaleString()}</p>
        </div>

        {/* Rating */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">⭐ Rating</p>
          <p className="text-4xl font-bold mt-2">{stats.rating?.toFixed(2)}</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">✅ Tasks Completed</p>
          <p className="text-4xl font-bold mt-2">{stats.tasksCompleted}</p>
        </div>

        {/* Campaigns Created */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">🎯 Campaigns Created</p>
          <p className="text-4xl font-bold mt-2">{stats.campaignsCreated}</p>
        </div>

        {/* Role */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
          <p className="text-sm font-semibold opacity-90">👤 Role</p>
          <p className="text-2xl font-bold mt-2 capitalize">{stats.role}</p>
        </div>

        {/* Email */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-2xl shadow-xl col-span-1 md:col-span-2">
          <p className="text-sm font-semibold opacity-90">📧 Email</p>
          <p className="text-xl font-bold mt-2 break-all">{stats.email}</p>
        </div>
      </div>
    </div>
  );
}
