import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">🗺️</span>
          <span className="brand-text">TripVault</span>
        </Link>

        <button
          type="button"
          className={`hamburger-btn ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
              {user.username && (
                <Link to={`/profile/${user.username}`} onClick={closeMenu}>
                  My Profile
                </Link>
              )}
              <button type="button" className="btn btn-secondary nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-register-btn" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
