import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';


  export default function PaymentSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paymentData, setPaymentData] = useState({
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    phonepe: '',
  });

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  // ✅ FIXED - Correct nested structure
  const fetchPaymentInfo = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
      
      const userData = response.data.user;
      console.log('🔍 Raw API response:', userData.bankAccount);
      
      setPaymentData({
        accountHolder: userData.bankAccount?.accountHolder || '',
        accountNumber: userData.bankAccount?.accountNumber || '',
        ifscCode: userData.bankAccount?.ifscCode || '',
        bankName: userData.bankAccount?.bankName || '',
        upiId: userData.upiId || '',
        phonepe: userData.phonepe || '',
      });
      
      console.log('✅ Form data populated:', paymentData);
    } catch (error) {
      console.error('❌ Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async () => {
    console.log('💾 Saving to backend:', paymentData);
    setSaving(true);
    
    try {
      const response = await userAPI.updatePaymentDetails({
        bankAccount: {  // ✅ Backend expect करता है nested object
          accountHolder: paymentData.accountHolder,
          accountNumber: paymentData.accountNumber,
          ifscCode: paymentData.ifscCode,
          bankName: paymentData.bankName,
        },
        upiId: paymentData.upiId,
        phonepe: paymentData.phonepe,
      });
      
      console.log('✅ Backend saved:', response.data);
      
      if (response.data.success) {
        alert('✅ Saved successfully!');
        setEditing(false);
        fetchPaymentInfo();  // Refresh data from DB
      }
    } catch (error) {
      console.error('❌ Save error:', error.response?.data);
      alert('❌ Save failed: ' + (error.response?.data?.msg || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">💳 Payment Settings</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bank Account Details</h2>
            <p className="text-gray-600 mt-1">Complete your payout information</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              editing 
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={saving}
          >
            {editing ? '✕ Cancel' : '✏️ Edit Details'}
          </button>
        </div>

        {/* ✅ BANK ACCOUNT - Complete Form */}
        {editing ? (
          <div className="space-y-6">
            
            {/* Account Holder */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👤 Account Holder Name *
              </label>
              <input
                type="text"
                name="accountHolder"
                value={paymentData.accountHolder}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🏦 Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={paymentData.accountNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="1234567890123456"
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔢 IFSC Code *
              </label>
              <input
                type="text"
                name="ifscCode"
                value={paymentData.ifscCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition uppercase"
                placeholder="HDFC0001234"
                maxLength="11"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🏛️ Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={paymentData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="HDFC Bank"
                required
              />
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📱 UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={paymentData.upiId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
                placeholder="yourname@paytm"
              />
            </div>

            {/* PhonePe */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📲 PhonePe Number
              </label>
              <input
                type="tel"
                name="phonepe"
                value={paymentData.phonepe}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePayment}
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                '💾 Save Payment Details'
              )}
            </button>
          </div>
        ) : (
          /* Display Mode - Masked Data */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Bank Account */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border-2 border-emerald-200 group hover:shadow-md transition-all">
              <div className="text-3xl font-bold mb-3 group-hover:scale-110 transition">🏦</div>
              <p className="text-sm text-gray-600 font-medium mb-2">Bank Account</p>
              {paymentData.accountHolder ? (
                <>
                  <p className="font-bold text-lg mb-1">{paymentData.accountHolder}</p>
                  <p className="text-sm text-gray-700">
                    ****{paymentData.accountNumber?.slice(-4) || '****'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{paymentData.bankName}</p>
                  <p className="text-xs font-mono bg-white px-2 py-1 rounded mt-1">
                    {paymentData.ifscCode}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Not configured</p>
              )}
            </div>

            {/* UPI ID */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
              <div className="text-3xl font-bold mb-3">📱</div>
              <p className="text-sm text-gray-600 font-medium mb-2">UPI ID</p>
              <p className="font-bold text-lg">
                {paymentData.upiId || 'Not added'}
              </p>
            </div>

            {/* PhonePe */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
              <div className="text-3xl font-bold mb-3">📲</div>
              <p className="text-sm text-gray-600 font-medium mb-2">PhonePe</p>
              <p className="font-bold text-lg">
                {paymentData.phonepe || 'Not added'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verification Status */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          ✅ Payment Verification Status
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            paymentData.accountHolder && paymentData.accountNumber && paymentData.ifscCode && paymentData.bankName
              ? 'bg-green-100 border-2 border-green-300'
              : 'bg-gray-100 border-2 border-gray-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-5 h-5 rounded-full ${
                paymentData.accountHolder && paymentData.accountNumber && paymentData.ifscCode && paymentData.bankName
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`}></div>
              <span className="font-bold">Bank Account Verified</span>
            </div>
            <p className="text-sm text-gray-700">
              {paymentData.accountHolder && paymentData.accountNumber && paymentData.ifscCode && paymentData.bankName
                ? '✅ Ready for payouts'
                : '⚠️ Complete all fields to enable payouts'}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              <span className="font-bold">Payout Ready</span>
            </div>
            <p className="text-sm text-gray-700">
              {paymentData.accountHolder && paymentData.accountNumber && paymentData.ifscCode && paymentData.bankName
                ? '💰 You can receive payments'
                : '⏳ Configure bank details first'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
