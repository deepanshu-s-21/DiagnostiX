import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, User, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const { t } = useLanguage();
  const [usernameInput, setUsernameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usernameInput, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: 'Registration successful! Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setAlert({ type: 'error', message: data.error || 'Registration failed' });
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
        <h2 className="auth-title">{t('signup')}</h2>
        <p className="auth-subtitle">Create a free account to track your heart health assessments</p>

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
                placeholder="Choose a username" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address" 
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
                placeholder="Choose a strong password" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : t('signup')}
          </button>
        </form>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">{t('login')}</Link>
        </p>

        <p className="auth-back-link">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
