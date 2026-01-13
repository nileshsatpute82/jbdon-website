import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AgentHome from './pages/AgentHome';
import CovenantMonitoringDemo from './pages/CovenantMonitoringDemo';
import DocumentIntelligenceDemo from './pages/DocumentIntelligenceDemo';
import EscrowLifecycleDemo from './pages/EscrowLifecycleDemo';
import RegulatoryFilingDemo from './pages/RegulatoryFilingDemo';
import InvestorCommunicationDemo from './pages/InvestorCommunicationDemo';
import MastersPage from './pages/MastersPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-axis-200 border-t-axis-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AgentHome />
        </ProtectedRoute>
      } />
      <Route path="/agent/covenant-monitoring" element={
        <ProtectedRoute>
          <CovenantMonitoringDemo />
        </ProtectedRoute>
      } />
      <Route path="/agent/document-intelligence" element={
        <ProtectedRoute>
          <DocumentIntelligenceDemo />
        </ProtectedRoute>
      } />
      <Route path="/agent/escrow-lifecycle" element={
        <ProtectedRoute>
          <EscrowLifecycleDemo />
        </ProtectedRoute>
      } />
      <Route path="/agent/regulatory-filing" element={
        <ProtectedRoute>
          <RegulatoryFilingDemo />
        </ProtectedRoute>
      } />
      <Route path="/agent/investor-communication" element={
        <ProtectedRoute>
          <InvestorCommunicationDemo />
        </ProtectedRoute>
      } />
      <Route path="/masters" element={
        <ProtectedRoute>
          <MastersPage />
        </ProtectedRoute>
      } />
      <Route path="/masters/:masterName" element={
        <ProtectedRoute>
          <MastersPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
