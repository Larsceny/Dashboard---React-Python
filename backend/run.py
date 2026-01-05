from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours in seconds

# Enable CORS for Electron app
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], supports_credentials=True)

# Register blueprints
from app.routes.youtube import youtube_bp
app.register_blueprint(youtube_bp)

@app.route('/')
def index():
    return jsonify({
        'message': 'Dashboard API is running!',
        'status': 'healthy',
        'version': '1.0.0'
    })

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/test')
def test_api():
    return jsonify({
        'message': 'Backend is working!',
        'data': ['test1', 'test2', 'test3']
    })

if __name__ == '__main__':
    print("🚀 Starting Dashboard Backend...")
    print("📍 Backend running on http://localhost:5000")
    print("✅ CORS enabled for frontend")
    app.run(debug=True, port=5000, host='127.0.0.1')
