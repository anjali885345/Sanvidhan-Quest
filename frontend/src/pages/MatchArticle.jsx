import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, submitMatch as submitMatchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Confetti from '../components/Confetti';
import XPPopup from '../components/XPPopup';
import './Games.css';

const MatchArticle = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [articles, setArticles] = useState([]);
  const [provisions, setProvisions] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [matches, setMatches] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    getMatch(moduleId).then(res => {
      setChallenge(res.data);
      setArticles(res.data.pairs.map(p => p.article));
      setProvisions([...res.data.pairs.map(p => p.provision)].sort(() => Math.random() - 0.5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [moduleId]);

  const handleArticleClick = (art) => {
    if (matches.find(m => m.article === art)) return;
    setSelectedArticle(art);
    setWrongPair(null);
  };

  const handleProvisionClick = (prov) => {
    if (!selectedArticle || matches.find(m => m.provision === prov)) return;
    const correct = challenge.pairs.find(p => p.article === selectedArticle && p.provision === prov);
    if (correct) {
      setMatches([...matches, { article: selectedArticle, provision: prov }]);
      setSelectedArticle(null);
      if (matches.length + 1 === challenge.pairs.length) finishGame([...matches, { article: selectedArticle, provision: prov }]);
    } else {
      setWrongPair({ article: selectedArticle, provision: prov });
      setTimeout(() => { setWrongPair(null); setSelectedArticle(null); }, 800);
    }
  };

  const finishGame = async (finalMatches) => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await submitMatchAPI(challenge._id, { userPairs: finalMatches, timeTaken });
      setResult(res.data);
      if (res.data.score === 100) setConfetti(true);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;
  if (!challenge) return <div className="empty-state"><div className="empty-icon">🧩</div><p>No match challenge available</p><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  if (result) {
    return (
      <div className="page-container">
        <Confetti active={confetti} />
        <XPPopup xp={result.xpEarned} show={showXP} />
        <div className="quiz-result animate-bounce-in">
          <div className="result-icon">🧩</div>
          <h1>Match Complete!</h1>
          <div className="result-score"><span className="score-number">{result.score}%</span><span className="score-label">{result.correct}/{result.total} matched</span></div>
          <div className="result-xp">⚡ +{result.xpEarned} XP {result.speedBonus > 0 && `(+${result.speedBonus} speed bonus!)`}</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="game-page-header animate-fade-in-down">
        <h1>🧩 Match the Article</h1>
        <span className="badge-pill green">{matches.length}/{challenge.pairs.length} matched</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>Click an article, then click its matching provision</p>

      <div className="match-grid">
        <div className="match-column">
          <h3 className="match-col-title">Articles</h3>
          {articles.map((art, i) => (
            <button key={i}
              className={`match-item glass-card ${selectedArticle === art ? 'selected' : ''} ${matches.find(m => m.article === art) ? 'matched' : ''} ${wrongPair?.article === art ? 'animate-shake wrong' : ''}`}
              onClick={() => handleArticleClick(art)}
              disabled={!!matches.find(m => m.article === art)}
            >{art}</button>
          ))}
        </div>
        <div className="match-column">
          <h3 className="match-col-title">Provisions</h3>
          {provisions.map((prov, i) => (
            <button key={i}
              className={`match-item glass-card ${matches.find(m => m.provision === prov) ? 'matched' : ''} ${wrongPair?.provision === prov ? 'animate-shake wrong' : ''}`}
              onClick={() => handleProvisionClick(prov)}
              disabled={!!matches.find(m => m.provision === prov)}
            >{prov}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchArticle;
