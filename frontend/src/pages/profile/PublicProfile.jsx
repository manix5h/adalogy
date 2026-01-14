import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../../services/api';

export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  // ✅ getPublicProfile - Backend call
  const fetchPublicProfile = async () => {
    try {
      const response = await userAPI.getPublicProfile(userId);
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-xl">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👤
          </div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-lg text-gray-600 capitalize mt-2">{profile.role}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
          
          <div className="text-center">
            <p className="text-sm text-gray-600">⭐ Rating</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {profile.rating?.toFixed(2) || 'N/A'}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">✅ Tasks Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {profile.tasksCompleted || 0}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">🎯 Campaigns</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {profile.campaignsCreated || 0}
            </p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <h2 className="font-bold text-lg mb-2">About</h2>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Other Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Name</p>
            <p className="text-xl font-bold mt-1">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Role</p>
            <p className="text-xl font-bold capitalize mt-1">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
