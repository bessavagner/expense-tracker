import os
from pathlib import Path
from datetime import datetime
from flask import Flask, render_template, jsonify, send_from_directory, request
import json

BASE_DIR = Path(__file__).resolve().parent
PROJECT_PATH = BASE_DIR / BASE_DIR.parent.parent / 'src/staticfiles/js/modules/engine/'
RESULTS_FILE = BASE_DIR / 'results.json'  # File to store benchmark results

app = Flask(__name__, static_folder=str(PROJECT_PATH))

# Load existing results
results = []
if RESULTS_FILE.exists():
    with open(RESULTS_FILE, 'r') as f:
        results = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(str(PROJECT_PATH), filename)

@app.route('/run-benchmarks', methods=['POST'])
def run_benchmarks():
    try:
        data = request.json
        benchmark_type = data.get('type', 'component')
        benchmark_results = data.get('results', {})
        # Save results with a type identifier
        results.append({
            "timestamp": datetime.now().isoformat(),
            "type": benchmark_type,
            **benchmark_results,
        })
        with open(RESULTS_FILE, 'w') as f:
            json.dump(results, f, indent=2)

        return jsonify({"success": True, "results": benchmark_results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/results')
def get_results():
    return jsonify({"success": True, "results": results})

if __name__ == '__main__':
    app.run(debug=True)