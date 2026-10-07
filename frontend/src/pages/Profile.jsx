import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserStats().then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;

  const s = stats?.stats || {};
  const xpForNextLevel = ((user?.level || 1) * 500);
  const xpProgress = ((user?.xp || 0) % 500) / 5;

  return (
    <div className="page-container">
      <div className="profile-hero animate-fade-in-up">
        <div className="profile-avatar-large">{user?.username?.[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user?.username}</h1>
          <p>{user?.email}</p>
          <div className="profile-level">
            <span className="level-badge">🎖️ Level {user?.level || 1}</span>
            <div className="level-bar-track"><div className="level-bar-fill" style={{ width: `${xpProgress}%` }}></div></div>
            <span className="level-progress">{user?.xp || 0} / {xpForNextLevel} XP</span>
          </div>
        </div>
      </div>

      <div className="profile-stats-grid stagger-children">
        <div className="profile-stat glass-card">
          <span className="ps-icon">⚡</span><span className="ps-value">{user?.xp || 0}</span><span className="ps-label">Total XP</span>
        </div>
        <div className="profile-stat glass-card">
          <span className="ps-icon">🔥</span><span className="ps-value">{user?.streak || 0}</span><span className="ps-label">Day Streak</span>
        </div>
        <div className="profile-stat glass-card">
          <span className="ps-icon">📚</span><span className="ps-value">{s.completedModules || 0}</span><span className="ps-label">Modules Done</span>
        </div>
        <div className="profile-stat glass-card">
          <span className="ps-icon">🏅</span><span className="ps-value">{s.badges || 0}</span><span className="ps-label">Badges</span>
        </div>
        <div className="profile-stat glass-card">
          <span className="ps-icon">🧠</span><span className="ps-value">{s.avgQuizScore || 0}%</span><span className="ps-label">Avg Quiz Score</span>
        </div>
        <div className="profile-stat glass-card">
          <span className="ps-icon">🎖️</span><span className="ps-value">{user?.level || 1}</span><span className="ps-label">Level</span>
        </div>
      </div>

      {user?.badges?.length > 0 && (
        <div className="profile-badges animate-fade-in-up">
          <h2>🏅 Earned Badges</h2>
          <div className="badges-row">
            {user.badges.map((b, i) => (
              <div key={i} className="earned-badge glass-card">
                <span className="badge-icon-lg">{b.icon}</span>
                <span className="badge-name">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.progress?.length > 0 && (
        <div className="profile-progress animate-fade-in-up">
          <h2>📊 Module Progress</h2>
          <div className="progress-list">
            {stats.progress.map((p, i) => (
              <div key={i} className="progress-row glass-card">
                <div className="progress-row-info">
                  <span>{p.completed ? '✅' : '📖'}</span>
                  <span>Module</span>
                </div>
                <div className="progress-row-scores">
                  {p.quizScore > 0 && <span className="badge-pill saffron">Quiz: {p.quizScore}%</span>}
                  {p.scenarioCompleted && <span className="badge-pill green">Scenario ✓</span>}
                  {p.matchScore > 0 && <span className="badge-pill blue">Match: {p.matchScore}%</span>}
                </div>
                <span className="progress-xp">+{p.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
