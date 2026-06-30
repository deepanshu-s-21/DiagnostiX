import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Clipboard, Loader2, Calendar, ChevronRight, X, Heart, Activity, Filter, Shield } from 'lucide-react';

export default function History() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setHistory(data.history || []);
      } else {
        setError(data.error || 'Failed to load assessment history');
      }
    } catch (err) {
      setError('Network error. Unable to connect to the Flask server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskClass = (level) => {
    return `risk-badge ${level.toLowerCase()}`;
  };

  const getDiseaseIcon = (disease) => {
    const norm = (disease || 'Heart Disease').toLowerCase();
    if (norm.includes('diabetes')) return Activity;
    if (norm.includes('kidney')) return Filter;
    if (norm.includes('liver')) return Shield;
    return Heart;
  };

  const renderModalDetails = (item) => {
    if (!item.inputs) return null;
    const inputs = item.inputs;
    
    // Find all active symptoms (value === 1)
    const activeSymptoms = Object.keys(inputs).filter(key => 
      !['age', 'sex', 'bmi', 'height', 'weight', 'disease_type'].includes(key) && inputs[key] === 1
    );

    const getSymptomTranslation = (key) => {
      const simpleKey = `${key}_simple`;
      const trans = t(simpleKey);
      if (trans !== simpleKey) return trans;
      return t(key);
    };

    return (
      <div className="modal-details-grid">
        <h4>1. Patient Details</h4>
        <div className="details-subgrid columns-3" style={{ marginBottom: '1.5rem' }}>
          <div className="detail-field">
            <span>Age</span>
            <strong>{inputs.age || '--'} yrs</strong>
          </div>
          <div className="detail-field">
            <span>Sex</span>
            <strong>{inputs.sex === 1 ? 'Male' : 'Female'}</strong>
          </div>
          <div className="detail-field">
            <span>Height / Weight</span>
            <strong>{inputs.height || '--'} cm / {inputs.weight || '--'} kg</strong>
          </div>
          <div className="detail-field">
            <span>Calculated BMI</span>
            <strong>{inputs.bmi || '--'} kg/m²</strong>
          </div>
        </div>

        <h4>2. Selected Symptoms Logged</h4>
        {activeSymptoms.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No symptoms selected.</p>
        ) : (
          <div className="selected-items-list" style={{ marginTop: '0.5rem' }}>
            {activeSymptoms.map(symId => (
              <div key={symId} className="selected-symptom-badge" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                <span className="badge-val" style={{ fontWeight: '600' }}>{getSymptomTranslation(symId)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="history-container">
      <h1 className="page-title">{t('assessment_history')}</h1>
      <p className="page-subtitle">{t('view_previous')}</p>

      {loading ? (
        <div className="history-loader">
          <Loader2 className="animate-spin" size={40} color="var(--accent-primary)" />
          <p>Loading history records...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={fetchHistory} className="btn btn-secondary btn-sm" style={{ marginLeft: '1rem' }}>Retry</button>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-history glass-card">
          <Clipboard size={64} className="empty-icon" />
          <h3>{t('no_assessments')}</h3>
          <p>{t('start_new')}</p>
          <a href="/assessment" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Start New Assessment</a>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => {
            const IconComp = getDiseaseIcon(item.disease_type);
            return (
              <div 
                key={index} 
                className="history-item-card glass-card hover-glow" 
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-main-info">
                  <div className="disease-badge-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', padding: '8px', borderRadius: '8px', color: 'var(--accent-primary)', marginRight: '0.75rem' }}>
                    <IconComp size={20} />
                  </div>
                  <div className="time-info">
                    <strong>{item.disease_type || 'Heart Disease'}</strong>
                    <span className="timestamp">{formatDate(item.timestamp)}</span>
                  </div>
                </div>

              <div className="item-result-info">
                <div className="pct-info">
                  <span className="val-lbl">Risk Probability</span>
                  <strong className="val-score">{Math.round(item.risk_percentage)}%</strong>
                </div>
                <div className={getRiskClass(item.risk_level)}>
                  {item.risk_level} Risk
                </div>
                <ChevronRight size={18} className="chevron-icon" />
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content glass-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItem.disease_type || 'Heart Disease'} Assessment Details</h3>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section-banner">
                <div className="modal-score-block">
                  <span className="lbl">Risk Percentage</span>
                  <span className="val">{Math.round(selectedItem.risk_percentage)}%</span>
                </div>
                <div className={`modal-status-badge ${selectedItem.risk_level.toLowerCase()}`}>
                  {selectedItem.risk_level} Risk
                </div>
              </div>

              {renderModalDetails(selectedItem)}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedItem(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
