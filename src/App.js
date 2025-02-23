import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StartInterview from './components/StartInterview';
import RealtimeConnect from './components/RealtimeConnect';
import CreateInterview from './components/CreateInterview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interviews/create" element={<CreateInterview />} />
      <Route path="/interviews/start" element={<StartInterview />} />
      <Route path="/realtime/:sessionId" element={<RealtimeConnect />} />
    </Routes>
  );
}

export default App;
