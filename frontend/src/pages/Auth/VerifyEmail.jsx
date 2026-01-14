import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [manualToken, setManualToken] = useState('');
  
  // ✅ Token URL से ले लो या manual input
  useEffect(() => {
    const token = searchParams.get('token');
    console.log('🔍 URL Token:', token);
    
    if (token) {
      verifyEmailToken(token);
    } else {
      setVerifying(false);
      setMessage('🔗 Please paste verification token below');
    }
  }, [searchParams]);

  const verifyEmailToken = async (token) => {
    try {
      console.log('🔄 Verifying token:', token);
      const response = await authAPI.verifyEmail(token);
      
      if (response.data.success) {
        setSuccess(true);
        setMessage('✅ Email verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.error('❌ Verification error:', error.response?.data);
      setMessage('❌ ' + (error.response?.data?.msg || 'Invalid token'));
    } finally {
      setVerifying(false);
    }
  };

  const handleManualVerify = async () => {
    if (!manualToken.trim()) {
      alert('Please enter token');
      return;
    }
    setVerifying(true);
    await verifyEmailToken(manualToken.trim());
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Verifying Email...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        
        {success ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Verified!</h1>
            <p className="text-gray-700 mb-4">{message}</p>
            <p className="text-sm text-gray-600">Redirecting to login...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {message.includes('token') ? 'Email Verification' : 'Verification Failed'}
            </h1>
            <p className="text-gray-700 mb-8">{message}</p>

            {/* ✅ MANUAL TOKEN INPUT */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <p className="font-bold mb-4 text-gray-800">Paste verification token:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="abc123def456ghi789..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleManualVerify}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Verify
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Check your email for the token or click "Resend Email"
              </p>
            </div>

            {/* Resend Button */}
            <button
              onClick={() => navigate('/resend-verification')}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition mb-4"
            >
              📧 Resend Verification Email
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
