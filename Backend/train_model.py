"""
Heart Disease Prediction Model Training Script
==============================================
This script trains a Random Forest Classifier on heart disease data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

def create_sample_dataset():
    """Create a sample heart disease dataset if none exists"""
    np.random.seed(42)
    n_samples = 1000

    data = {
        'age': np.random.randint(30, 80, n_samples),
        'sex': np.random.randint(0, 2, n_samples),  # 0: Female, 1: Male
        'chest_pain': np.random.randint(0, 4, n_samples),  # 0-3 types
        'resting_bp': np.random.randint(90, 200, n_samples),
        'cholesterol': np.random.randint(150, 400, n_samples),
        'fasting_bs': np.random.randint(0, 2, n_samples),  # 0: <=120, 1: >120
        'resting_ecg': np.random.randint(0, 3, n_samples),
        'max_hr': np.random.randint(60, 200, n_samples),
        'exercise_angina': np.random.randint(0, 2, n_samples),
        'oldpeak': np.random.uniform(0, 6, n_samples).round(1),
        'st_slope': np.random.randint(0, 3, n_samples)
    }

    # Create target based on some logic
    df = pd.DataFrame(data)
    df['target'] = ((df['age'] > 55) & 
                    (df['cholesterol'] > 240) | 
                    (df['chest_pain'] > 1)).astype(int)

    return df

def train_heart_model():
    """Train the heart disease prediction model"""
    print("="*60)
    print("Heart Disease Prediction Model Training")
    print("="*60)

    # Load or create dataset
    try:
        print("\nLoading dataset...")
        df = pd.read_csv('heart_disease.csv')
        print(f"Dataset loaded: {len(df)} records")
    except:
        print("\nDataset not found. Creating sample dataset...")
        df = create_sample_dataset()
        df.to_csv('heart_disease.csv', index=False)
        print(f"Sample dataset created: {len(df)} records")

    print(f"\nDataset shape: {df.shape}")
    print(f"\nFeatures: {list(df.columns[:-1])}")
    print(f"Target distribution:\n{df['target'].value_counts()}")

    # Prepare data
    X = df.drop('target', axis=1)
    y = df['target']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")

    # Scale features
    print("\nScaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model
    print("\nTraining Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)

    # Evaluate
    print("\nEvaluating model...")
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\nAccuracy: {accuracy*100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                                target_names=['No Disease', 'Disease']))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nTop 5 Important Features:")
    print(feature_importance.head())

    # Save model and scaler
    print("\nSaving model and scaler...")
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/heart_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')

    # Save feature names
    joblib.dump(list(X.columns), 'models/feature_names.pkl')

    print("\n" + "="*60)
    print("Training Complete!")
    print("="*60)
    print("\nSaved files:")
    print("  - models/heart_model.pkl")
    print("  - models/scaler.pkl")
    print("  - models/feature_names.pkl")
    print("  - heart_disease.csv (training data)")

    return model, scaler, accuracy

if __name__ == "__main__":
    train_heart_model()
