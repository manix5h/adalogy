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
import CreateCampaignForm from './components/Forms/CreateCampaignForm';
import MyAllCampaigns from './pages/Advertiser/MyAllCampaigns';
import CampaignDetail from './pages/Worker/CampaignDetail';
import PublicCampaigns from './pages/Worker/PublicCampaigns';
import MyProfile from './pages/profile/MyProfile';
import PaymentSettings from './pages/profile/PaymentSettings';
import UserStats from './pages/profile/UserStats';
import PublicProfile from './pages/profile/PublicProfile';
import VerifyEmail from './pages/Auth/VerifyEmail';


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
  path="/campaign/:id"
  element={
    <PrivateRoute requiredRole="worker">
      <CampaignDetail />
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
                path="/advertiser/create"
                element={
                  <PrivateRoute requiredRole="advertiser">
                    <CreateCampaignForm />
                  </PrivateRoute>
                }
              />

              <Route
  path="/advertiser/campaigns"
  element={
    <PrivateRoute requiredRole="advertiser">
      <MyAllCampaigns />
    </PrivateRoute>
  }
/>



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


              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
