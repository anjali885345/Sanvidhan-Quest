import { useState, useEffect } from 'react';
import { getBadges } from '../services/api';
import './BadgeGallery.css';

const BadgeGallery = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBadges().then(res => { setBadges(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="chakra-spinner"></div></div>;

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="page-container">
      <div className="section-header animate-fade-in-up">
        <h2>🏅 Badge Gallery</h2>
        <p>{earned.length} of {badges.length} badges earned</p>
      </div>

      {earned.length > 0 && (
        <>
          <h3 className="gallery-subtitle animate-fade-in-up">✨ Earned</h3>
          <div className="badge-grid stagger-children">
            {earned.map((b) => (
              <div key={b.badgeId} className="badge-gallery-card glass-card earned">
                <span className="badge-lg-icon">{b.icon}</span>
                <h4>{b.name}</h4>
                <p>{b.description}</p>
                <span className="badge-pill green">+{b.xpBonus} XP Bonus</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="gallery-subtitle animate-fade-in-up" style={{ marginTop: '32px' }}>🔒 Locked</h3>
      <div className="badge-grid stagger-children">
        {locked.map((b) => (
          <div key={b.badgeId} className="badge-gallery-card glass-card locked-badge">
            <span className="badge-lg-icon">{b.icon}</span>
            <h4>{b.name}</h4>
            <p>{b.description}</p>
            <span className="badge-pill blue">+{b.xpBonus} XP Bonus</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeGallery;
