import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(res => { setUsers(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="page-container">
      <div className="section-header animate-fade-in-up"><h2>🏆 Leaderboard</h2><p>Top constitutional scholars</p></div>

      <div className="podium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[1, 0, 2].map((pos) => {
          const u = top3[pos];
          if (!u) return <div key={pos} className="podium-slot empty"></div>;
          return (
            <div key={pos} className={`podium-slot pos-${pos + 1} ${u._id === user?._id ? 'is-me' : ''}`}>
              <div className="podium-avatar">{u.username?.[0]?.toUpperCase()}</div>
              <span className="podium-medal">{medals[pos]}</span>
              <h3>{u.username}</h3>
              <span className="podium-xp">⚡ {u.xp} XP</span>
              <span className="podium-level">Level {u.level}</span>
              <div className={`podium-bar bar-${pos + 1}`}></div>
            </div>
          );
        })}
      </div>

      <div className="leaderboard-list stagger-children">
        {rest.map((u, i) => (
          <div key={u._id} className={`leaderboard-item glass-card ${u._id === user?._id ? 'is-me' : ''}`}>
            <span className="lb-rank">{i + 4}</span>
            <div className="lb-avatar">{u.username?.[0]?.toUpperCase()}</div>
            <div className="lb-info">
              <h4>{u.username} {u._id === user?._id && '(You)'}</h4>
              <span>Level {u.level} • 🔥 {u.streak}</span>
            </div>
            <div className="lb-xp">⚡ {u.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
