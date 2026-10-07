import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFillBlank, submitFillBlank as submitFillBlankAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Confetti from '../components/Confetti';
import XPPopup from '../components/XPPopup';
import './Games.css';

const FillPreamble = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [wordBank, setWordBank] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    getFillBlank(moduleId).then(res => {
      setChallenge(res.data);
      setUserAnswers(new Array(res.data.blanks.length).fill(''));
      setWordBank([...res.data.wordBank].sort(() => Math.random() - 0.5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [moduleId]);

  const handleWordClick = (word) => {
    const firstEmpty = userAnswers.findIndex(a => a === '');
    if (firstEmpty === -1) return;
    const newAnswers = [...userAnswers];
    newAnswers[firstEmpty] = word;
    setUserAnswers(newAnswers);
    setWordBank(wordBank.filter((_, i) => i !== wordBank.indexOf(word)));
  };

  const handleBlankClick = (idx) => {
    if (userAnswers[idx] === '') return;
    setWordBank([...wordBank, userAnswers[idx]]);
    const newAnswers = [...userAnswers];
    newAnswers[idx] = '';
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await submitFillBlankAPI(challenge._id, userAnswers);
      setResult(res.data);
      if (res.data.score === 100) setConfetti(true);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;
  if (!challenge) return <div className="empty-state"><div className="empty-icon">✍️</div><p>No fill-the-blank challenge available</p><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  if (result) {
    return (
      <div className="page-container">
        <Confetti active={confetti} /><XPPopup xp={result.xpEarned} show={showXP} />
        <div className="quiz-result animate-bounce-in">
          <div className="result-icon">✍️</div><h1>Challenge Complete!</h1>
          <div className="result-score"><span className="score-number">{result.score}%</span><span className="score-label">{result.correct}/{result.total} correct</span></div>
          <div className="result-xp">⚡ +{result.xpEarned} XP</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // Render text with blanks
  const renderText = () => {
    const parts = challenge.fullText.split(/___(\d+)___/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const blankIdx = parseInt(part);
        return (
          <span key={i} className={`fill-blank-slot ${userAnswers[blankIdx] ? 'filled' : ''}`} onClick={() => handleBlankClick(blankIdx)}>
            {userAnswers[blankIdx] || `____`}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="page-container">
      <div className="game-page-header animate-fade-in-down"><h1>✍️ {challenge.title}</h1></div>
      <div className="fill-text glass-card animate-fade-in-up">{renderText()}</div>
      <div className="word-bank animate-fade-in-up">
        <h3>Word Bank</h3>
        <div className="word-bank-items">
          {wordBank.map((word, i) => (
            <button key={i} className="word-chip" onClick={() => handleWordClick(word)}>{word}</button>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={userAnswers.some(a => a === '')}>Submit Answers ✅</button>
      </div>
    </div>
  );
};

export default FillPreamble;
