import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModule, completeModule as completeModuleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import XPPopup from '../components/XPPopup';
import './ModuleDetail.css';

const ModuleDetail = () => {
  const { id } = useParams();
  const { updateUser, user } = useAuth();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    getModule(id).then(res => { setMod(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    try {
      const res = await completeModuleAPI(id);
      setXpGained(res.data.xpEarned);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
      setMod(prev => ({ ...prev, progress: { ...prev.progress, completed: true } }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;
  if (!mod) return <div className="empty-state"><p>Module not found</p></div>;

  const gameModes = [
    { icon: '🧠', title: 'Quiz Arena', path: `/quiz/${id}` },
    { icon: '⚖️', title: 'Scenario Court', path: `/scenario/${id}` },
    { icon: '🧩', title: 'Match Articles', path: `/match/${id}` },
    { icon: '📅', title: 'Timeline', path: `/timeline/${id}` },
    { icon: '✍️', title: 'Fill Blank', path: `/fillblank/${id}` },
    { icon: '🃏', title: 'Flash Recall', path: `/memory/${id}` },
  ];

  return (
    <div className="page-container">
      <XPPopup xp={xpGained} show={showXP} />

      <div className="module-hero animate-fade-in-up">
        <div className="module-hero-icon">{mod.icon}</div>
        <div className="module-hero-info">
          <span className="badge-pill saffron">{mod.partNumber}</span>
          <h1>{mod.title}</h1>
          <p>{mod.description}</p>
          <div className="module-hero-meta">
            <span className="badge-pill blue">{mod.difficulty}</span>
            <span className="badge-pill green">{mod.xpReward} XP</span>
            {mod.progress?.completed && <span className="badge-pill green">✅ Completed</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="module-content glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="content-body">
          {mod.content.split('\n').map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h3 key={i} className="content-heading">{para.replace(/\*\*/g, '')}</h3>;
            }
            if (para.startsWith('- ')) {
              return <li key={i} className="content-list-item">{para.slice(2).replace(/\*\*/g, '')}</li>;
            }
            return para.trim() ? <p key={i}>{para.replace(/\*\*/g, '')}</p> : <br key={i} />;
          })}
        </div>
      </div>

      {/* Articles */}
      {mod.articles?.length > 0 && (
        <div className="module-articles animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2>📜 Key Articles</h2>
          <div className="articles-grid stagger-children">
            {mod.articles.map((art, i) => (
              <div key={i} className="article-card glass-card">
                <div className="article-number">Art. {art.articleNumber}</div>
                <h4>{art.title}</h4>
                <p>{art.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun Facts */}
      {mod.funFacts?.length > 0 && (
        <div className="fun-facts animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h2>💡 Did You Know?</h2>
          <div className="facts-list">
            {mod.funFacts.map((fact, i) => (
              <div key={i} className="fact-item glass-card">
                <span className="fact-icon">✨</span>
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Button */}
      {!mod.progress?.completed && (
        <div className="complete-section animate-fade-in-up">
          <button className="btn btn-success btn-lg" onClick={handleComplete}>
            ✅ Mark as Read & Earn {mod.xpReward} XP
          </button>
        </div>
      )}

      {/* Game Modes */}
      <div className="module-games animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2>🎮 Practice & Play</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Test your knowledge with these game modes</p>
        <div className="games-grid">
          {gameModes.map((g, i) => (
            <Link to={g.path} key={i} className="game-link glass-card">
              <span className="game-link-icon">{g.icon}</span>
              <span>{g.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
