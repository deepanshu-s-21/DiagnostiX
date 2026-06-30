import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usernameInput, password })
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
        login(data.token, data.username);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setAlert({ type: 'error', message: data.error || 'Login failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please check if Flask backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">{t('login')}</h2>
        <p className="auth-subtitle">{t('app_subtitle')}</p>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('username')}</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : t('login')}
          </button>
        </form>

        <p className="auth-switch-text">
          Don't have an account? <Link to="/signup">{t('signup')}</Link>
        </p>

        <p className="auth-back-link">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
