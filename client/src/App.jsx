import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { CursorGlow } from './components/UI/CursorGlow';
import { ErrorBoundary, AsyncHandlers } from './components/UI';
import { ToastContainer } from './components/UI/RealtimeToast';
import { ProtectedRoute, PublicRoute } from './components/Auth';
import { useAuthStore, useThemeStore } from './stores';
import { SocketProvider } from './socket';

console.log('📦 [App.jsx] App component loaded');

function App() {
  console.log('🎨 [App.jsx] App component rendering...');
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state and theme on app load
  useEffect(() => {
    console.log('🔧 [App.jsx] useEffect - Initializing auth and theme...');
    try {
      initialize();
      console.log('✅ [App.jsx] Auth initialized');
      useThemeStore.getState().initializeTheme();
      console.log('✅ [App.jsx] Theme initialized');
    } catch (error) {
      console.error('❌ [App.jsx] Error during initialization:', error);
    }
  }, [initialize]);

  console.log('🎯 [App.jsx] Rendering App component JSX');
  
  return (
    <ErrorBoundary title="Application Error">
      <SocketProvider>
        <Router>
          <CursorGlow />
          <AsyncHandlers.NetworkStatusMonitor />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary title="Dashboard Error">
                    <DashboardPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ErrorBoundary title="Project Error">
                    <ProjectPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <ToastContainer />
      </SocketProvider>
    </ErrorBoundary>
  );
}

console.log('✅ [App.jsx] App component defined successfully');

export default App;
