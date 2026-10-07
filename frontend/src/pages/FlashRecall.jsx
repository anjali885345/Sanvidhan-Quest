import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemory, submitMemory as submitMemoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Confetti from '../components/Confetti';
import XPPopup from '../components/XPPopup';
import './Games.css';

const FlashRecall = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getMemory(moduleId).then(res => {
      setChallenge(res.data);
      const allCards = [];
      res.data.pairs.forEach((p, i) => {
        allCards.push({ id: i * 2, pairId: i, text: p.front, type: 'front' });
        allCards.push({ id: i * 2 + 1, pairId: i, text: p.back, type: 'back' });
      });
      setCards(allCards.sort(() => Math.random() - 0.5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [moduleId]);

  const handleFlip = (idx) => {
    if (disabled || flipped.includes(idx) || matched.includes(cards[idx].pairId)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setDisabled(true);
      const [first, second] = newFlipped;
      if (cards[first].pairId === cards[second].pairId) {
        const newMatched = [...matched, cards[first].pairId];
        setMatched(newMatched);
        setFlipped([]);
        setDisabled(false);
        if (newMatched.length === challenge.pairs.length) finishGame(newMatched.length);
      } else {
        setTimeout(() => { setFlipped([]); setDisabled(false); }, 1000);
      }
    }
  };

  const finishGame = async () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await submitMemoryAPI(challenge._id, { timeTaken, moves });
      setResult(res.data);
      setConfetti(true);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;
  if (!challenge) return <div className="empty-state"><div className="empty-icon">🃏</div><p>No memory challenge available</p><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  if (result) {
    return (
      <div className="page-container">
        <Confetti active={confetti} /><XPPopup xp={result.xpEarned} show={showXP} />
        <div className="quiz-result animate-bounce-in">
          <div className="result-icon">🃏</div><h1>Memory Challenge Complete!</h1>
          <div className="result-score"><span className="score-number">{moves}</span><span className="score-label">moves</span></div>
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
        <h1>🃏 Flash Recall</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge-pill saffron">Moves: {moves}</span>
          <span className="badge-pill green">{matched.length}/{challenge.pairs.length} found</span>
        </div>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>Find matching pairs — click two cards to flip them!</p>
      <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)` }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx);
          const isMatched = matched.includes(card.pairId);
          return (
            <div key={card.id} className={`memory-card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} onClick={() => handleFlip(idx)}>
              <div className="memory-card-inner">
                <div className="memory-card-front">🇮🇳</div>
                <div className="memory-card-back"><span>{card.text}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashRecall;
