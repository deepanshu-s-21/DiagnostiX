"""
DiagnostiX - Flask Backend API (Multi-Disease Support)
=====================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import os
import sqlite3
import json
import datetime
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

jwt = JWTManager(app)

# Paths configuration relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'diagnostix.db')
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# Database Helpers
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            email TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            prediction INTEGER NOT NULL,
            risk_percentage REAL NOT NULL,
            risk_level TEXT NOT NULL,
            has_disease INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            inputs TEXT NOT NULL,
            FOREIGN KEY (username) REFERENCES users (username)
        )
    ''')
    # Dynamic migration to add disease_type column
    cursor.execute("PRAGMA table_info(predictions)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'disease_type' not in columns:
        cursor.execute("ALTER TABLE predictions ADD COLUMN disease_type TEXT DEFAULT 'Heart Disease'")
    
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

# Load all ML models
DISEASE_MODELS = {}
models_loaded_successfully = True

try:
    for disease in ['heart', 'diabetes', 'kidney', 'liver']:
        model_path = os.path.join(MODEL_DIR, f'{disease}_model.pkl')
        scaler_path = os.path.join(MODEL_DIR, f'{disease}_scaler.pkl')
        features_path = os.path.join(MODEL_DIR, f'{disease}_features.pkl')
        
        DISEASE_MODELS[disease] = {
            'model': joblib.load(model_path),
            'scaler': joblib.load(scaler_path),
            'features': joblib.load(features_path)
        }
    print("All ML models loaded successfully")
except Exception as e:
    print(f"Error loading models: {e}")
    models_loaded_successfully = False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': models_loaded_successfully,
        'loaded_diseases': list(DISEASE_MODELS.keys())
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

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if username exists
    cursor.execute('SELECT username FROM users WHERE username = ?', (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)
    created_at = datetime.datetime.utcnow().isoformat()

    try:
        cursor.execute('''
            INSERT INTO users (username, password, email, created_at)
            VALUES (?, ?, ?, ?)
        ''', (username, hashed_password, email, created_at))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({'error': f'Failed to register user: {str(e)}'}), 500

    conn.close()

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

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = ?', (username,))
    row = cursor.fetchone()
    conn.close()

    if not row or not check_password_hash(row['password'], password):
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
    """Heart/Diabetes/Kidney/Liver disease prediction"""
    data = request.json
    username = get_jwt_identity()
    disease_type = data.get('disease_type', 'Heart Disease')
    
    # Normalize disease_type key for model lookup
    disease_key = 'heart'
    if 'diabetes' in disease_type.lower():
        disease_key = 'diabetes'
    elif 'kidney' in disease_type.lower():
        disease_key = 'kidney'
    elif 'liver' in disease_type.lower():
        disease_key = 'liver'
        
    models_bundle = DISEASE_MODELS.get(disease_key)
    if not models_bundle:
        return jsonify({'error': f'Model for {disease_type} is not available'}), 500

    model = models_bundle['model']
    scaler = models_bundle['scaler']
    feature_names = models_bundle['features']

    try:
        # Extract features in correct order
        features = []
        for feature in feature_names:
            val = data.get(feature, 0)
            try:
                features.append(float(val))
            except:
                features.append(0.0)

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

        timestamp_str = datetime.datetime.utcnow().isoformat()

        result = {
            'prediction': int(prediction),
            'risk_percentage': float(risk_percentage),
            'risk_level': risk_level,
            'has_disease': bool(prediction == 1),
            'timestamp': timestamp_str,
            'disease_type': disease_type
        }

        # Store prediction in SQLite
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO predictions (username, prediction, risk_percentage, risk_level, has_disease, timestamp, inputs, disease_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            username,
            int(prediction),
            float(risk_percentage),
            risk_level,
            1 if prediction == 1 else 0,
            timestamp_str,
            json.dumps(data),
            disease_type
        ))
        conn.commit()
        conn.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get prediction history"""
    username = get_jwt_identity()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT prediction, risk_percentage, risk_level, has_disease, timestamp, inputs, disease_type
        FROM predictions
        WHERE username = ?
        ORDER BY timestamp DESC
    ''', (username,))
    rows = cursor.fetchall()
    conn.close()

    history = []
    for row in rows:
        history.append({
            'prediction': row['prediction'],
            'risk_percentage': row['risk_percentage'],
            'risk_level': row['risk_level'],
            'has_disease': bool(row['has_disease']),
            'timestamp': row['timestamp'],
            'disease_type': row['disease_type'] if 'disease_type' in row.keys() else 'Heart Disease',
            'inputs': json.loads(row['inputs']) if row['inputs'] else {}
        })
        
    return jsonify({'history': history})

if __name__ == '__main__':
    print("Starting DiagnostiX API Server with Multi-Disease support...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
