import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const links = [
    { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/learn', icon: '🗺️', label: 'Learning Map' },
    { to: '/daily', icon: '🌟', label: 'Daily Challenge' },
    { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { to: '/badges', icon: '🏅', label: 'Badges' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-xp">
        <div className="xp-label">
          <span>Level {user.level || 1}</span>
          <span>{user.xp || 0} / {((user.level || 1) * 500)} XP</span>
        </div>
        <div className="xp-bar-track">
          <div
            className="xp-bar-fill"
            style={{ width: `${((user.xp || 0) % 500) / 5}%` }}
          ></div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-tricolor">
          <div className="tricolor-band saffron-band"></div>
          <div className="tricolor-band white-band"></div>
          <div className="tricolor-band green-band"></div>
        </div>
        <p className="sidebar-quote">"Be the change you wish to see"</p>
      </div>
    </aside>
  );
};

export default Sidebar;
