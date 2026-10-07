import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getModules, getUserStats } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, statsRes] = await Promise.all([getModules(), getUserStats()]);
        setModules(modRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-page"><div className="chakra-spinner"></div><p>Loading your quest...</p></div>;
  }

  const nextModule = modules.find(m => !m.progress?.completed);

  const gameModes = [
    { icon: '🧠', title: 'Quiz Arena', desc: 'Test your knowledge', link: '/learn', color: '#FF9933' },
    { icon: '⚖️', title: 'Scenario Court', desc: 'Role-play as Judge', link: '/learn', color: '#60a5fa' },
    { icon: '🧩', title: 'Match Articles', desc: 'Drag & drop matching', link: '/learn', color: '#138808' },
    { icon: '📅', title: 'Timeline', desc: 'Order the events', link: '/learn', color: '#FFD700' },
    { icon: '✍️', title: 'Fill the Blank', desc: 'Complete the text', link: '/learn', color: '#ff6b6b' },
    { icon: '🃏', title: 'Flash Recall', desc: 'Memory card game', link: '/learn', color: '#a78bfa' },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="dashboard-hero animate-fade-in-up">
        <div className="hero-content">
          <h1>Namaste, {user?.username}! 🙏</h1>
          <p>Your journey to becoming a constitutional scholar continues</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{user?.xp || 0}</span>
            <span className="hero-stat-label">Total XP</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{user?.streak || 0}🔥</span>
            <span className="hero-stat-label">Day Streak</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{stats?.stats?.completedModules || 0}/{modules.length}</span>
            <span className="hero-stat-label">Modules Done</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{user?.badges?.length || 0}</span>
            <span className="hero-stat-label">Badges</span>
          </div>
        </div>
      </div>

      {/* Daily Challenge CTA */}
      <Link to="/daily" className="daily-cta animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="daily-cta-glow"></div>
        <div className="daily-cta-content">
          <span className="daily-icon">🌟</span>
          <div>
            <h3>Daily Challenge Awaits!</h3>
            <p>Complete today&apos;s challenge to keep your streak alive</p>
          </div>
          <span className="daily-arrow">→</span>
        </div>
      </Link>

      {/* Continue Learning */}
      {nextModule && (
        <div className="continue-section animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="section-header">
            <h2>Continue Learning</h2>
          </div>
          <Link to={`/module/${nextModule._id}`} className="continue-card glass-card">
            <span className="continue-icon">{nextModule.icon}</span>
            <div className="continue-info">
              <h3>{nextModule.title}</h3>
              <p>{nextModule.description}</p>
              <span className="badge-pill saffron">{nextModule.difficulty} • {nextModule.xpReward} XP</span>
            </div>
            <span className="continue-arrow">→</span>
          </Link>
        </div>
      )}

      {/* Game Modes */}
      <div className="section-header animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2>🎮 Game Modes</h2>
        <p>Choose your way to learn the Constitution</p>
      </div>
      <div className="game-modes-grid stagger-children">
        {gameModes.map((mode, i) => (
          <Link to={mode.link} key={i} className="game-mode-card glass-card">
            <div className="game-mode-icon" style={{ background: `${mode.color}20`, borderColor: `${mode.color}40` }}>
              {mode.icon}
            </div>
            <h3>{mode.title}</h3>
            <p>{mode.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Modules */}
      <div className="section-header animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2>📜 Constitution Modules</h2>
        <p>Explore the building blocks of Indian democracy</p>
      </div>
      <div className="modules-preview stagger-children">
        {modules.slice(0, 6).map((mod) => (
          <Link to={`/module/${mod._id}`} key={mod._id} className="module-preview-card glass-card">
            <div className="module-preview-top">
              <span className="module-icon">{mod.icon}</span>
              {mod.progress?.completed && <span className="completed-check">✅</span>}
            </div>
            <h4>{mod.title}</h4>
            <p>{mod.partNumber}</p>
            <div className="module-meta">
              <span className="badge-pill saffron">{mod.xpReward} XP</span>
              <span className="badge-pill blue">{mod.difficulty}</span>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link to="/learn" className="btn btn-secondary">View All Modules →</Link>
      </div>
    </div>
  );
};

export default Dashboard;
