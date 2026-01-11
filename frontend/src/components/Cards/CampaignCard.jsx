import React from 'react';
import { Link } from 'react-router-dom';

export default function CampaignCard({ campaign }) {
  const progress = (campaign.tasksCompleted / campaign.maxTasks) * 100;

  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg">
      <h3 className="text-lg font-bold mb-2">{campaign.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{campaign.description.substring(0, 100)}...</p>

      <div className="mb-3">
        <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded">
          {campaign.category}
        </span>
      </div>

      <div className="mb-2 text-sm">
        <p>Payout: ₹{campaign.payoutPerTask}</p>
        <p>Tasks: {campaign.tasksCompleted}/{campaign.maxTasks}</p>
        <p>Budget: ₹{campaign.totalBudget}</p>
      </div>

      <div className="w-full bg-gray-200 rounded h-2 mb-2">
        <div
          className="bg-success h-2 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <Link
        to={`/campaign/${campaign._id}`}
        className="text-primary hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
}
