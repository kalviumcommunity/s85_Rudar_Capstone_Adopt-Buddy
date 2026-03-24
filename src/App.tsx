/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Loader2 } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PetListing = lazy(() => import('./pages/PetListing'));
const PetDetails = lazy(() => import('./pages/PetDetails'));
const AddPet = lazy(() => import('./pages/AddPet'));
const Requests = lazy(() => import('./pages/Requests'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/pets" element={<PetListing />} />
                  <Route path="/pets/:id" element={<PetDetails />} />

                  {/* Protected Routes (All authenticated users) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/chat" element={<ChatPage />} />
                  </Route>

                  {/* Protected Routes (Shelters only) */}
                  <Route element={<ProtectedRoute allowedRoles={['shelter']} />}>
                    <Route path="/add-pet" element={<AddPet />} />
                  </Route>
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}
