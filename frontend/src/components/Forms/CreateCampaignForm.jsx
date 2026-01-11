import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignAPI } from '../../services/api';

export default function CreateCampaignForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'social_media',
    payoutPerTask: '',
    maxTasks: '',
    totalBudget: '',
    taskDeadline: '',
    requirements: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await campaignAPI.createCampaign(formData);
      navigate('/advertiser/campaigns');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>

      {error && <div className="bg-danger text-white p-2 mb-4 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="social_media">Social Media</option>
            <option value="website_visit">Website Visit</option>
            <option value="app_download">App Download</option>
            <option value="video_view">Video View</option>
            <option value="review">Review</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Payout Per Task</label>
          <input
            type="number"
            name="payoutPerTask"
            value={formData.payoutPerTask}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Max Tasks</label>
          <input
            type="number"
            name="maxTasks"
            value={formData.maxTasks}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Total Budget</label>
          <input
            type="number"
            name="totalBudget"
            value={formData.totalBudget}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Task Deadline</label>
          <input
            type="date"
            name="taskDeadline"
            value={formData.taskDeadline}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows="3"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-primary text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>
    </form>
  );
}
