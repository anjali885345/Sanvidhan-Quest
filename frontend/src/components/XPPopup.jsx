import { useState, useEffect } from 'react';
import './XPPopup.css';

const XPPopup = ({ xp, show }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && xp > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [show, xp]);

  if (!visible) return null;

  return (
    <div className="xp-popup">
      <span className="xp-popup-icon">⚡</span>
      <span className="xp-popup-text">+{xp} XP</span>
    </div>
  );
};

export default XPPopup;
