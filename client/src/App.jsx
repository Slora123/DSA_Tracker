import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProblemLogger from './pages/ProblemLogger';
import ProblemList from './pages/ProblemList';
import RevisionCalendar from './pages/RevisionCalendar';
import Explore from './pages/Explore';
import NeetCode150 from './pages/NeetCode150';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'log': return <ProblemLogger onComplete={() => setActiveTab('dashboard')} />;
      case 'table': return <ProblemList />;
      case 'revision': return <RevisionCalendar />;
      case 'neetcode': return <NeetCode150 />;
      case 'explore': return <Explore />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
