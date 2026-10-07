import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Confetti from '../components/Confetti';
import XPPopup from '../components/XPPopup';
import './Games.css';

const QuizArena = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    getQuiz(moduleId).then(res => {
      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(-1));
      setTimeLeft(res.data.timeLimit);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [moduleId]);

  useEffect(() => {
    if (!quiz || showResult || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, showResult]);

  const handleSelect = (optIdx) => {
    if (feedback) return;
    setSelected(optIdx);
    const isCorrect = optIdx === quiz.questions[current].correctAnswer;
    setFeedback({ isCorrect, explanation: quiz.questions[current].explanation });
    const newAnswers = [...answers];
    newAnswers[current] = optIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await submitQuiz(quiz._id, answers);
      setResult(res.data);
      setShowResult(true);
      if (res.data.score === 100) setConfetti(true);
      setShowXP(true);
      updateUser({ xp: res.data.totalXp, level: res.data.level });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div><p>Loading quiz...</p></div>;
  if (!quiz) return <div className="empty-state"><div className="empty-icon">🧠</div><p>No quiz available for this module yet</p><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  if (showResult) {
    return (
      <div className="page-container">
        <Confetti active={confetti} />
        <XPPopup xp={result?.xpEarned} show={showXP} />
        <div className="quiz-result animate-bounce-in">
          <div className="result-icon">{result.score === 100 ? '🏆' : result.score >= 70 ? '🎉' : '📚'}</div>
          <h1>Quiz Complete!</h1>
          <div className="result-score">
            <span className="score-number">{result.score}%</span>
            <span className="score-label">{result.correct}/{result.total} correct</span>
          </div>
          <div className="result-xp">⚡ +{result.xpEarned} XP earned</div>
          <div className="result-details">
            {result.results?.map((r, i) => (
              <div key={i} className={`result-item glass-card ${r.isCorrect ? 'correct' : 'wrong'}`}>
                <div className="result-q">{r.isCorrect ? '✅' : '❌'} {r.question}</div>
                <p className="result-explanation">{r.explanation}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back to Module</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz.questions[current];

  return (
    <div className="page-container">
      <div className="quiz-header animate-fade-in-down">
        <div className="quiz-progress">
          <span>Question {current + 1}/{quiz.questions.length}</span>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className={`quiz-timer ${timeLeft < 30 ? 'urgent' : ''}`}>
          ⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="quiz-question animate-fade-in-up">
        <h2>{q.question}</h2>
      </div>

      <div className="quiz-options stagger-children">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option glass-card ${selected === i ? 'selected' : ''} ${feedback && i === q.correctAnswer ? 'correct' : ''} ${feedback && selected === i && !feedback.isCorrect ? 'wrong' : ''}`}
            onClick={() => handleSelect(i)}
            disabled={!!feedback}
          >
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{opt}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`quiz-feedback animate-fade-in-up ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
          <p><strong>{feedback.isCorrect ? '✅ Correct!' : '❌ Wrong!'}</strong></p>
          <p>{feedback.explanation}</p>
          <button className="btn btn-primary" onClick={handleNext}>
            {current < quiz.questions.length - 1 ? 'Next Question →' : 'See Results 🎯'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizArena;
