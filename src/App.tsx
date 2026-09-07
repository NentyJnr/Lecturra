import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

import { PortalLayout } from './components/layout/PortalLayout';
import { DashboardPage } from './pages/DashboardPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { IngestionPage } from './pages/IngestionPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { ScoreReportsPage } from './pages/ScoreReportsPage';
import { PublicStudentTestPage } from './pages/PublicStudentTestPage';
import { QuotaPage } from './pages/QuotaPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Only Route Wrapper (redirects to /dashboard if logged in)
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Public Unauthenticated Student Test Attempt Route */}
        <Route path="/test/:shareToken" element={<PublicStudentTestPage />} />

        {/* Protected Lecturer Portal Layout & Module Routes */}
        <Route
          element={
            <ProtectedRoute>
              <PortalLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/question-bank" element={<QuestionBankPage />} />
          <Route path="/ingestion" element={<IngestionPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/score-reports" element={<ScoreReportsPage />} />
          <Route path="/quota" element={<QuotaPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
