import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../../services/api';

export default function PublicCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getPublicCampaigns();
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      alert('Error loading campaigns');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading campaigns...</div>;

  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">📢 Available Campaigns</h1>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All ({campaigns.length})
        </button>
        <button
          onClick={() => setFilter('social-media')}
          className={`px-4 py-2 rounded ${filter === 'social-media' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Social Media
        </button>
        <button
          onClick={() => setFilter('content-creation')}
          className={`px-4 py-2 rounded ${filter === 'content-creation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Content Creation
        </button>
        <button
          onClick={() => setFilter('testing')}
          className={`px-4 py-2 rounded ${filter === 'testing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Testing
        </button>
        <button
          onClick={() => setFilter('data-entry')}
          className={`px-4 py-2 rounded ${filter === 'data-entry' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Data Entry
        </button>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded text-center">
          <p className="text-gray-600">No campaigns available in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <div key={campaign._id} className="bg-white rounded shadow hover:shadow-lg transition p-6">
              <h3 className="text-lg font-bold mb-2">{campaign.title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payout Per Task</span>
                  <span className="font-bold text-green-600">₹{campaign.payoutPerTask}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Available Tasks</span>
                  <span className="font-bold">{campaign.maxTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {campaign.category}
                  </span>
                </div>
              </div>

              {/* Creator Info */}
              {campaign.createdBy && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>By:</strong> {campaign.createdBy.name}
                  </p>
                  {campaign.createdBy.rating && (
                    <p className="text-sm text-yellow-600">
                      <strong>Rating:</strong> ⭐ {campaign.createdBy.rating}
                    </p>
                  )}
                </div>
              )}

              <Link
                to={`/campaign/${campaign._id}`}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 text-center block"
              >
                View Details & Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
