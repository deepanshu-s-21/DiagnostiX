import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    app_title: "DiagnostiX",
    app_subtitle: "AI-Powered Simplified Symptom-Based Risk Screenings",
    login: "Login",
    signup: "Sign Up",
    username: "Username",
    password: "Password",
    email: "Email",
    logout: "Logout",
    dashboard: "Dashboard",
    new_assessment: "New Assessment",
    history: "History",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    patient_info: "Patient Information",
    age: "Age",
    sex: "Sex",
    male: "Male",
    female: "Female",
    symptoms: "Symptoms",
    submit: "Submit Assessment",
    cancel: "Cancel",
    results: "Results",
    risk_level: "Risk Level",
    risk_percentage: "Risk Percentage",
    low_risk: "Low Risk",
    medium_risk: "Medium Risk",
    high_risk: "High Risk",
    recommendations: "Recommendations",
    no_disease: "No Disease Detected",
    disease_detected: "Disease Risk Detected",
    consult_doctor: "Please consult a doctor",
    maintain_lifestyle: "Maintain healthy lifestyle",
    back: "Back",
    assessment_history: "Assessment History",
    view_previous: "View your previous assessments",
    drag_symptoms: "Drag Symptoms to Selection Area",
    drag_symptoms_desc: "Drag symptom cards to the selection box below to choose your symptoms",
    available_symptoms: "Available Symptoms",
    selected_symptoms: "Selected Symptoms",
    vital_signs: "Vital Signs & Physical Metrics",
    no_assessments: "No assessments yet",
    start_new: "Start a new assessment to see your history here",
    home: "Home",
    about: "About",
    gallery: "Gallery",
    contact: "Contact",
    
    // Multi-Disease Translations
    select_disease: "Select Target Disease",
    disease_heart: "Heart Disease",
    disease_diabetes: "Diabetes",
    disease_kidney: "Chronic Kidney Disease",
    disease_liver: "Liver Disease",
    
    // Simple Vitals
    height: "Height (cm)",
    weight: "Weight (kg)",
    calculated_bmi: "Calculated BMI",
    bmi_category: "BMI Category",
    bmi_underweight: "Underweight",
    bmi_normal: "Normal Weight",
    bmi_overweight: "Overweight",
    bmi_obese: "Obese",

    // Understandable Symptoms - Heart
    chest_pain_simple: "Chest Pain / Discomfort",
    shortness_of_breath: "Shortness of Breath (Dyspnea)",
    palpitations: "Heart Palpitations (Fluttering)",
    dizziness: "Dizziness or Lightheadedness",
    fatigue_on_exertion: "Fatigue or Tiredness during physical effort",
    high_bp_history: "History of High Blood Pressure",

    // Understandable Symptoms - Diabetes
    polyuria_simple: "Frequent Urination (especially at night)",
    polydipsia_simple: "Extreme or Unquenchable Thirst",
    polyphagia_simple: "Excessive or Constant Hunger",
    sudden_weight_loss: "Unexplained Rapid Weight Loss",
    blurred_vision: "Blurred or Hazy Vision",
    delayed_healing: "Slow Healing of cuts, sores, or bruises",
    tingling_numbness: "Tingling, Numbness, or Pain in Hands or Feet",
    fatigue_simple: "Constant Weakness or Chronic Fatigue",
    dry_skin: "Dry Skin or Extreme Dry Mouth",

    // Understandable Symptoms - Kidney
    edema_simple: "Swelling in feet, ankles, face, or hands",
    foamy_urine: "Foamy, bubbly, or frothy urine",
    blood_in_urine: "Blood in urine (dark/rust-colored urine)",
    urination_frequency_change: "Urination changes (urinating much more or less)",
    nausea_simple: "Frequent nausea, upset stomach, or vomiting",
    metallic_taste: "Metallic taste in mouth or ammonia breath odor",
    itchy_skin_simple: "Persistent dry and itchy skin",

    // Understandable Symptoms - Liver
    jaundice_simple: "Yellowing of skin or whites of the eyes",
    abdominal_swelling: "Swelling, fullness, or pain in the abdomen",
    edema_legs: "Swelling in legs or ankles",
    nausea_appetite_loss: "Persistent nausea or severe loss of appetite",
    easy_bruising: "Easy bruising or bleeding from minor cuts"
  },
  hi: {
    app_title: "डायग्नोस्टिक्स",
    app_subtitle: "AI-संचालित सरल लक्षण-आधारित जोखिम पूर्वानुमान",
    login: "लॉगिन",
    signup: "साइन अप",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    email: "ईमेल",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    new_assessment: "नया मूल्यांकन",
    history: "इतिहास",
    settings: "सेटिंग्स",
    theme: "थीम",
    language: "भाषा",
    light: "हल्का",
    dark: "डार्क",
    patient_info: "रोगी जानकारी",
    age: "उम्र",
    sex: "लिंग",
    male: "पुरुष",
    female: "महिला",
    symptoms: "लक्षण",
    submit: "मूल्यांकन जमा करें",
    cancel: "रद्द करें",
    results: "परिणाम",
    risk_level: "जोखिम स्तर",
    risk_percentage: "जोखिम प्रतिशत",
    low_risk: "कम जोखिम",
    medium_risk: "मध्यम जोखिम",
    high_risk: "उच्च जोखिम",
    recommendations: "सिफारिशें",
    no_disease: "कोई रोग नहीं पाया गया",
    disease_detected: "रोग जोखिम पाया गया",
    consult_doctor: "कृपया डॉक्टर से परामर्श करें",
    maintain_lifestyle: "स्वस्थ जीवनशैली बनाए रखें",
    back: "वापस",
    assessment_history: "मूल्यांकन इतिहास",
    view_previous: "अपने पिछले मूल्यांकन देखें",
    drag_symptoms: "लक्षणों को चयन क्षेत्र में खींचें",
    drag_symptoms_desc: "अपने लक्षणों को चुनने के लिए लक्षण कार्ड्स को नीचे चयन बॉक्स में खींचें",
    available_symptoms: "उपलब्ध लक्षण",
    selected_symptoms: "चयनित लक्षण",
    vital_signs: "शारीरिक माप और जीवन संबंधी मेट्रिक्स",
    no_assessments: "अभी तक कोई मूल्यांकन नहीं",
    start_new: "अपना मूल्यांकन इतिहास यहां देखने के लिए एक नया मूल्यांकन शुरू करें",
    home: "होम",
    about: "के बारे में",
    gallery: "गैलरी",
    contact: "संपर्क",
    
    // Multi-Disease Translations
    select_disease: "लक्षित बीमारी का चयन करें",
    disease_heart: "हृदय रोग",
    disease_diabetes: "मधुमेह",
    disease_kidney: "क्रोनिक किडनी रोग",
    disease_liver: "यकृत (लीवर) रोग",
    
    // Simple Vitals
    height: "ऊंचाई (cm)",
    weight: "वजन (kg)",
    calculated_bmi: "परिकलित BMI",
    bmi_category: "BMI श्रेणी",
    bmi_underweight: "कम वजन (Underweight)",
    bmi_normal: "सामान्य वजन (Normal)",
    bmi_overweight: "अधिक वजन (Overweight)",
    bmi_obese: "मोटापा (Obese)",

    // Understandable Symptoms - Heart
    chest_pain_simple: "छाती में दर्द या बेचैनी",
    shortness_of_breath: "सांस की तकलीफ (हाफना)",
    palpitations: "दिल की धड़कन तेज होना या फड़फड़ाहट",
    dizziness: "चक्कर आना या सिर घूमना",
    fatigue_on_exertion: "शारीरिक प्रयास के दौरान थकान या कमजोरी",
    high_bp_history: "उच्च रक्तचाप (High BP) का इतिहास",

    // Understandable Symptoms - Diabetes
    polyuria_simple: "बार-बार पेशाब आना (विशेषकर रात में)",
    polydipsia_simple: "अत्यधिक या बुझने न वाली प्यास लगना",
    polyphagia_simple: "अत्यधिक या लगातार भूख लगना",
    sudden_weight_loss: "अकारण तेजी से वजन कम होना",
    blurred_vision: "धुंधली दृष्टि",
    delayed_healing: "कटने, घाव या खरोंच का धीरे-धीरे ठीक होना",
    tingling_numbness: "हाथों या पैरों में झुनझुनी, सुन्नता या दर्द",
    fatigue_simple: "लगातार कमजोरी या पुराना थकान",
    dry_skin: "सूखी त्वचा या अत्यधिक मुंह सूखना",

    // Understandable Symptoms - Kidney
    edema_simple: "पैरों, टखनों, चेहरे या हाथों में सूजन",
    foamy_urine: "झागदार या बुलबुलेदार पेशाब आना",
    blood_in_urine: "पेशाब में खून आना (गहरा या जंग के रंग का पेशाब)",
    urination_frequency_change: "पेशाब की आवृत्ति में बदलाव (बहुत अधिक या कम होना)",
    nausea_simple: "बार-बार जी मिचलाना, पेट खराब होना या उल्टी होना",
    metallic_taste: "मुंह में धातु जैसा स्वाद या सांस से अमोनिया जैसी गंध",
    itchy_skin_simple: "लगातार शुष्क और खुजलीदार त्वचा",

    // Understandable Symptoms - Liver
    jaundice_simple: "त्वचा या आँखों के सफेद भाग का पीला होना (पीलिया)",
    abdominal_swelling: "पेट में सूजन, भारीपन या दर्द",
    edema_legs: "पैरों या टखनों में सूजन",
    nausea_appetite_loss: "लगातार जी मिचलाना या भूख में भारी कमी",
    easy_bruising: "आसानी से चोट लगना (नील पड़ना) या खून बहना"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
