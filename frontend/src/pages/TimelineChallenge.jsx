import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTimeline, submitTimeline as submitTimelineAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Confetti from '../components/Confetti';
import XPPopup from '../components/XPPopup';
import './Games.css';

const TimelineChallenge = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [events, setEvents] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  useEffect(() => {
    getTimeline(moduleId).then(res => {
      setChallenge(res.data);
      setEvents([...res.data.events].sort(() => Math.random() - 0.5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [moduleId]);

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (dropIdx) => {
    if (dragIdx === null || dragIdx === dropIdx) return;
    const newEvents = [...events];
    const [moved] = newEvents.splice(dragIdx, 1);
    newEvents.splice(dropIdx, 0, moved);
    setEvents(newEvents);
    setDragIdx(null);
  };

  const handleSubmit = async () => {
    const userOrder = events.map((_, i) => i + 1);
    try {
      const res = await submitTimelineAPI(challenge._id, userOrder.map((_, i) => events[i].correctOrder));
      setResult(res.data);
      if (res.data.score === 100) setConfetti(true);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;
  if (!challenge) return <div className="empty-state"><div className="empty-icon">📅</div><p>No timeline challenge available</p><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  if (result) {
    return (
      <div className="page-container">
        <Confetti active={confetti} /><XPPopup xp={result.xpEarned} show={showXP} />
        <div className="quiz-result animate-bounce-in">
          <div className="result-icon">📅</div><h1>Timeline Complete!</h1>
          <div className="result-score"><span className="score-number">{result.score}%</span><span className="score-label">{result.correct}/{result.total} correct</span></div>
          <div className="result-xp">⚡ +{result.xpEarned} XP</div>
          <div className="timeline-reveal">
            {challenge.events.sort((a, b) => a.correctOrder - b.correctOrder).map((ev, i) => (
              <div key={i} className="timeline-reveal-item glass-card"><span className="timeline-year">{ev.year}</span><span>{ev.title}</span></div>
            ))}
          </div>
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
      <div className="game-page-header animate-fade-in-down"><h1>📅 Timeline Challenge</h1></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>Drag and reorder these events from earliest to latest</p>
      <div className="timeline-list stagger-children">
        {events.map((ev, i) => (
          <div key={i} className="timeline-item glass-card"
            draggable onDragStart={() => handleDragStart(i)} onDragOver={handleDragOver} onDrop={() => handleDrop(i)}
          >
            <span className="timeline-drag">⠿</span>
            <div className="timeline-content"><h4>{ev.title}</h4><p>{ev.description}</p></div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button className="btn btn-success btn-lg" onClick={handleSubmit}>Check Order ✅</button>
      </div>
    </div>
  );
};

export default TimelineChallenge;
