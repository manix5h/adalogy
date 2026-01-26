import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI } from '../../services/api';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await campaignAPI.getCampaignById(id);
      setCampaign(response.data.campaign);
      setTasksCompleted(response.data.tasksCompleted);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!campaign) return <div className="text-center py-10">Campaign not found</div>;

  const progressPercent = (tasksCompleted / campaign.maxTasks) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-2xl font-bold text-blue-600">₹{campaign.totalBudget}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Per Task</p>
            <p className="text-2xl font-bold">₹{campaign.payoutPerTask}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tasks Completed</p>
            <p className="text-2xl font-bold">{tasksCompleted}/{campaign.maxTasks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-3 py-1 rounded text-xs font-bold ${
              campaign.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {campaign.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <p className="mb-2 font-bold">Progress: {Math.round(progressPercent)}%</p>
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-green-500 h-4 rounded transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="font-bold mb-2">Description</h2>
          <p className="text-gray-700">{campaign.description}</p>
        </div>

        {/* Requirements */}
        {campaign.requirements && (
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h2 className="font-bold mb-2">Requirements</h2>
            <p className="text-gray-700">{campaign.requirements}</p>
          </div>
        )}

        {/* Creator Info */}
        {campaign.createdBy && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h2 className="font-bold mb-2">Created By</h2>
            <p className="text-gray-700">{campaign.createdBy.name}</p>
          </div>
        )}

        {/* Deadline */}
        {campaign.deadline && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="font-bold">
              {new Date(campaign.deadline).toLocaleDateString('en-IN')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
