"""
DiagnostiX - Flask Backend API
=====================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import numpy as np
import os
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

jwt = JWTManager(app)

# In-memory user storage (replace with database in production)
users_db = {}
predictions_db = {}

# Load ML model
try:
    model = joblib.load('models/heart_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    feature_names = joblib.load('models/feature_names.pkl')
    print("✓ ML model loaded successfully")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model, scaler, feature_names = None, None, None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/register', methods=['POST'])
def register():
    """User registration"""
    data = request.json

    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    if username in users_db:
        return jsonify({'error': 'Username already exists'}), 400

    users_db[username] = {
        'password': generate_password_hash(password),
        'email': email,
        'created_at': str(np.datetime64('now'))
    }

    return jsonify({
        'message': 'Registration successful',
        'username': username
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    """User login"""
    data = request.json

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    user = users_db.get(username)

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=username)

    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'username': username
    })

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    """Heart disease prediction"""
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.json
    username = get_jwt_identity()

    try:
        # Extract features in correct order
        features = [
            data.get('age', 0),
            data.get('sex', 0),
            data.get('chest_pain', 0),
            data.get('resting_bp', 0),
            data.get('cholesterol', 0),
            data.get('fasting_bs', 0),
            data.get('resting_ecg', 0),
            data.get('max_hr', 0),
            data.get('exercise_angina', 0),
            data.get('oldpeak', 0),
            data.get('st_slope', 0)
        ]

        # Scale and predict
        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]

        risk_percentage = probability[1] * 100  # Probability of disease

        # Determine risk level
        if risk_percentage < 30:
            risk_level = 'Low'
        elif risk_percentage < 60:
            risk_level = 'Medium'
        else:
            risk_level = 'High'

        result = {
            'prediction': int(prediction),
            'risk_percentage': float(risk_percentage),
            'risk_level': risk_level,
            'has_disease': bool(prediction == 1),
            'timestamp': str(np.datetime64('now'))
        }

        # Store prediction
        if username not in predictions_db:
            predictions_db[username] = []
        predictions_db[username].append(result)

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get prediction history"""
    username = get_jwt_identity()
    history = predictions_db.get(username, [])
    return jsonify({'history': history})

if __name__ == '__main__':
    print("Starting DiagnostiX API Server...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
