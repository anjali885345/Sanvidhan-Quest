import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScenarios, submitScenario } from '../services/api';
import { useAuth } from '../context/AuthContext';
import XPPopup from '../components/XPPopup';
import './Games.css';

const ScenarioCourt = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [scenarios, setScenarios] = useState([]);
  const [current, setCurrent] = useState(0);
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    getScenarios(moduleId).then(res => { setScenarios(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [moduleId]);

  const handleChoice = async (index) => {
    try {
      const res = await submitScenario(scenarios[current]._id, index);
      setOutcome(res.data);
      setXpGained(res.data.xpEarned);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    if (current < scenarios.length - 1) {
      setCurrent(c => c + 1);
      setOutcome(null);
      setShowXP(false);
    } else {
      navigate(-1);
    }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;
  if (!scenarios.length) return <div className="empty-state"><div className="empty-icon">⚖️</div><p>No scenarios available for this module yet</p><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  const sc = scenarios[current];

  return (
    <div className="page-container">
      <XPPopup xp={xpGained} show={showXP} />

      <div className="game-page-header animate-fade-in-down">
        <h1>⚖️ Scenario Court</h1>
        <span className="badge-pill saffron">Case {current + 1}/{scenarios.length}</span>
      </div>

      <div className="scenario-card glass-card animate-fade-in-up">
        <div className="scenario-role">
          <span className="role-badge">{sc.role === 'Judge' ? '👨‍⚖️' : sc.role === 'Citizen' ? '🧑' : '🏛️'}</span>
          <span>Playing as: <strong>{sc.role}</strong></span>
        </div>
        <h2>{sc.title}</h2>
        <p className="scenario-situation">{sc.situation}</p>

        {!outcome ? (
          <div className="scenario-choices stagger-children">
            {sc.choices.map((choice, i) => (
              <button key={i} className="scenario-choice glass-card" onClick={() => handleChoice(i)}>
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                <span>{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={`scenario-outcome animate-fade-in-up ${outcome.isCorrect ? 'correct' : 'wrong'}`}>
            <div className="outcome-header">
              <span className="outcome-icon">{outcome.isCorrect ? '✅' : '❌'}</span>
              <h3>{outcome.isCorrect ? 'Justice Served!' : 'Not quite right...'}</h3>
            </div>
            <p className="outcome-text">{outcome.outcome}</p>
            {outcome.articleRef && <p className="outcome-article">Key Article: <strong>{outcome.articleRef}</strong></p>}
            <p className="outcome-xp">⚡ +{outcome.xpEarned} XP</p>
            <button className="btn btn-primary" onClick={handleNext}>
              {current < scenarios.length - 1 ? 'Next Case →' : 'Finish Cases'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioCourt;
