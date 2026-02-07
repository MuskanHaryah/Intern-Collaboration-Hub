import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import { CursorGlow } from './components/UI/CursorGlow';
import { ProtectedRoute, PublicRoute } from './components/Auth';
import { useAuthStore, useThemeStore } from './stores';
import { SocketProvider } from './socket';
import { RealtimeToast } from './components/UI';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state and theme on app load
  useEffect(() => {
    initialize();
    useThemeStore.getState().initializeTheme();
  }, [initialize]);

  return (
    <SocketProvider>
      <Router>
        <CursorGlow />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <RealtimeToast />
    </SocketProvider>
  );
}

export default App;
