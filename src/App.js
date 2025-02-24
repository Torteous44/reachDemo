import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CreateInterview from './components/CreateInterview';
import AccessInterview from './components/AccessInterview';
import InterviewLanding from './components/InterviewLanding';
import RealtimeConnect from './components/RealtimeConnect';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
  const { user } = useAuth();

  // Redirect authenticated users away from landing page
  if (user && window.location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      <Route path="/create-interview" element={
        <PrivateRoute>
          <CreateInterview />
        </PrivateRoute>
      } />

      {/* Session Route */}
      <Route path="/session/:sessionId" element={
        <PrivateRoute>
          <RealtimeConnect />
        </PrivateRoute>
      } />

      {/* Public Interview Routes */}
      <Route path="/access" element={<AccessInterview />} />
      <Route path="/interview/:hexCode" element={<InterviewLanding />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AppRoutes />
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
