"""
Multi-Disease Prediction Model Training Script (Symptom-Only)
=============================================
This script trains Random Forest Classifiers for Heart Disease, Diabetes, 
Chronic Kidney Disease (CKD), and Liver Disease using only Age, Sex, BMI, 
and expanded, user-friendly symptoms.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# --- Dataset Generators ---

def generate_heart_dataset(n_samples=1000):
    np.random.seed(42)
    data = {
        'age': np.random.randint(18, 85, n_samples),
        'sex': np.random.randint(0, 2, n_samples),
        'bmi': np.random.uniform(15, 45, n_samples).round(1),
        'chest_pain': np.random.randint(0, 2, n_samples),  # 0: No, 1: Yes
        'shortness_of_breath': np.random.randint(0, 2, n_samples),
        'palpitations': np.random.randint(0, 2, n_samples),
        'dizziness': np.random.randint(0, 2, n_samples),
        'fatigue_on_exertion': np.random.randint(0, 2, n_samples),
        'high_bp_history': np.random.randint(0, 2, n_samples)
    }
    df = pd.DataFrame(data)
    
    score = (
        (df['age'] - 30) * 0.05 + 
        df['sex'] * 0.5 + 
        (df['bmi'] - 20) * 0.1 + 
        df['chest_pain'] * 4.0 + 
        df['shortness_of_breath'] * 3.5 + 
        df['palpitations'] * 2.5 + 
        df['dizziness'] * 2.0 + 
        df['fatigue_on_exertion'] * 3.0 + 
        df['high_bp_history'] * 4.5
    )
    df['target'] = (score > np.median(score)).astype(int)
    return df

def generate_diabetes_dataset(n_samples=1000):
    np.random.seed(43)
    data = {
        'age': np.random.randint(18, 85, n_samples),
        'sex': np.random.randint(0, 2, n_samples),
        'bmi': np.random.uniform(15, 45, n_samples).round(1),
        'polyuria': np.random.randint(0, 2, n_samples),  # frequent urination
        'polydipsia': np.random.randint(0, 2, n_samples),  # excessive thirst
        'polyphagia': np.random.randint(0, 2, n_samples),  # excessive hunger
        'sudden_weight_loss': np.random.randint(0, 2, n_samples),
        'blurred_vision': np.random.randint(0, 2, n_samples),
        'delayed_healing': np.random.randint(0, 2, n_samples),
        'tingling_numbness': np.random.randint(0, 2, n_samples),
        'fatigue': np.random.randint(0, 2, n_samples),
        'dry_skin': np.random.randint(0, 2, n_samples)
    }
    df = pd.DataFrame(data)
    
    score = (
        (df['age'] - 18) * 0.03 + 
        df['sex'] * 0.3 + 
        (df['bmi'] - 20) * 0.2 + 
        df['polyuria'] * 5.0 + 
        df['polydipsia'] * 5.0 + 
        df['polyphagia'] * 2.5 + 
        df['sudden_weight_loss'] * 3.0 + 
        df['blurred_vision'] * 2.5 + 
        df['delayed_healing'] * 2.5 + 
        df['tingling_numbness'] * 2.0 + 
        df['fatigue'] * 1.5 + 
        df['dry_skin'] * 1.0
    )
    df['target'] = (score > np.median(score)).astype(int)
    return df

def generate_kidney_dataset(n_samples=1000):
    np.random.seed(44)
    data = {
        'age': np.random.randint(15, 90, n_samples),
        'sex': np.random.randint(0, 2, n_samples),
        'bmi': np.random.uniform(15, 45, n_samples).round(1),
        'fatigue': np.random.randint(0, 2, n_samples),
        'edema': np.random.randint(0, 2, n_samples),  # swelling
        'foamy_urine': np.random.randint(0, 2, n_samples),
        'blood_in_urine': np.random.randint(0, 2, n_samples),
        'urination_frequency_change': np.random.randint(0, 2, n_samples),
        'nausea': np.random.randint(0, 2, n_samples),
        'metallic_taste': np.random.randint(0, 2, n_samples),
        'itchy_skin': np.random.randint(0, 2, n_samples)
    }
    df = pd.DataFrame(data)
    
    score = (
        (df['age'] - 15) * 0.02 + 
        df['sex'] * 0.2 + 
        (df['bmi'] - 20) * 0.1 + 
        df['fatigue'] * 3.0 + 
        df['edema'] * 5.5 + 
        df['foamy_urine'] * 4.5 + 
        df['blood_in_urine'] * 5.0 + 
        df['urination_frequency_change'] * 4.0 + 
        df['nausea'] * 3.0 + 
        df['metallic_taste'] * 3.5 + 
        df['itchy_skin'] * 2.5
    )
    df['target'] = (score > np.median(score)).astype(int)
    return df

def generate_liver_dataset(n_samples=1000):
    np.random.seed(45)
    data = {
        'age': np.random.randint(18, 85, n_samples),
        'sex': np.random.randint(0, 2, n_samples),
        'bmi': np.random.uniform(15, 45, n_samples).round(1),
        'jaundice': np.random.randint(0, 2, n_samples),  # yellow skin/eyes
        'abdominal_swelling': np.random.randint(0, 2, n_samples),
        'edema_legs': np.random.randint(0, 2, n_samples),
        'itchy_skin': np.random.randint(0, 2, n_samples),
        'dark_urine': np.random.randint(0, 2, n_samples),
        'fatigue': np.random.randint(0, 2, n_samples),
        'nausea_appetite_loss': np.random.randint(0, 2, n_samples),
        'easy_bruising': np.random.randint(0, 2, n_samples)
    }
    df = pd.DataFrame(data)
    
    score = (
        (df['age'] - 18) * 0.02 + 
        df['sex'] * 0.2 + 
        (df['bmi'] - 20) * 0.1 + 
        df['jaundice'] * 6.5 + 
        df['abdominal_swelling'] * 5.0 + 
        df['edema_legs'] * 3.5 + 
        df['itchy_skin'] * 2.5 + 
        df['dark_urine'] * 4.0 + 
        df['fatigue'] * 2.0 + 
        df['nausea_appetite_loss'] * 3.0 + 
        df['easy_bruising'] * 3.0
    )
    df['target'] = (score > np.median(score)).astype(int)
    return df

# --- Model Trainer ---

def train_model(disease_name, df):
    print("\n" + "="*50)
    print(f"Training Model for: {disease_name}")
    print("="*50)
    
    X = df.drop('target', axis=1)
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    clf.fit(X_train_scaled, y_train)
    
    y_pred = clf.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_test, y_pred))
    
    prefix = disease_name.lower().replace(' ', '_')
    os.makedirs('models', exist_ok=True)
    joblib.dump(clf, f'models/{prefix}_model.pkl')
    joblib.dump(scaler, f'models/{prefix}_scaler.pkl')
    joblib.dump(list(X.columns), f'models/{prefix}_features.pkl')
    
    print(f"Saved artifacts:")
    print(f"  - models/{prefix}_model.pkl")
    print(f"  - models/{prefix}_scaler.pkl")
    print(f"  - models/{prefix}_features.pkl")
    return acc

if __name__ == "__main__":
    diseases = {
        "heart": (generate_heart_dataset, "heart_disease.csv"),
        "diabetes": (generate_diabetes_dataset, "diabetes_disease.csv"),
        "kidney": (generate_kidney_dataset, "kidney_disease.csv"),
        "liver": (generate_liver_dataset, "liver_disease.csv")
    }
    
    for key, (generator, csv_filename) in diseases.items():
        df = generator()
        df.to_csv(csv_filename, index=False)
        train_model(key, df)
    
    print("\nAll models trained successfully!")
