import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PlusCircle, History, Info, Heart, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { username } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="dashboard-container">
      {/* Banner */}
      <div className="dashboard-banner glass-card">
        <div className="banner-text">
          <h1>Welcome, <span className="highlight-text">{username}</span></h1>
          <p>Monitor physiological risk markers and review historical health screening trends using decision-tree classifiers.</p>
        </div>
        <div className="banner-visual">
          <Heart fill="rgba(255,255,255,0.2)" color="white" size={80} className="floating-heart" />
        </div>
      </div>

      {/* Action Cards */}
      <div className="dashboard-actions-grid">
        <div className="dashboard-card glass-card hover-glow">
          <div className="card-icon-header primary-color">
            <PlusCircle size={28} />
          </div>
          <h3>{t('new_assessment')}</h3>
          <p>Enter physical metrics and observe symptoms to calculate risk probabilities for cardiovascular, metabolic, renal, and hepatic conditions.</p>
          <Link to="/assessment" className="btn btn-primary card-cta-btn">
            Start Assessment <ArrowRight size={16} />
          </Link>
        </div>

        <div className="dashboard-card glass-card hover-glow">
          <div className="card-icon-header secondary-color">
            <History size={28} />
          </div>
          <h3>{t('history')}</h3>
          <p>Review persistent historical evaluations, track risk patterns over time, and download reference parameters for clinical consultations.</p>
          <Link to="/history" className="btn btn-secondary card-cta-btn">
            View History <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Educational Section */}
      <div className="dashboard-edu-card glass-card">
        <div className="edu-header">
          <Info size={24} color="var(--accent-primary)" />
          <h2>Understanding Physical Indicators</h2>
        </div>
        <p className="edu-intro">
          Our screening models evaluate primary physical metrics alongside symptom profiling. Here is why these indicators matter:
        </p>
        <div className="edu-grid">
          <div className="edu-item">
            <strong>Body Mass Index (BMI)</strong>
            <p>Computed from height and weight. High BMI increases renal filtration demands, places additional stress on cardiac vessels, and is heavily linked to metabolic resistance.</p>
          </div>
          <div className="edu-item">
            <strong>Age & Biological Sex</strong>
            <p>Primary demographic baselines. Biological sex influences arterial elasticity and hormone regulation, while age correlates with progressive organ wear and functional declines.</p>
          </div>
          <div className="edu-item">
            <strong>Symptom Clustering</strong>
            <p>Observing multiple related symptoms simultaneously (such as chronic swelling and constant fatigue) provides strong indicators of systemic strain, aiding in accurate risk categorization.</p>
          </div>
          <div className="edu-item">
            <strong>Early Screenings</strong>
            <p>Preliminary screenings help bridge the gap between wellness awareness and medical checkups, promoting timely interventions before conditions escalate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
