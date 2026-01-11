import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const campaignAPI = {
  createCampaign: (data) => api.post('/campaigns', data),
  getMyCampaigns: () => api.get('/campaigns/my-campaigns'),
  getPublicCampaigns: () => api.get('/campaigns/public'),
  getCampaignById: (id) => api.get(`/campaigns/${id}`),
  updateCampaignStatus: (id, newStatus) => api.patch(`/campaigns/${id}/status`, { status: newStatus }),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
};

export const taskAPI = {
  joinCampaign: (data) => api.post('/tasks/join', data),
  getWorkerTasks: () => api.get('/tasks/my-tasks'),
  submitProof: (id, data) => api.patch(`/tasks/${id}/proof`, data),
  approveTask: (id) => api.patch(`/tasks/${id}/approve`),
  rejectTask: (id, data) => api.patch(`/tasks/${id}/reject`, data),
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getHistory: () => api.get('/payments/history'),
};

export const withdrawalAPI = {
  requestWithdrawal: (data) => api.post('/withdrawals/request', data),
  getHistory: () => api.get('/withdrawals/history'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  updatePaymentDetails: (data) => api.patch('/users/payment-details', data),
  getStats: () => api.get('/users/stats'),
  getPublicProfile: (userId) => api.get(`/users/public/${userId}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  banUser: (id, data) => api.patch(`/admin/users/${id}/ban`, data),
  unbanUser: (id) => api.patch(`/admin/users/${id}/unban`),
};

export const disputeAPI = {
  raiseDispute: (data) => api.post('/disputes/raise', data),
  getDisputes: () => api.get('/disputes/my-disputes'),
  resolveDispute: (id, data) => api.patch(`/disputes/${id}/resolve`, data),
};

export default api;