import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdvertiserDashboard() {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Advertiser Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-danger">₹{user?.totalSpent || 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">Campaigns Created</p>
          <p className="text-3xl font-bold">{user?.totalCampaignsCreated || 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">Rating</p>
          <p className="text-3xl font-bold text-warning">⭐ {user?.rating || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/advertiser/create-campaign"
          className="bg-primary text-white p-6 rounded text-center hover:bg-blue-700"
        >
          <h3 className="text-xl font-bold">Create Campaign</h3>
          <p>Start a new campaign</p>
        </Link>

        <Link
          to="/advertiser/campaigns"
          className="bg-secondary text-white p-6 rounded text-center hover:bg-gray-700"
        >
          <h3 className="text-xl font-bold">My Campaigns</h3>
          <p>Manage your campaigns</p>
        </Link>

        <Link
          to="/advertiser/earnings"
          className="bg-success text-white p-6 rounded text-center hover:bg-green-700"
        >
          <h3 className="text-xl font-bold">Transactions</h3>
          <p>View transactions</p>
        </Link>

        <Link
          to="/advertiser/profile"
          className="bg-warning text-white p-6 rounded text-center hover:bg-yellow-700"
        >
          <h3 className="text-xl font-bold">Profile</h3>
          <p>Edit your profile</p>
        </Link>

         <Link
          to="/advertiser/raise-dispute"
          className="bg-warning text-black p-6 rounded text-center hover:bg-yellow-700"
        >
          <h3 className="text-xl font-bold">Profile</h3>
          <p>Raise Dispute</p>
        </Link>
      </div>
    </div>
  );
}
