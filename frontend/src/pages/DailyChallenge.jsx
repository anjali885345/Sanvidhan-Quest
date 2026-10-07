import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailyChallenge, completeDailyChallenge } from '../services/api';
import { useAuth } from '../context/AuthContext';
import XPPopup from '../components/XPPopup';
import './Games.css';

const DailyChallengePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState(null);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    getDailyChallenge().then(res => { setChallenge(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await completeDailyChallenge();
      setResult(res.data);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level, streak: res.data.streak });
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;

  const typeIcons = { quiz: '🧠', scenario: '⚖️', match: '🧩', timeline: '📅', fillblank: '✍️', memory: '🃏' };
  const typeNames = { quiz: 'Quiz Challenge', scenario: 'Scenario Court', match: 'Match Articles', timeline: 'Timeline', fillblank: 'Fill the Blank', memory: 'Memory' };

  return (
    <div className="page-container">
      <XPPopup xp={result?.xpEarned} show={showXP} />

      <div className="daily-hero animate-fade-in-up">
        <div className="daily-hero-icon animate-float">🌟</div>
        <h1>Daily Challenge</h1>
        <p>Complete today&apos;s challenge to keep your streak alive!</p>
        <div className="streak-display">
          <span className="streak-flame">🔥</span>
          <span className="streak-count">{user?.streak || 0} Day Streak</span>
        </div>
      </div>

      {result ? (
        <div className="daily-result glass-card animate-bounce-in">
          <div className="result-icon">🎉</div>
          <h2>{result.message}</h2>
          <div className="result-xp">⚡ +{result.xpEarned} XP</div>
          {result.bonusXP > 0 && <div className="result-bonus">🎁 Streak Bonus: +{result.bonusXP} XP!</div>}
          <p className="result-streak">🔥 Current Streak: {result.streak} days</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      ) : challenge?.alreadyCompleted ? (
        <div className="daily-completed glass-card animate-scale-in">
          <div className="result-icon">✅</div>
          <h2>Today&apos;s challenge completed!</h2>
          <p>Come back tomorrow for a new challenge. Keep your streak going! 🔥</p>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      ) : (
        <div className="daily-challenge-card glass-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="daily-type">
            <span className="daily-type-icon">{typeIcons[challenge?.challengeType] || '🌟'}</span>
            <span className="daily-type-name">{typeNames[challenge?.challengeType] || 'Challenge'}</span>
          </div>
          <h2>Today&apos;s Mission</h2>
          <p>Complete a {typeNames[challenge?.challengeType]?.toLowerCase() || 'challenge'} to earn XP and extend your streak!</p>
          <div className="daily-reward"><span>🎁 Reward:</span> <strong>50 XP</strong></div>
          <button className="btn btn-primary btn-lg" onClick={handleComplete} disabled={completing}>
            {completing ? 'Completing...' : 'Complete Challenge 🚀'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyChallengePage;
