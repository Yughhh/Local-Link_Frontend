import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiUsers, FiPercent, FiHeart, FiUser, FiBell, FiMenu, FiX, FiBriefcase, FiInfo, FiPhoneCall, FiLogIn, FiLogOut, FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { locationsList } from '../../data/dummyData';
import logoImg from '../../assets/images/LocalLinkLogo.png';
import defaultAvatarImg from '../../assets/images/NoProfilePicture.png';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Lucknow, UP");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <>
      {/* Top Header Navbar */}
      <header className="navbar-header glass">
        <div className="navbar-container container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu} title="LocalLink India">
            <img src={logoImg} alt="LocalLink Logo" className="navbar-logo-image" />
          </Link>

          {/* Location Selector for Indian Cities */}
          <div className="navbar-location">
            <FiMapPin className="nav-pin-icon" />
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Nav Links */}
          <nav className={`navbar-nav-desktop ${isOpen ? 'active' : ''}`}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiHome /> Home
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiBriefcase /> Services
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiInfo /> About Us
            </NavLink>
            <NavLink to="/nearby" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiMapPin /> Nearby Pros
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiPhoneCall /> Contact
            </NavLink>
            <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiUsers /> Forum
            </NavLink>
            <NavLink to="/offers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <FiPercent /> Offers
            </NavLink>
            {(!isAuthenticated || user?.role === 'provider') && (
              <NavLink to="/become-provider" className={({ isActive }) => `nav-link nav-provider-highlight ${isActive ? 'active' : ''}`} onClick={closeMenu} title="Register as Local Service Provider">
                <FiPlusCircle /> Become a Provider
              </NavLink>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <button className="nav-action-btn notification-btn" title="Notifications">
                  <FiBell />
                  <span className="notification-badge"></span>
                </button>

                <div className="nav-profile-image" onClick={handleProfileClick} title="My Profile">
                  <img src={user?.avatar || defaultAvatarImg} alt="Profile" />
                </div>
              </>
            ) : (
              <Link to="/login" className="nav-login-btn" title="Sign In" onClick={closeMenu}>
                <FiLogIn />
                <span>Sign In</span>
              </Link>
            )}

            <button className="nav-action-btn hamburger-menu" onClick={toggleMenu} title="Toggle Menu">
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu} />
      )}

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="mobile-drawer active glass">
          <nav className="mobile-drawer-nav">
            <NavLink to="/" className="drawer-link" onClick={closeMenu}>
              <FiHome /> Home
            </NavLink>
            <NavLink to="/services" className="drawer-link" onClick={closeMenu}>
              <FiBriefcase /> All Services
            </NavLink>
            <NavLink to="/about" className="drawer-link" onClick={closeMenu}>
              <FiInfo /> About Us
            </NavLink>
            <NavLink to="/nearby" className="drawer-link" onClick={closeMenu}>
              <FiMapPin /> Nearby Workers
            </NavLink>
            <NavLink to="/contact" className="drawer-link" onClick={closeMenu}>
              <FiPhoneCall /> Contact Us
            </NavLink>
            <NavLink to="/community" className="drawer-link" onClick={closeMenu}>
              <FiUsers /> Community Forum
            </NavLink>
            <NavLink to="/offers" className="drawer-link" onClick={closeMenu}>
              <FiPercent /> Special Offers
            </NavLink>
            {(!isAuthenticated || user?.role === 'provider') && (
              <NavLink to="/become-provider" className="drawer-link drawer-provider-highlight" onClick={closeMenu}>
                <FiPlusCircle /> Become a Provider
              </NavLink>
            )}
            <NavLink to="/favorites" className="drawer-link" onClick={closeMenu}>
              <FiHeart /> Saved Favorites
            </NavLink>

            {isAuthenticated ? (
              <>
                {user?.role === 'provider' || user?.role === 'admin' ? (
                  <NavLink to="/provider-dashboard" className="drawer-link" onClick={closeMenu}>
                    <FiBriefcase /> Provider Dashboard
                  </NavLink>
                ) : null}
                <NavLink to="/profile" className="drawer-link" onClick={closeMenu}>
                  <FiUser /> Profile ({user?.name || 'User'})
                </NavLink>
                <button className="drawer-link drawer-logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="drawer-link" onClick={closeMenu}>
                  <FiLogIn /> Sign In
                </NavLink>
                <NavLink to="/register" className="drawer-link" onClick={closeMenu}>
                  <FiUser /> Create Account
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <nav className="mobile-bottom-nav glass">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          <FiHome className="bottom-nav-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          <FiBriefcase className="bottom-nav-icon" />
          <span>Services</span>
        </NavLink>
        <NavLink to="/nearby" className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          <FiMapPin className="bottom-nav-icon" />
          <span>Nearby</span>
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          <FiUsers className="bottom-nav-icon" />
          <span>Forum</span>
        </NavLink>
        <NavLink to={isAuthenticated ? "/profile" : "/login"} className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          <FiUser className="bottom-nav-icon" />
          <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
        </NavLink>
      </nav>
    </>
  );
}

export default Navbar;
