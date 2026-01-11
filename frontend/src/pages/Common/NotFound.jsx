import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-danger mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-6">Page Not Found</p>
      <Link to="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
        Go Home
      </Link>
    </div>
  );
}

// # # MongoDB
// # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logopromo

// # # JWT
// # JWT_SECRET=your_super_secret_key_change_in_production
// # JWT_EXPIRE=7d

// # # Razorpay
// # RAZORPAY_KEY_ID=rzp_test_DummyKeyForTesting123
// # RAZORPAY_KEY_SECRET=DummySecretKey123ForTesting

// # # Email
// # EMAIL_USER=your_email@gmail.com
// # EMAIL_PASSWORD=your_app_password

// # # Cloudinary
// # CLOUDINARY_NAME=your_cloud_name
// # CLOUDINARY_API_KEY=your_api_key
// # CLOUDINARY_API_SECRET=your_api_secret

// # # Frontend URL
// # FRONTEND_URL=http://localhost:3000

//  Server
// # PORT=5000
// # NODE_ENV=development