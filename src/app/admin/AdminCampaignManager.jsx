'use client';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { sendApprovalEmail, sendRejectionEmail } from '../../utils/emailService';

const isAdmin = (email) => {
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    console.error('NEXT_PUBLIC_ADMIN_EMAIL is not defined in environment variables');
    toast.error('Admin email configuration missing');
    return false;
  }
  return email === ADMIN_EMAIL;
};

const AdminCampaignManager = () => {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState({
    pending: [],
    rejected: [],
    all: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (u) => {
        if (u && isAdmin(u.email)) {
          setUser(u);
        } else {
          setUser(null);
          setError('Unauthorized: Admins only');
          toast.error('Unauthorized: Admins only');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Auth state change error:', err);
        setError(`Authentication error: ${err.message}`);
        setLoading(false);
        toast.error(`Authentication error: ${err.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const campaignsRef = collection(db, 'campaigns');

      // Fetch pending campaigns
      const pendingQuery = query(
        campaignsRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingData = pendingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch rejected campaigns
      const rejectedQuery = query(
        campaignsRef,
        where('status', '==', 'rejected'),
        orderBy('createdAt', 'desc')
      );
      const rejectedSnapshot = await getDocs(rejectedQuery);
      const rejectedData = rejectedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all campaigns (excluding deleted)
      const allQuery = query(campaignsRef, orderBy('createdAt', 'desc'));
      const allSnapshot = await getDocs(allQuery);
      const allData = allSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((campaign) => campaign.deleted !== true);

      setCampaigns({
        pending: pendingData,
        rejected: rejectedData,
        all: allData,
      });
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      let errorMessage = `Failed to fetch campaigns: ${err.message}`;
      if (err.code === 'failed-precondition' && err.message.includes('requires an index')) {
        const indexUrlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
        errorMessage += '\nPlease create the required Firestore index using the link below:\n';
        errorMessage += indexUrlMatch ? indexUrlMatch[0] : 'Check the Firebase Console for the index creation link.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'campaigns', id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      await fetchCampaigns();
      toast.success('Campaign updated successfully');
    } catch (err) {
      console.error('Error updating campaign:', err);
      toast.error(`Failed to update campaign: ${err.message}`);
    }
  };

  const handleApprove = async (campaign) => {
    try {
      await updateStatus(campaign.id, { status: 'approved', isActive: true });
      try {
        await sendApprovalEmail(campaign.email, campaign.title, campaign.id);
      } catch (emailErr) {
        console.error('Error sending approval email:', emailErr);
        toast.error(`Campaign approved, but failed to send email: ${emailErr.message}`);
        return;
      }
      toast.success(`Campaign "${campaign.title}" approved`);
    } catch (err) {
      console.error('Error approving campaign:', err);
      toast.error(`Failed to approve campaign: ${err.message}`);
    }
  };

  const handleReject = async (campaign) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) {
      toast.error('Rejection reason is required');
      return;
    }
    try {
      await updateStatus(campaign.id, {
        status: 'rejected',
        isActive: false,
        rejectionReason: reason,
      });
      try {
        await sendRejectionEmail(campaign.email, campaign.title, reason);
      } catch (emailErr) {
        console.error('Error sending rejection email:', emailErr);
        toast.error(`Campaign rejected, but failed to send email: ${emailErr.message}`);
        return;
      }
      toast.success(`Campaign "${campaign.title}" rejected`);
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      toast.error(`Failed to reject campaign: ${err.message}`);
    }
  };

  const handleToggleActive = async (id, title, isActive) => {
    try {
      await updateStatus(id, {
        isActive: !isActive,
        status: !isActive ? 'approved' : 'inactive',
      });
      toast.success(
        `Campaign "${title}" ${!isActive ? 'activated' : 'deactivated'}`
      );
    } catch (err) {
      console.error('Error toggling campaign active status:', err);
      toast.error(`Failed to toggle active status: ${err.message}`);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `⚠️ Permanently delete campaign "${title}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, 'campaigns', id));
      await fetchCampaigns();
      toast.success(`Campaign "${title}" deleted permanently`);
    } catch (err) {
      console.error('Error deleting campaign:', err);
      toast.error(`Failed to delete campaign: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.inactive}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyStyles = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-orange-50 text-orange-700 border-orange-200',
      low: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    
    if (!urgency) return null;
    
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${urgencyStyles[urgency.toLowerCase()] || urgencyStyles.low}`}>
        {urgency} Priority
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <div className="text-gray-600">
              {error.split('\n').map((line, index) => (
                <p key={index} className="mb-1">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[50vh] bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-600 mt-2">Admin access only</p>
          </div>
        </div>
      </div>
    );
  }

  const renderCampaign = (campaign, showAllActions = false) => (
    <div key={campaign.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {getStatusBadge(campaign.status)}
                {getUrgencyBadge(campaign.urgency)}
                {campaign.isActive && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span><strong>Creator:</strong> {campaign.fullName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{campaign.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span><strong>Category:</strong> {campaign.category || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span><strong>Target:</strong> {campaign.amount} ETH</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span><strong>Raised:</strong> {campaign.raised || 0} ETH</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((campaign.raised || 0) / campaign.amount * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {campaign.image && (
            <div className="mb-4">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full max-w-md h-48 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.alt = 'Image failed to load';
                  e.target.className = 'w-full max-w-md h-48 bg-gray-100 rounded-lg shadow-md flex items-center justify-center text-gray-500';
                }}
              />
            </div>
          )}

          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
              {campaign.description}
            </p>
          </div>

          {campaign.documents && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
              <div className="flex flex-wrap gap-2">
                {campaign.documents.split(',').map((url, index) => (
                  <a
                    key={index}
                    href={url.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Document {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {campaign.rejectionReason && (
            <div className="mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Rejection Reason</h4>
                <p className="text-red-700 text-sm">{campaign.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:w-64">
          {campaign.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(campaign)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
              <button
                onClick={() => handleReject(campaign)}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </>
          )}
          {campaign.status !== 'pending' && (
            <button
              onClick={() => handleToggleActive(campaign.id, campaign.title, campaign.isActive)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white transition-colors font-medium ${
                campaign.isActive
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {campaign.isActive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {campaign.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
          {showAllActions && (
            <button
              onClick={() => handleDelete(campaign.id, campaign.title)}
              className="flex items-center justify-center gap-2 bg-red-800 text-white py-3 px-4 rounded-lg hover:bg-red-900 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Permanently
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'pending', label: 'Pending', count: campaigns.pending.length },
    { id: 'rejected', label: 'Rejected', count: campaigns.rejected.length },
    { id: 'all', label: 'All Campaigns', count: campaigns.all.length },
  ];

  const getCurrentCampaigns = () => {
    switch (activeTab) {
      case 'pending':
        return campaigns.pending;
      case 'rejected':
        return campaigns.rejected;
      case 'all':
        return campaigns.all;
      default:
        return [];
    }
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.pending.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.all.filter(c => c.status === 'approved').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.all.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {getCurrentCampaigns().length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500">
                  {activeTab === 'pending' && 'No campaigns are currently pending review.'}
                  {activeTab === 'rejected' && 'No campaigns have been rejected.'}
                  {activeTab === 'all' && 'No campaigns have been submitted yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {getCurrentCampaigns().map((campaign) => 
                  renderCampaign(campaign, activeTab === 'all')
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignManager;
