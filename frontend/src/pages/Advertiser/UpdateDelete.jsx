import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../../services/api';

export default function UpdateDelete() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({}); // Track status changes

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getMyCampaigns();
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      alert('Error loading your campaigns');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Backend के हिसाब से updateCampaignStatus
  const handleStatusUpdate = async (campaignId, newStatus) => {
    try {
      const response = await campaignAPI.updateCampaignStatus(campaignId, newStatus);
      
      if (response.data.success) {
        // Update local state
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        ));
        alert('✅ Status updated successfully!');
      }
    } catch (error) {
      const msg = error.response?.data?.msg || error.message;
      alert(`❌ Error: ${msg}`);
      console.error('Status update error:', error);
    }
  };

  // ✅ Backend के हिसाब से deleteCampaign
  const handleDelete = async (campaignId) => {
    if (!window.confirm('Are you sure? This cannot be undone!')) return;

    try {
      const response = await campaignAPI.deleteCampaign(campaignId);
      
      if (response.data.success) {
        // Remove from local state
        setCampaigns(prev => prev.filter(c => c._id !== campaignId));
        alert('✅ Campaign deleted successfully!');
      }
    } catch (error) {
      const msg = error.response?.data?.msg || error.message;
      alert(`❌ Error: ${msg}`);
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your campaigns...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📋 My Campaigns</h1>
        <Link
          to="/advertiser/create-campaign"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg"
        >
          + Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-2xl text-center border-4 border-dashed border-blue-200">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No campaigns yet</h2>
          <p className="text-gray-600 mb-6">Create your first campaign to get started!</p>
          <Link
            to="/advertiser/create-campaign"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            🚀 Create First Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {campaign.description?.substring(0, 120)}...
                  </p>
                </div>
                
                {/* Status Badge */}
                <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                    : campaign.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200' 
                    : 'bg-gray-100 text-gray-800 border-2 border-gray-200'
                }`}>
                  {campaign.status?.toUpperCase()}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">💰 Per Task</p>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    ₹{campaign.payoutPerTask?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">💼 Total Budget</p>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    ₹{campaign.totalBudget?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">📊 Max Tasks</p>
                  <p className="text-xl font-bold text-purple-600 mt-1">
                    {campaign.maxTasks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">🏷️ Category</p>
                  <p className="text-lg font-bold capitalize text-indigo-600 mt-1">
                    {campaign.category}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                
                {/* Status Update Dropdown */}
                <select
                  value={statusUpdates[campaign._id] || campaign.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleStatusUpdate(campaign._id, newStatus);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 font-semibold text-gray-800 hover:shadow-md"
                >
                  <option value="active">🟢 Active</option>
                  <option value="paused">🟡 Paused</option>
                  <option value="completed">🔴 Completed</option>
                </select>

                {/* View Button */}
                <Link
                  to={`/campaign/${campaign._id}`}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-center hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  👁️ View Details
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
