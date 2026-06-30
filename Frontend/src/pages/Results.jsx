import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, CheckCircle, Info, ArrowLeft, RefreshCw, Check } from 'lucide-react';

export default function Results() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const cached = localStorage.getItem('lastResult');
    if (!cached) {
      navigate('/dashboard');
      return;
    }
    const parsed = JSON.parse(cached);
    setResult(parsed);

    // Animate the risk percentage
    const target = Math.round(parsed.risk_percentage);
    let count = 0;
    const interval = setInterval(() => {
      if (count >= target) {
        setAnimatedPct(target);
        clearInterval(interval);
      } else {
        count += 1;
        setAnimatedPct(count);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!result) return null;

  const riskLevel = result.risk_level;
  const hasDisease = result.has_disease;
  const diseaseType = result.disease_type || 'Heart Disease';

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'High': return 'var(--danger)';
      default: return 'var(--accent-primary)';
    }
  };

  const getRecommendations = (level, disease, type) => {
    const recs = [];
    const isHigh = level === 'High' || disease;
    const isMedium = level === 'Medium';
    const normType = type.toLowerCase();

    if (normType.includes('diabetes')) {
      if (isHigh) {
        recs.push('🏥 Consult an endocrinologist immediately for comprehensive diabetic testing.');
        recs.push('🥗 Adopt a strict low-glycemic, low-carb nutrition plan.');
        recs.push('🏃 Focus on reducing weight to achieve a healthy BMI category.');
        recs.push('💊 Discuss starting clinical blood glucose screening immediately with your doctor.');
      } else if (isMedium) {
        recs.push('👨‍⚕️ Schedule a clinical checkup with a physician.');
        recs.push('🥗 Limit intake of refined sugars, sweet beverages, and simple carbohydrates.');
        recs.push('🏃 Engage in 30 minutes of moderate aerobic exercise daily to improve insulin sensitivity.');
        recs.push('📊 Get an HbA1c test completed to establish a medical baseline.');
      } else {
        recs.push('✅ Continue maintaining a balanced, healthy dietary routine.');
        recs.push('🥗 Keep dietary sugar and processed food intake low.');
        recs.push('🏃 Regular physical activities are highly encouraged to sustain a healthy BMI.');
      }
    } else if (normType.includes('kidney')) {
      if (isHigh) {
        recs.push('🏥 Consult a nephrologist immediately for renal function staging.');
        recs.push('🧂 Strictly limit daily sodium (salt) and excessive protein intake.');
        recs.push('📊 Ask a physician to test your Glomerular Filtration Rate (eGFR) and creatinine.');
        recs.push('💧 Maintain consistent hydration without drinking extreme quantities of fluids.');
      } else if (isMedium) {
        recs.push('👨‍⚕️ Schedule a kidney checkup and complete a standard urine albumin test.');
        recs.push('🧂 Restrict dietary sodium levels and avoid highly processed foods.');
        recs.push('💊 Avoid self-medicating with NSAID pain relievers (like ibuprofen), as they harm kidneys.');
      } else {
        recs.push('✅ Keep up your healthy lifestyle and balanced diet.');
        recs.push('💧 Drink adequate water (around 2-2.5 liters daily) for optimal filtration.');
        recs.push('🥗 Eat a balanced diet low in sodium.');
      }
    } else if (normType.includes('liver')) {
      if (isHigh) {
        recs.push('🏥 Consult a hepatologist or gastroenterologist immediately.');
        recs.push('🍷 Avoid alcohol completely and refrain from hepatotoxic substances.');
        recs.push('📊 Complete a liver function test (LFT) panel to check enzyme indicators.');
        recs.push('🥬 Eat a low-fat, highly digestible, nutrient-dense diet.');
      } else if (isMedium) {
        recs.push('👨‍⚕️ Schedule a doctor appointment to check liver health.');
        recs.push('🍷 Limit alcohol intake to zero to reduce liver fatigue.');
        recs.push('🥗 Adopt a Mediterranean-style diet (healthy fats, fresh greens, fish).');
        recs.push('🏃 Focus on weight management to reduce fat accumulation in the liver.');
      } else {
        recs.push('✅ Keep your liver healthy by maintaining a stable, healthy weight.');
        recs.push('🥗 Focus on fresh vegetables, whole grains, and healthy fats.');
      }
    } else {
      // Default: Heart Disease Recommendations
      if (isHigh) {
        recs.push('🏥 Consult a cardiologist immediately for proper diagnostic testing.');
        recs.push('📋 Ask for an ECG and a cardiac stress test to check coronary blood flow.');
        recs.push('🥗 Adopt a heart-healthy diet (reduced saturated fats, low sodium).');
        recs.push('🚭 Avoid smoking, limit alcohol consumption, and manage sodium.');
      } else if (isMedium) {
        recs.push('👨‍⚕️ Schedule a clinical checkup with a primary physician.');
        recs.push('🏃 Engage in moderate physical activity (e.g. 30 minutes of walking daily).');
        recs.push('🥗 Limit cholesterol and sodium intake.');
        recs.push('📊 Monitor blood pressure and blood sugar levels regularly.');
      } else {
        recs.push('✅ Maintain your current healthy lifestyle and diet choices.');
        recs.push('🥗 Continue eating a balanced diet rich in vegetables, fruits, and fiber.');
        recs.push('🏃 Engage in regular aerobic exercise (150 minutes per week).');
      }
    }

    recs.push('😌 Practice stress management techniques such as meditation or yoga.');
    recs.push('😴 Prioritize 7-8 hours of high-quality sleep every night.');

    return recs;
  };

  const recommendations = getRecommendations(riskLevel, hasDisease, diseaseType);

  const renderInputSummary = () => {
    if (!result.inputs) return null;
    const inputs = result.inputs;

    // Find all active symptoms (value === 1)
    const activeSymptoms = Object.keys(inputs).filter(key => 
      !['age', 'sex', 'bmi', 'height', 'weight', 'disease_type'].includes(key) && inputs[key] === 1
    );

    const getSymptomTranslationKey = (key) => {
      const simpleKey = `${key}_simple`;
      // Check if simple translation exists (LanguageContext falls back to key if not found)
      const trans = t(simpleKey);
      if (trans !== simpleKey) return trans;
      return t(key);
    };

    return (
      <div className="details-toggle-section">
        <h3>Submitted Parameters</h3>
        <div className="inputs-summary-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="input-summary-item">
            <span>Age / Sex</span>
            <strong>{inputs.age} / {inputs.sex === 1 ? 'Male' : 'Female'}</strong>
          </div>
          <div className="input-summary-item">
            <span>Height / Weight</span>
            <strong>{inputs.height || '--'} cm / {inputs.weight || '--'} kg</strong>
          </div>
          <div className="input-summary-item">
            <span>Calculated BMI</span>
            <strong>{inputs.bmi} kg/m²</strong>
          </div>
        </div>

        <h3>Symptoms Selected</h3>
        {activeSymptoms.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No symptoms selected.</p>
        ) : (
          <div className="selected-items-list" style={{ marginTop: '0.5rem' }}>
            {activeSymptoms.map(symId => (
              <div key={symId} className="selected-symptom-badge" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                <span className="badge-val" style={{ fontWeight: '600' }}>{getSymptomTranslationKey(symId)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="results-container">
      <div className="results-card glass-card animate-scale-up">
        <h1 className="results-title">{diseaseType} {t('results')}</h1>
        
        {/* Risk Score Visual */}
        <div className="risk-display-section">
          <div className="gauge-container" style={{ '--gauge-color': getRiskColor(riskLevel) }}>
            <div className="gauge-outer">
              <div 
                className="gauge-progress" 
                style={{ 
                  transform: `rotate(${animatedPct * 1.8}deg)` 
                }} 
              />
              <div className="gauge-inner">
                <span className="gauge-number">{animatedPct}%</span>
                <span className="gauge-label">Risk Score</span>
              </div>
            </div>
          </div>

          <div className="risk-summary">
            <h3>
              Risk Category: <span style={{ color: getRiskColor(riskLevel), fontWeight: 'bold' }}>{riskLevel}</span>
            </h3>
            
            <div className={`status-banner ${riskLevel.toLowerCase()}`}>
              {hasDisease ? (
                <>
                  <AlertTriangle className="banner-icon animate-bounce" />
                  <span>{t('disease_detected')}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="banner-icon" />
                  <span>{t('no_disease')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="recommendations-section">
          <h2>
            <Info size={20} className="sec-icon" /> {t('recommendations')}
          </h2>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item animate-fade-in-index" style={{ animationDelay: `${index * 100}ms`, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Check size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Details Grid */}
        {renderInputSummary()}

        {/* Actions */}
        <div className="results-actions">
          <Link to="/assessment" className="btn btn-secondary">
            <RefreshCw size={16} /> New Assessment
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
