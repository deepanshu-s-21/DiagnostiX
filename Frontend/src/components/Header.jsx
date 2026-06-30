import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Sun, Moon, Globe, LogOut, Menu, X, User } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, username, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo" onClick={() => setMenuOpen(false)}>
          <Heart className="logo-icon animate-pulse" fill="#e74c3c" color="#e74c3c" size={28} />
          <span className="logo-text">{t('app_title')}</span>
        </Link>

        {/* Mobile menu toggle */}
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
                {t('dashboard')}
              </Link>
              <Link to="/assessment" className={isActive('/assessment')} onClick={() => setMenuOpen(false)}>
                {t('new_assessment')}
              </Link>
              <Link to="/history" className={isActive('/history')} onClick={() => setMenuOpen(false)}>
                {t('history')}
              </Link>
              <Link to="/contact" className={isActive('/contact')} onClick={() => setMenuOpen(false)}>
                {t('contact')}
              </Link>
              <div className="nav-user-info mobile-only">
                <span className="user-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={16} /> {username}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  <LogOut size={16} /> {t('logout')}
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>
                {t('home')}
              </Link>
              <Link to="/contact" className={isActive('/contact')} onClick={() => setMenuOpen(false)}>
                {t('contact')}
              </Link>
              <Link to="/login" className="btn btn-secondary mobile-only" onClick={() => setMenuOpen(false)}>
                {t('login')}
              </Link>
              <Link to="/signup" className="btn btn-primary mobile-only" onClick={() => setMenuOpen(false)}>
                {t('signup')}
              </Link>
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="controls">
          <div className="lang-toggle-container">
            <Globe size={18} className="lang-icon" />
            <select 
              className="lang-select" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated ? (
            <div className="desktop-only user-control">
              <span className="user-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}><User size={16} /> {username}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout} title={t('logout')}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="desktop-only auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">{t('login')}</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">{t('signup')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
