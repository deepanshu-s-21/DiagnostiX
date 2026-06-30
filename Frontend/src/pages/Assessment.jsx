import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Heart, User, Clipboard, Plus, Trash2, ArrowRight, Activity, Filter, Shield } from 'lucide-react';

const diseaseOptions = [
  { id: 'heart', name: 'Heart Disease', iconKey: 'heart' },
  { id: 'diabetes', name: 'Diabetes', iconKey: 'diabetes' },
  { id: 'kidney', name: 'Chronic Kidney Disease', iconKey: 'kidney' },
  { id: 'liver', name: 'Liver Disease', iconKey: 'liver' }
];

const diseaseIcons = {
  heart: Heart,
  diabetes: Activity,
  kidney: Filter,
  liver: Shield
};

// Understandable symptoms dictionary for each disease
const symptomTemplates = {
  heart: [
    { id: 'chest_pain', label: 'chest_pain_simple', desc: 'Sensation of tightness, pressure, or squeezing pain in the chest.' },
    { id: 'shortness_of_breath', label: 'shortness_of_breath', desc: 'Difficulty breathing or feeling winded easily during mild tasks.' },
    { id: 'palpitations', label: 'palpitations', desc: 'Feeling of a fast, fluttering, or pounding heartbeat.' },
    { id: 'dizziness', label: 'dizziness', desc: 'Feeling lightheaded, unsteady, or faint.' },
    { id: 'fatigue_on_exertion', label: 'fatigue_on_exertion', desc: 'Feeling unusually tired or weak when walking or climbing stairs.' },
    { id: 'high_bp_history', label: 'high_bp_history', desc: 'Having been diagnosed with high blood pressure by a doctor.' }
  ],
  diabetes: [
    { id: 'polyuria', label: 'polyuria_simple', desc: 'Needing to urinate much more frequently, especially waking up at night.' },
    { id: 'polydipsia', label: 'polydipsia_simple', desc: 'Feeling extremely thirsty all the time, even after drinking plenty of water.' },
    { id: 'polyphagia', label: 'polyphagia_simple', desc: 'Feeling constantly hungry even after eating normal portions.' },
    { id: 'sudden_weight_loss', label: 'sudden_weight_loss', desc: 'Losing weight rapidly without dieting or changing physical activity.' },
    { id: 'blurred_vision', label: 'blurred_vision', desc: 'Sudden or occasional blurriness in your vision.' },
    { id: 'delayed_healing', label: 'delayed_healing', desc: 'Minor cuts, scratches, or sores taking weeks to heal.' },
    { id: 'tingling_numbness', label: 'tingling_numbness', desc: 'A pins-and-needles sensation, numbness, or burning pain in hands or feet.' },
    { id: 'fatigue', label: 'fatigue_simple', desc: 'Chronic fatigue, lack of energy, or general bodily weakness.' },
    { id: 'dry_skin', label: 'dry_skin', desc: 'Extremely dry, itchy skin or feeling of dry mouth.' }
  ],
  kidney: [
    { id: 'fatigue', label: 'fatigue_simple', desc: 'Feeling constantly tired, weak, or having difficulty concentrating.' },
    { id: 'edema', label: 'edema_simple', desc: 'Swelling or fluid buildup in ankles, feet, hands, or puffiness around eyes.' },
    { id: 'foamy_urine', label: 'foamy_urine', desc: 'Urine that looks excessively bubbly, frothy, or foamy.' },
    { id: 'blood_in_urine', label: 'blood_in_urine', desc: 'Urine appearing reddish, pinkish, or dark brown.' },
    { id: 'urination_frequency_change', label: 'urination_frequency_change', desc: 'Urinating significantly more or less than your usual amounts.' },
    { id: 'nausea', label: 'nausea_simple', desc: 'Frequent feelings of nausea, upset stomach, or vomiting.' },
    { id: 'metallic_taste', label: 'metallic_taste', desc: 'A metallic taste in your mouth or having breath that smells like ammonia.' },
    { id: 'itchy_skin', label: 'itchy_skin_simple', desc: 'Severe, persistent dry skin and widespread itching.' }
  ],
  liver: [
    { id: 'jaundice', label: 'jaundice_simple', desc: 'Yellowing of your skin or the whites of your eyes.' },
    { id: 'abdominal_swelling', label: 'abdominal_swelling', desc: 'Swelling, bloating, or accumulation of fluid in the abdomen (belly).' },
    { id: 'edema_legs', label: 'edema_legs', desc: 'Swelling in the lower legs, ankles, or feet.' },
    { id: 'itchy_skin', label: 'itchy_skin_simple', desc: 'Persistent, intense skin itching without a clear rash.' },
    { id: 'dark_urine', label: 'dark_urine', desc: 'Urine that looks dark orange, amber, or brownish.' },
    { id: 'fatigue', label: 'fatigue_simple', desc: 'Severe, chronic tiredness that doesn\'t go away with rest.' },
    { id: 'nausea_appetite_loss', label: 'nausea_appetite_loss', desc: 'Loss of appetite, feeling full quickly, or constant mild nausea.' },
    { id: 'easy_bruising', label: 'easy_bruising', desc: 'Bruising very easily or minor cuts bleeding longer than usual.' }
  ]
};

export default function Assessment() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeDisease, setActiveDisease] = useState('heart');

  // Simple Vitals (Height/Weight to calculate BMI)
  const [age, setAge] = useState(45);
  const [sex, setSex] = useState(1); // 1: Male, 0: Female
  const [height, setHeight] = useState(170); // in cm
  const [weight, setWeight] = useState(70); // in kg
  const [bmi, setBmi] = useState(24.2);

  // Selected Symptoms checklist (list of symptom IDs)
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recalculate BMI when Height/Weight changes
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    }
  }, [height, weight]);

  // Clear selections when switching disease
  useEffect(() => {
    setSelectedSymptoms([]);
    setErrorAlert(null);
  }, [activeDisease]);

  const availableSymptomsList = symptomTemplates[activeDisease];

  const getBmiCategory = (val) => {
    if (val < 18.5) return { name: t('bmi_underweight'), color: 'var(--warning)' };
    if (val < 25.0) return { name: t('bmi_normal'), color: 'var(--success)' };
    if (val < 30.0) return { name: t('bmi_overweight'), color: 'var(--warning)' };
    return { name: t('bmi_obese'), color: 'var(--danger)' };
  };

  // Drag & Drop handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('symptomId', id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const id = e.dataTransfer.getData('symptomId');
    if (id && !selectedSymptoms.includes(id)) {
      setSelectedSymptoms(prev => [...prev, id]);
    }
  };

  const selectSymptom = (id) => {
    if (!selectedSymptoms.includes(id)) {
      setSelectedSymptoms(prev => [...prev, id]);
    } else {
      setSelectedSymptoms(prev => prev.filter(item => item !== id));
    }
  };

  const removeSymptom = (id) => {
    setSelectedSymptoms(prev => prev.filter(item => item !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorAlert(null);

    // Build prediction payload (Vitals + Symptom binaries)
    const payload = {
      age: parseInt(age),
      sex: parseInt(sex),
      bmi: parseFloat(bmi),
      disease_type: diseaseOptions.find(d => d.id === activeDisease).name
    };

    // Map selected symptoms as 1, unselected as 0
    availableSymptomsList.forEach(s => {
      payload[s.id] = selectedSymptoms.includes(s.id) ? 1 : 0;
    });

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        // Cache height and weight in results inputs list
        localStorage.setItem('lastResult', JSON.stringify({ 
          ...result, 
          inputs: { 
            ...payload, 
            height: parseInt(height), 
            weight: parseInt(weight) 
          } 
        }));
        navigate('/results');
      } else {
        setErrorAlert(result.error || 'Assessment failed');
      }
    } catch (err) {
      setErrorAlert('Network error. Please verify the Flask backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="assessment-container">
      <h1 className="page-title">{t('new_assessment')}</h1>
      
      {/* Disease Selection Tabs */}
      <div className="disease-selector-tabs animate-fade-in">
        <label className="form-label select-label">{t('select_disease')}</label>
        <div className="tabs-grid">
          {diseaseOptions.map(opt => {
            const IconComp = diseaseIcons[opt.iconKey];
            return (
              <button
                key={opt.id}
                type="button"
                className={`disease-tab-btn ${activeDisease === opt.id ? 'active' : ''}`}
                onClick={() => setActiveDisease(opt.id)}
              >
                <IconComp className="tab-icon-lucide" size={18} style={{ marginRight: '6px' }} />
                <span className="tab-name">{t(`disease_${opt.id}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorAlert && (
        <div className="alert alert-error animate-shake">
          <span>{errorAlert}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="assessment-grid">
        
        {/* Left Side: Drag & Drop Symptoms */}
        <div className="assessment-left-panel">
          <div className="assessment-card glass-card">
            <h2>1. Select Symptoms You Feel</h2>
            <p className="section-instruction">
              Drag symptom cards to the checklist box below, or click them directly to select/deselect them.
            </p>

            <div className="symptoms-columns">
              <div className="symptom-column">
                <h4>{t('available_symptoms')}</h4>
                <div className="symptom-cards-list symptoms-flex-wrap">
                  {availableSymptomsList.map(s => {
                    const isSelected = selectedSymptoms.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, s.id)}
                        onClick={() => selectSymptom(s.id)}
                        className={`symptom-item-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="symptom-item-header">
                          <span>{t(s.label)}</span>
                          {!isSelected && <Plus size={14} className="add-icon" />}
                        </div>
                        <p className="symptom-item-desc">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selection Drop Zone */}
            <div className="selection-dropzone-wrapper">
              <h4>{t('selected_symptoms')}</h4>
              <div
                className={`dropzone ${isDragOver ? 'drag-over' : ''} ${selectedSymptoms.length > 0 ? 'has-items' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {selectedSymptoms.length === 0 ? (
                  <p className="dropzone-placeholder">Drag active symptoms here or click them to select</p>
                ) : (
                  <div className="selected-items-list">
                    {selectedSymptoms.map(id => {
                      const item = availableSymptomsList.find(s => s.id === id);
                      return (
                        <div key={id} className="selected-symptom-badge animate-scale-up">
                          <div className="badge-info">
                            <span className="badge-val">{t(item.label)}</span>
                          </div>
                          <button type="button" className="badge-remove-btn" onClick={() => removeSymptom(id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Vitals Metrics (Height/Weight only) */}
        <div className="assessment-right-panel">
          {/* Patient Details */}
          <div className="assessment-card glass-card">
            <h2>2. General Details</h2>
            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">{t('age')}</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="number"
                    className="form-input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('sex')}</label>
                <select className="form-select" value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="1">{t('male')}</option>
                  <option value="0">{t('female')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vitals Form */}
          <div className="assessment-card glass-card">
            <h2>3. Physical Metrics</h2>
            <p className="section-instruction" style={{ marginBottom: '1.25rem' }}>
              No laboratory blood tests are required. Simply enter your Height and Weight.
            </p>
            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">{t('height')}</label>
                <input
                  type="number"
                  className="form-input"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  min="50"
                  max="250"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('weight')}</label>
                <input
                  type="number"
                  className="form-input"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                  min="10"
                  max="300"
                  required
                />
              </div>
            </div>

            {/* Calculated BMI Badge */}
            <div className="bmi-display-box" style={{ marginTop: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('calculated_bmi')}</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{bmi} kg/m²</strong>
              </div>
              <div style={{ background: bmiCat.color, color: 'white', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem' }}>
                {bmiCat.name}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Evaluating...' : t('submit')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
