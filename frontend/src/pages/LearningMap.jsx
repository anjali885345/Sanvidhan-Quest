import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getModules } from '../services/api';
import './LearningMap.css';

const LearningMap = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModules().then(res => { setModules(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div><p>Loading the map...</p></div>;

  return (
    <div className="page-container">
      <div className="section-header animate-fade-in-up">
        <h2>🗺️ Constitution Learning Map</h2>
        <p>Your journey through the Indian Constitution — master each Part to unlock the next!</p>
      </div>

      <div className="learning-path stagger-children">
        {modules.map((mod, i) => {
          const isCompleted = mod.progress?.completed;
          const isUnlocked = i === 0 || modules[i - 1]?.progress?.completed;
          return (
            <div key={mod._id} className="path-node-wrapper">
              {i > 0 && (
                <div className={`path-connector ${isCompleted ? 'completed' : ''}`}>
                  <div className="connector-line"></div>
                </div>
              )}
              <Link
                to={isUnlocked ? `/module/${mod._id}` : '#'}
                className={`path-node glass-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''} ${isUnlocked && !isCompleted ? 'current' : ''}`}
                onClick={(e) => !isUnlocked && e.preventDefault()}
              >
                <div className="node-number">{i + 1}</div>
                <div className="node-icon">{isCompleted ? '✅' : !isUnlocked ? '🔒' : mod.icon}</div>
                <div className="node-info">
                  <h3>{mod.title}</h3>
                  <p>{mod.partNumber}</p>
                  <div className="node-meta">
                    <span className="badge-pill saffron">{mod.xpReward} XP</span>
                    <span className="badge-pill blue">{mod.difficulty}</span>
                  </div>
                </div>
                {isUnlocked && !isCompleted && <span className="node-arrow">→</span>}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="map-legend">
        <div className="legend-item"><span className="legend-dot current-dot"></span> Current</div>
        <div className="legend-item"><span className="legend-dot completed-dot"></span> Completed</div>
        <div className="legend-item"><span className="legend-dot locked-dot"></span> Locked</div>
      </div>
    </div>
  );
};

export default LearningMap;
