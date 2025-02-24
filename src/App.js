import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/misc/LandingPage';
import Dashboard from './components/misc/Dashboard';
import CreateInterview from './components/CreateInterview';
import AccessInterview from './components/AccessInterview';
import InterviewLanding from './components/InterviewLanding';
import RealtimeConnect from './components/conversation/RealtimeConnect';
import PrivateRoute from './components/misc/PrivateRoute';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/create-interview" element={<PrivateRoute><CreateInterview /></PrivateRoute>} />
      <Route path="/access" element={<AccessInterview />} />
      <Route path="/interview/:hexCode" element={<InterviewLanding />} />
      <Route path="/session/:sessionId" element={<PrivateRoute><RealtimeConnect /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
