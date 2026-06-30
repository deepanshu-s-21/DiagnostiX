import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Brain, Shield, Zap, Monitor, Globe, BarChart, ChevronRight, Activity } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <div className="badge-wrapper animate-fade-in">
            <span className="premium-badge">AI-Powered Risk Assessment</span>
          </div>
          <h1 className="hero-title animate-slide-up">
            {t('app_title')} <span className="highlight-text">Multi-Screening</span>
          </h1>
          <p className="hero-subtitle animate-slide-up-delayed">
            Preliminary health screenings driven by decision-tree classifiers
          </p>
          <p className="hero-description animate-slide-up-delayed">
            Evaluate your risk profiles for cardiovascular, metabolic, renal, and hepatic disorders. Our platform utilizes trained Random Forest algorithms to analyze self-reported symptom patterns and physical metrics.
          </p>
          <div className="hero-buttons animate-fade-in-delayed">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <ChevronRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  {t('login')}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card vital-widget">
            <div className="widget-header">
              <Activity color="var(--accent-primary)" size={24} className="animate-pulse" />
              <span>Diagnostic Core</span>
            </div>
            <div className="vital-stats">
              <div className="vital-item">
                <span className="vital-lbl">Average Accuracy</span>
                <span className="vital-val">91.0%</span>
              </div>
              <div className="vital-item">
                <span className="vital-lbl">Framework</span>
                <span className="vital-val">Random Forest</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section features-section">
        <h2 className="section-title">Why Choose DiagnostiX?</h2>
        <p className="section-subtitle">
          Advanced statistical modeling engineered to support early awareness and proactive clinical consultations.
        </p>

        <div className="features-grid">
          <div className="feature-card-premium">
            <div className="feature-icon-wrapper brain-color">
              <Brain size={24} />
            </div>
            <h3>Supervised Classifiers</h3>
            <p>Predictive engines built using ensembles of decision trees, optimized to calculate risk probability scores from non-invasive data.</p>
          </div>

          <div className="feature-card-premium">
            <div className="feature-icon-wrapper shield-color">
              <Shield size={24} />
            </div>
            <h3>Data Privacy</h3>
            <p>Industry-standard JWT authorization and secure SQLite storage protocols safeguard your diagnostic history locally.</p>
          </div>

          <div className="feature-card-premium">
            <div className="feature-icon-wrapper zap-color">
              <Zap size={24} />
            </div>
            <h3>Immediate Insights</h3>
            <p>Process your symptoms checklist and physical indicators instantly to generate clear wellness guidelines and severity levels.</p>
          </div>

          <div className="feature-card-premium">
            <div className="feature-icon-wrapper monitor-color">
              <Monitor size={24} />
            </div>
            <h3>Sleek Dashboard</h3>
            <p>Fully responsive CSS configurations optimized across viewport sizes, with interactive theme settings.</p>
          </div>

          <div className="feature-card-premium">
            <div className="feature-icon-wrapper globe-color">
              <Globe size={24} />
            </div>
            <h3>Bilingual Support</h3>
            <p>Seamlessly toggle interface translations between English and Hindi to accommodate diverse user preferences.</p>
          </div>

          <div className="feature-card-premium">
            <div className="feature-icon-wrapper chart-color">
              <BarChart size={24} />
            </div>
            <h3>Historical Tracking</h3>
            <p>Log physical indices over time to identify physiological trends and facilitate informed conversations with physicians.</p>
          </div>
        </div>
      </section>

      {/* Stats Showcase */}
      <section className="section stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">91%</span>
            <span className="stat-label">Model Accuracy</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Simulated Tests</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">System Availability</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">4</span>
            <span className="stat-label">Major Diseases</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section how-it-works-section">
        <h2 className="section-title">Evaluation Workflow</h2>
        <p className="section-subtitle">A simple four-step process to evaluate early physiological risk indicators.</p>

        <div className="workflow-grid">
          <div className="workflow-step">
            <div className="step-num">1</div>
            <h3>User Registration</h3>
            <p>Establish a secure personal account to save diagnostic records and protect history data.</p>
          </div>
          <div className="workflow-step">
            <div className="step-num">2</div>
            <h3>Physical Indicators</h3>
            <p>Input basic indicators including age, biological sex, height, and weight to determine BMI.</p>
          </div>
          <div className="workflow-step">
            <div className="step-num">3</div>
            <h3>Symptom Profiling</h3>
            <p>Add observed symptom characteristics into the active checklist box.</p>
          </div>
          <div className="workflow-step">
            <div className="step-num">4</div>
            <h3>Risk Report</h3>
            <p>Obtain an instant probability report including severity ranges and clinical next-steps.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta-section">
        <div className="cta-box glass-card">
          <h2>Begin Your Screening</h2>
          <p>Access preliminary disease risk profiling instantly. The evaluation takes less than two minutes.</p>
          <div className="cta-actions">
            {isAuthenticated ? (
              <Link to="/assessment" className="btn btn-primary btn-lg">
                Start Assessment
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
