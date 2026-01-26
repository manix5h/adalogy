import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { taskAPI } from '../../services/api.jsx';
import { useNavigate } from 'react-router-dom';
//GET MY TASKS + SUBMIT PROOF
export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ GET MY TASKS
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await taskAPI.getMyTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUBMIT PROOF
  const handleSubmitProof = async (taskId) => {
    const proofLink = document.getElementById(`proof-link-${taskId}`)?.value;
    const proofDesc = document.getElementById(`proof-desc-${taskId}`)?.value;

    if (!proofLink) return alert('Proof link requireddf');

    try {
      const response = await taskAPI.submitProof(taskId, { proofUrl:proofLink, proofDescription: proofDesc });
      console.log('✅ Proof submitted:', response);
      alert('✅ Proof submitted!');
      fetchTasks(); // Refresh
    } catch (error) {
      alert('❌ ' + error.response?.data?.msg);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} 
          className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center mb-20">
          📋 My Tasks
        </motion.h1>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {tasks.map((task, i) => (
            <TaskCard key={task._id} task={task} index={i} onSubmit={handleSubmitProof} />
          ))}
        </div>

        {tasks.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-32">
            <div className="text-8xl mb-8">📭</div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/campaigns/public')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl">
              Find Campaigns 🚀
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// TaskCard Component
const TaskCard = ({ task, index, onSubmit }) => {
  const statusStyles = {
    assigned: 'border-blue-500 bg-blue-50 text-blue-800',
    submitted: 'border-yellow-500 bg-yellow-50 text-yellow-800 animate-pulse',
    approved: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    rejected: 'border-red-500 bg-red-50 text-red-800'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border hover:shadow-2xl group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 pr-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{task.campaignId?.title}</h3>
          <span className={`px-4 py-2 rounded-2xl border-2 font-bold text-sm ${statusStyles[task.status]}`}>
            {task.status.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-emerald-600 mb-2">₹{task.campaignId?.payoutPerTask}</div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
            {task.campaignId?.category}
          </span>
        </div>
      </div>

      {/* Status-specific content */}
      {task.status === 'assigned' && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2">📎 Submit Proof</h4>
          <div className="space-y-4">
            <input id={`proof-link-${task._id}`} type="url" placeholder="Instagram Post URL *" 
              className="w-full p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 ring-blue-100" />
            <input id={`proof-desc-${task._id}`} type="text" placeholder="Description (optional)" 
              className="w-full p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 ring-blue-100" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onSubmit(task._id)}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl">
            🚀 Submit Proof
          </motion.button>
        </div>
      )}

      {task.status === 'submitted' && (
        <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl border-4 border-yellow-200 text-center">
          <div className="text-6xl mb-6 animate-bounce">⏳</div>
          <h4 className="text-2xl font-bold text-yellow-800 mb-4">Under Review</h4>
          <p className="text-yellow-700 mb-6">Waiting for advertiser approval</p>
          {task.proofLink && (
            <motion.a href={task.proofLink} target="_blank" rel="noopener noreferrer" 
              whileHover={{ scale: 1.05 }} className="block w-full bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold hover:bg-blue-700">
              🔗 View Proof
            </motion.a>
          )}
        </div>
      )}

      {task.status === 'approved' && (
        <div className="p-8 bg-gradient-to-r from-emerald-50 to-green-100 rounded-3xl border-4 border-emerald-200 text-center">
          <div className="text-6xl mb-6 animate-pulse">✅</div>
          <h3 className="text-3xl font-black text-emerald-800 mb-4">Approved!</h3>
          <div className="text-2xl font-bold text-emerald-700 bg-emerald-200 px-8 py-4 rounded-2xl mx-auto max-w-max">
            ₹{task.campaignId?.payoutPerTask} Credited
          </div>
        </div>
      )}

      {task.status === 'rejected' && (
        <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border-2 border-red-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl mt-1">❌</div>
            <div>
              <h4 className="text-xl font-bold text-red-800 mb-3">Rejected</h4>
              <div className="bg-red-100 p-4 rounded-xl border-l-4 border-red-400">
                <p className="text-red-700 font-medium">{task.rejectionReason}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};