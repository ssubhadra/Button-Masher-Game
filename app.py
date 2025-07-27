from flask import Flask, request, jsonify, send_from_directory
import csv
import os
from datetime import datetime
import json

app = Flask(__name__)

# Ensure data directory exists
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

CSV_FILE = os.path.join(DATA_DIR, 'game_results.csv')

# CSV headers
CSV_HEADERS = [
    'timestamp',
    'duration',
    'selected_key',
    'total_presses',
    'correct_presses',
    'wrong_presses',
    'accuracy',
    'keys_per_second'
]

def initialize_csv():
    """Initialize CSV file with headers if it doesn't exist"""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)

@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/game.js')
def game_js():
    """Serve the JavaScript file"""
    return send_from_directory('.', 'game.js')

@app.route('/api/save-result', methods=['POST'])
def save_result():
    """Save game result to CSV file"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['timestamp', 'duration', 'selectedKey', 'totalPresses', 
                          'correctPresses', 'wrongPresses', 'accuracy', 'keysPerSecond']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Initialize CSV if needed
        initialize_csv()
        
        # Prepare data for CSV
        csv_row = [
            data['timestamp'],
            data['duration'],
            data['selectedKey'],
            data['totalPresses'],
            data['correctPresses'],
            data['wrongPresses'],
            data['accuracy'],
            data['keysPerSecond']
        ]
        
        # Append to CSV file
        with open(CSV_FILE, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(csv_row)
        
        return jsonify({'success': True, 'message': 'Result saved successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/results', methods=['GET'])
def get_results():
    """Get all saved results"""
    try:
        if not os.path.exists(CSV_FILE):
            return jsonify({'results': []})
        
        results = []
        with open(CSV_FILE, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                results.append(row)
        
        return jsonify({'results': results})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-csv')
def download_csv():
    """Download the CSV file"""
    if os.path.exists(CSV_FILE):
        return send_from_directory(DATA_DIR, 'game_results.csv', as_attachment=True)
    else:
        return jsonify({'error': 'No results file found'}), 404

@app.route('/api/stats')
def get_stats():
    """Get basic statistics from saved results"""
    try:
        if not os.path.exists(CSV_FILE):
            return jsonify({'stats': {}})
        
        results = []
        with open(CSV_FILE, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                results.append(row)
        
        if not results:
            return jsonify({'stats': {}})
        
        # Calculate basic stats
        total_games = len(results)
        total_presses = sum(int(r['total_presses']) for r in results)
        total_correct = sum(int(r['correct_presses']) for r in results)
        avg_accuracy = sum(float(r['accuracy']) for r in results) / total_games
        avg_kps = sum(float(r['keys_per_second']) for r in results) / total_games
        
        # Best scores
        best_accuracy = max(float(r['accuracy']) for r in results)
        best_kps = max(float(r['keys_per_second']) for r in results)
        most_presses = max(int(r['total_presses']) for r in results)
        
        stats = {
            'total_games': total_games,
            'total_presses': total_presses,
            'total_correct': total_correct,
            'average_accuracy': round(avg_accuracy, 1),
            'average_kps': round(avg_kps, 1),
            'best_accuracy': best_accuracy,
            'best_kps': best_kps,
            'most_presses_in_game': most_presses
        }
        
        return jsonify({'stats': stats})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize CSV file on startup
    initialize_csv()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)