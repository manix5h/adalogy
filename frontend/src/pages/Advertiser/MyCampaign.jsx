import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../../services/api';


export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
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
      alert('Error loading campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await campaignAPI.deleteCampaign(id);
      alert('✅ Campaign deleted successfully');
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.msg || error.message));
    }
  };
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

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-red-700">📋 My Campaigns</h1>
        <Link
          to="/advertiser/create-campaign"
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          + Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded text-center">
          <p className="text-gray-600 mb-4 bg-red-700 text-lg">No campaigns created yet</p>
          <Link
            to="/advertiser/create-campaign"
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
          >
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="bg-white rounded shadow hover:shadow-lg transition p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 mb-3">{campaign.description.substring(0, 100)}...</p>
                </div>
                <span className={`px-4 py-2 rounded text-sm font-bold whitespace-nowrap ml-4 ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {campaign.status.toUpperCase()}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Per Task</p>
                  <p className="font-bold text-green-600">₹{campaign.payoutPerTask}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="font-bold">₹{campaign.totalBudget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tasks</p>
                  <p className="font-bold">{campaign.maxTasks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="font-bold">{campaign.tasksCompleted || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-bold capitalize">{campaign.category}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t flex-wrap">
                <Link
                  to={`/advertiser/campaign/${campaign._id}`}
                  className="flex-1 min-w-32 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center font-bold"
                >
                  👁️ View
                </Link>

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

                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
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


