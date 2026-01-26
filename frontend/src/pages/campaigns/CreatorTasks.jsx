import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { taskAPI } from '../../services/api'; // तुम्हारा api file
import RaiseDisputeModal from '../Advertiser/RiaseDisputeModal';
export default function CreatorTasks() {
  const { campaignId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  console.log('🚀 CreatorTasks loaded for campaignId:', campaignId);

  // Fetch tasks from backend
  const fetchCampaignTasks = async () => {
    try {
      const result = await taskAPI.getCampaignTasks(campaignId);
      const taskId = result.data.tasks._id;
      console.log('🚀 Fetched tasks:', result.data.tasks);
     
      setTasks(result.data.tasks || []);
      setStats(result.data.stats || {});
      setCampaign(result.data.campaign);
      
    } catch (error) {
      console.error('❌ Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignTasks();
  }, [campaignId]);

  // APPROVE TASK (backend approveTask match)
  const handleApprove = async (taskId) => {
    if (!confirm('Approve task and pay worker ₹' + tasks.find(t => t._id === taskId)?.payout + '?')) return;
    
    try {
      const result = await taskAPI.approveTask(taskId);
      if (result.success) {
        alert('✅ Task approved & payment processed!');
        fetchCampaignTasks(); // Refresh list
      } else {
        alert('❌ ' + result.msg);
      }
    } catch (error) {
      alert('❌ Network error: ' + error.message);
    }
  };

  // REJECT TASK (backend rejectTask match)
  const handleReject = async (taskId) => {
    const reason = prompt('Rejection reason (required):');
    if (!reason || reason.trim() === '') return;
    
    try {
      const result = await taskAPI.rejectTask(taskId, { reason });
      if (result.success) {
        alert('✅ Task rejected');
        fetchCampaignTasks();
      } else {
        alert('❌ ' + result.msg);
      }
    } catch (error) {
      alert('❌ Network error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">🔄 Loading campaign tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* CAMPAIGN HEADER */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📊 Campaign Tasks Dashboard
          </h1>
          
          {campaign && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                <div className="text-3xl font-bold">{stats.total || 0}</div>
                <div className="text-blue-100">Total Workers</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl">
                <div className="text-3xl font-bold">{stats.submitted || 0}</div>
                <div className="text-yellow-100">Pending Review</div>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl">
                <div className="text-3xl font-bold">{stats.completed || 0}</div>
                <div className="text-emerald-100">Approved</div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl">
                <div className="text-3xl font-bold">{stats.rejected || 0}</div>
                <div className="text-red-100">Rejected</div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border">
            <h3 className="font-bold text-lg mb-2">{campaign?.title}</h3>
            <p className="text-sm text-gray-600">
              Payout: ₹{campaign?.payoutPerTask}/task | Max: {campaign?.maxTasks} workers
            </p>
          </div>
        </div>

        {/* TASKS LIST */}
        <div className="space-y-6">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No workers yet!</h3>
              <p className="text-gray-500 text-lg">Share your campaign link to attract workers 🚀</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 hover:shadow-2xl transition-all">
                
                {/* WORKER HEADER */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {task.workerId?.name?.charAt(0)?.toUpperCase() || 'W'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">
                        {task.workerId?.name || 'Anonymous Worker'}
                      </h4>
                      <p className="text-gray-500 text-sm">{task.workerId?.email}</p>
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <span className={`px-6 py-2 rounded-full text-sm font-bold shadow-md ${
                    task.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    task.status === 'submitted' ? 'bg-amber-100 text-amber-800' :
                    task.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                </div>

                {/* PROOF SECTION */}
                {task.proofLink && (
                  <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-100 rounded-2xl">
                    <h5 className="font-semibold text-lg mb-4 flex items-center">
                      📎 Proof Submission
                    </h5>
                    <p className="text-sm text-blue-800 mb-4">{task.proofDescription || 'Screenshot submitted'}</p>
                    <a 
                      href={task.proofLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-all"
                    >
                      🔗 View Proof
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {task.rejectionReason && (
                  <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <h5 className="font-semibold text-lg text-red-800 mb-4">❌ Rejection Reason</h5>
                    <p className="text-sm text-red-700">{task.rejectionReason}</p>
                  </div>
                )}

                {/* TASK DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{task.payout}</div>
                    <div className="text-sm text-gray-500">Payout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{new Date(task.createdAt).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">Joined</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg">
                      {task._id.slice(-8)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Task ID</div>
                  </div>
                </div>

                {/* 🔥 ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  
                  {task.status === 'assigned' && (
                    <div className="flex-1 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
                      <div className="text-2xl mb-2">⏳</div>
                      <div className="font-semibold text-blue-800">Waiting for proof...</div>
                    </div>
                  )}

                  {task.status === 'submitted' && (
                    <>
                      <button
                        onClick={() => handleApprove(task._id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1"
                      >
                        ✅ APPROVE & PAY
                      </button>
                      <button
                        onClick={() => handleReject(task._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:-translate-y-1"
                      >
                        ❌ REJECT
                      </button>
                    </>
                  )}

                  {task.status === 'approved' && (
                    <div className="flex-1 p-6 bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <div className="font-bold text-emerald-800 text-xl">PAID</div>
                    </div>
                  )}

                  {task.status === 'rejected' && (
                    <div className="flex-1 p-6 bg-red-100 border-2 border-red-300 rounded-2xl text-center">
                      <div className="text-3xl mb-2">❌</div>
                      <div className="font-bold text-red-800 text-xl">REJECTED</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
       <button 
      onClick={() => setShowDisputeModal(true)}
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
    >
      Raise Dispute
    </button>
    
    {showDisputeModal && (
      <RaiseDisputeModal 
        taskId={"6974f30e3e818f5a46d32314"}
        taskTitle={tasks.title}
        onClose={() => setShowDisputeModal(false)}
      />
    )}
    </div>
  );
}