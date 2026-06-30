import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Heart fill="#e74c3c" color="#e74c3c" size={20} />
            <span>{t('app_title')}</span>
          </div>
          <p className="footer-tagline">{t('app_subtitle')}</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4>Navigation</h4>
            <Link to="/">{t('home')}</Link>
            <Link to="/contact">{t('contact')}</Link>
          </div>
          <div className="footer-links-col">
            <h4>Health Resources</h4>
            <a href="https://www.who.int/health-topics/cardiovascular-diseases" target="_blank" rel="noopener noreferrer">WHO Cardiovascular Info</a>
            <a href="https://www.heart.org/" target="_blank" rel="noopener noreferrer">American Heart Association</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DiagnostiX. All rights reserved.</p>
      </div>
    </footer>
  );
}
