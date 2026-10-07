import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LearningMap from './pages/LearningMap';
import ModuleDetail from './pages/ModuleDetail';
import QuizArena from './pages/QuizArena';
import ScenarioCourt from './pages/ScenarioCourt';
import MatchArticle from './pages/MatchArticle';
import TimelineChallenge from './pages/TimelineChallenge';
import FillPreamble from './pages/FillPreamble';
import FlashRecall from './pages/FlashRecall';
import DailyChallenge from './pages/DailyChallenge';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import BadgeGallery from './pages/BadgeGallery';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><LearningMap /></ProtectedRoute>} />
              <Route path="/module/:id" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
              <Route path="/quiz/:moduleId" element={<ProtectedRoute><QuizArena /></ProtectedRoute>} />
              <Route path="/scenario/:moduleId" element={<ProtectedRoute><ScenarioCourt /></ProtectedRoute>} />
              <Route path="/match/:moduleId" element={<ProtectedRoute><MatchArticle /></ProtectedRoute>} />
              <Route path="/timeline/:moduleId" element={<ProtectedRoute><TimelineChallenge /></ProtectedRoute>} />
              <Route path="/fillblank/:moduleId" element={<ProtectedRoute><FillPreamble /></ProtectedRoute>} />
              <Route path="/memory/:moduleId" element={<ProtectedRoute><FlashRecall /></ProtectedRoute>} />
              <Route path="/daily" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/badges" element={<ProtectedRoute><BadgeGallery /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
