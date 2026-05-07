'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase/config';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { ShieldCheck, LogOut, Lock, Mail } from 'lucide-react';
import AdminCampaignManager from './AdminCampaignManager';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email === ADMIN_EMAIL) {
        setUser(firebaseUser);
        setShowLogin(false);
      } else {
        setUser(null);
        setShowLogin(true);
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email === ADMIN_EMAIL) {
        setUser(result.user);
        setShowLogin(false);
        toast.success('Logged in as admin.');
      } else {
        await signOut(auth);
        toast.error('Unauthorized account.');
      }
    } catch (err) {
      toast.error('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowLogin(true);
    toast.success('Logged out.');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Login modal overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border bg-white border-gray-200 shadow-2xl p-8">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-blue-50">
                <ShieldCheck size={32} className="text-blue-600" aria-hidden="true" />
              </div>
              <h2 className="font-bold text-2xl text-gray-900">
                Admin Login
              </h2>
              <p className="text-sm text-gray-500 text-center">
                This area is restricted to administrators only.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                onClick={handleLogin}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShieldCheck size={18} className="mr-2" aria-hidden="true" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin dashboard */}
      {user && !showLogin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-xl bg-blue-50">
                  <ShieldCheck size={22} className="text-blue-600" aria-hidden="true" />
                </div>
                <h1 className="font-bold text-3xl text-gray-900">
                  Admin Panel
                </h1>
              </div>
              <p className="text-gray-500 text-sm sm:ml-12">
                Logged in as <span className="font-medium text-gray-700">{user.email}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut size={16} className="mr-2" aria-hidden="true" />
              Logout
            </button>
          </div>
          <AdminCampaignManager />
        </div>
      )}
    </div>
  );
}
