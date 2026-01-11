import React from 'react';
import { Link } from 'react-router-dom';

export default function TaskCard({ task }) {
  const statusColor = {
    assigned: 'bg-warning',
    submitted: 'bg-info',
    approved: 'bg-success',
    rejected: 'bg-danger',
  };

  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{task.campaignId?.title}</h3>
        <span className={`text-white text-xs px-2 py-1 rounded ${statusColor[task.status]}`}>
          {task.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-2">{task.campaignId?.category}</p>

      <div className="mb-3">
        <p className="text-lg font-bold text-primary">₹{task.payout}</p>
      </div>

      {task.proofUrl && (
        <p className="text-sm text-gray-600 mb-2">Proof submitted: Yes</p>
      )}

      <Link
        to={`/task/${task._id}`}
        className="text-primary hover:underline"
      >
        View Task →
      </Link>
    </div>
  );
}
