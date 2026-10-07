import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <span className="brand-icon">🇮🇳</span>
          <span className="brand-text">SamvidhanQuest</span>
        </Link>
      </div>

      <div className="navbar-stats">
        <div className="stat-chip xp-chip">
          <span className="stat-icon">⚡</span>
          <span>{user.xp || 0} XP</span>
        </div>
        <div className="stat-chip streak-chip">
          <span className="stat-icon">🔥</span>
          <span>{user.streak || 0}</span>
        </div>
        <div className="stat-chip level-chip">
          <span className="stat-icon">🎖️</span>
          <span>Lvl {user.level || 1}</span>
        </div>
      </div>

      <div className="navbar-user">
        <Link to="/profile" className="user-avatar-link">
          <div className="user-avatar">{user.username?.[0]?.toUpperCase() || '?'}</div>
          <span className="user-name">{user.username}</span>
        </Link>
        <button className="btn btn-sm btn-secondary" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
