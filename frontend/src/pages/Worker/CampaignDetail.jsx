import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI,taskAPI } from '../../services/api';
import { motion } from 'framer-motion';
export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
const [joining, setJoining] = useState(false);
const [hasJoined, setHasJoined] = useState(false);
 

  useEffect(() => {
    fetchCampaign();
    
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await campaignAPI.getCampaignById(id);
      setCampaign(response.data.campaign);
      setTasksCompleted(response.data.tasksCompleted || 0);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      alert('Error loading campaign');
    } finally {
      setLoading(false);
    }
  };



  const handleJoin = async () => {
  setJoining(true);
  try {
    await taskAPI.joinTask({ campaignId: id }); 
    setHasJoined(true);
    alert('✅ Joined successfully! Check My Tasks');
  } catch (error) {
    console.error('Error joining campaign:', error);
  } finally {
    setJoining(false);
  }
};

  if (loading) return <div className="text-center py-10 text-lg">Loading campaign...</div>;
  if (!campaign) return <div className="text-center py-10 text-lg">Campaign not found</div>;

  const progressPercent = (tasksCompleted / campaign.maxTasks) * 100;
  const remainingTasks = campaign.maxTasks - tasksCompleted;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline flex items-center"
      >
        ← Back
      </button>

      <div className="bg-white rounded shadow p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{campaign.title}</h1>
          <span className={`px-3 py-1 rounded text-sm font-bold ${
            campaign.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : campaign.status === 'paused'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {campaign.status.toUpperCase()}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded">
          <div>
            <p className="text-sm text-gray-600">💰 Budget Per Task</p>
            <p className="text-2xl font-bold text-green-600">₹{campaign.payoutPerTask}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">📊 Total Budget</p>
            <p className="text-2xl font-bold text-blue-600">₹{campaign.totalBudget}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">✅ Tasks Available</p>
            <p className="text-2xl font-bold">{remainingTasks} / {campaign.maxTasks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">📁 Category</p>
            <p className="text-xl font-bold capitalize">{campaign.category}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <p className="font-bold">Campaign Progress</p>
            <p className="text-sm text-gray-600">{Math.round(progressPercent)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {tasksCompleted} completed out of {campaign.maxTasks} tasks
          </p>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📝 Description</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{campaign.description}</p>
          
          {campaign.requirements && (
            <div className="p-4 bg-blue-50 rounded border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">📋 Requirements</h3>
              <p className="text-gray-700">{campaign.requirements}</p>
            </div>
          )}
        </div>

        {/* Creator Information */}
        {campaign.createdBy && (
          <div className="mb-8 p-6 bg-gray-50 rounded">
            <h3 className="text-lg font-bold mb-4">👤 Campaign Creator</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{campaign.createdBy.name}</p>
                <p className="text-sm text-gray-600">{campaign.createdBy.email}</p>
              </div>
              {campaign.createdBy.rating && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-500">⭐</p>
                  <p className="font-bold">{campaign.createdBy.rating}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deadline */}
        {campaign.deadline && (
          <div className="mb-8 p-4 bg-red-50 rounded">
            <p className="text-sm text-gray-600">⏰ Deadline</p>
            <p className="font-bold text-lg">
              {new Date(campaign.deadline).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        {/* Action Button
        {campaign.status === 'active' && remainingTasks > 0 ? (
          <button
            onClick={handleApplyForCampaign}
            disabled={applying}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded font-bold text-lg hover:shadow-lg disabled:opacity-50 transition"
          >
            {applying ? '⏳ Applying...' : '✅ Apply for this Campaign'}
          </button>
        ) : campaign.status !== 'active' ? (
          <div className="w-full bg-gray-400 text-white py-3 rounded font-bold text-lg text-center">
            ❌ Campaign is {campaign.status}
          </div>
        ) : (
          <div className="w-full bg-gray-400 text-white py-3 rounded font-bold text-lg text-center">
            ✅ All tasks completed
          </div>
        )} */}

       
      </div>

      { campaign.status === 'active' && !hasJoined && (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleJoin}
    disabled={joining || campaign.joinedTasks >= campaign.maxTasks}
    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-6 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl"
  >
    {joining ? (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
        Joining...
      </div>
    ) : (
      <>
        🚀 Join Now (₹{campaign.payoutPerTask})
      </>
    )}
  </motion.button>
)}

    </div>
  );
}
