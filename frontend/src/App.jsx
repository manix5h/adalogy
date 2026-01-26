import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/Layout/PrivateRoute';

// Pages
import Home from './pages/Common/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/Common/NotFound';
import Unauthorized from './pages/Common/Unathorized';
import WorkerDashboard from './pages/Worker/Dasboard';
import AdvertiserDashboard from './pages/Advertiser/Dashboard';
import CreateCampaignForm from './pages/Advertiser/CreateCampaignForm';

import CampaignDetailW from './pages/Worker/CampaignDetail';
import CampaignDetailA from './pages/Advertiser/CampaignDetail';
import PublicCampaigns from './pages/campaigns/PublicCampaigns';
import MyProfile from './pages/profile/MyProfile';
import PaymentSettings from './pages/profile/PaymentSettings';
import UserStats from './pages/profile/UserStats';
import PublicProfile from './pages/profile/PublicProfile';
import VerifyEmail from './pages/Auth/VerifyEmail';
import MyTasks from './pages/tasks/MyTasks';
import MyCampaigns from './pages/Advertiser/MyCampaign';
import CreatorTasks from './pages/campaigns/CreatorTasks';
import RaiseDisputeModal from './pages/Advertiser/RiaseDisputeModal';



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              <Route
                path="/worker/dashboard"
                element={
                  <PrivateRoute requiredRole="worker">
                    <WorkerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
  path="/worker/campaign/:id"
  element={
    <PrivateRoute requiredRole="worker">
      <CampaignDetailW />
    </PrivateRoute>
  }
/>
      <Route
  path="/worker/campaigns"
  element={
    <PrivateRoute requiredRole="worker">
      <PublicCampaigns />
    </PrivateRoute>
  }
/>



              <Route
                path="/advertiser/dashboard"
                element={
                  <PrivateRoute requiredRole="advertiser">
                    <AdvertiserDashboard />
                  </PrivateRoute>
                }
              />
           
              <Route
                path="/advertiser/create-campaign"
                element={
                  <PrivateRoute requiredRole="advertiser">
                    <CreateCampaignForm />
                  </PrivateRoute>
                }
              />

              <Route
  path="/advertiser/campaign/:id"
  element={
    <PrivateRoute requiredRole="advertiser">
      <CampaignDetailA />
    </PrivateRoute>
  }
/>

              <Route
  path="/advertiser/campaigns"
  element={
    <PrivateRoute requiredRole="advertiser">
      <MyCampaigns />
    </PrivateRoute>
  }
/>
<Route path="/advertiser/campaign/:campaignId/tasks" element={
  
    <CreatorTasks />
  
} />


<Route
  path="/campaigns"
  element={<PublicCampaigns />}
/>


<Route
  path="/worker/profile"
  element={
    <PrivateRoute>
      <MyProfile />
    </PrivateRoute>
  }
/>

<Route
  path="/worker/payment"
  element={
    <PrivateRoute>
      <PaymentSettings />
    </PrivateRoute>
  }
/>

<Route
  path="/worker/stats"
  element={
    <PrivateRoute>
      <UserStats />
    </PrivateRoute>
  }
/>

<Route
  path="/user/:userId"
  element={<PublicProfile />}
/>



//task
<Route path="/worker/tasks" element={<MyTasks />} />



              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
