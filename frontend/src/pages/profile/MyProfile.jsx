import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ getProfile - Backend call
  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
      setFormData({
        name: response.data.user.name || '',
        bio: response.data.user.bio || '',
        phone: response.data.user.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  // ✅ updateProfile - Backend call
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await userAPI.updateProfile(formData);
      if (response.data.success) {
        setProfile(response.data.user);
        setEditing(false);
        alert('✅ Profile updated successfully!');
      }
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.msg || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">👤 My Profile</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        
        {/* Profile Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-2xl font-bold">{profile?.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              editing 
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {editing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {editing ? (
          <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                placeholder="Enter your name"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                placeholder="Tell us about yourself"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg disabled:opacity-50 transition"
            >
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>
        ) : (
          /* Display Mode */
          <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            
            <div>
              <p className="text-sm text-gray-600 font-medium">Name</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {profile?.name || 'Not set'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Bio</p>
              <p className="text-gray-700 mt-1">
                {profile?.bio || 'No bio added yet'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Phone</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {profile?.phone || 'Not set'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Role</p>
              <p className="text-lg font-bold text-blue-600 mt-1 capitalize">
                {profile?.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
