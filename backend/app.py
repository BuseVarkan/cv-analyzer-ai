import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.ai_utils import generate_suggestions, pdf_extractor
from utils.pdf_utils import extract_text_from_pdf

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/extract-text', methods=['OPTIONS', 'POST'])
def extract_text():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    if 'cvFile' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        file = request.files['cvFile']
        raw_text = extract_text_from_pdf(file)
        
        if not raw_text.strip():
            return jsonify({"error": "No text found in the uploaded PDF"}), 400
        
        json_content = pdf_extractor(raw_text)
        structured_content = json.loads(json_content)
            
        return jsonify({
            "structured_content": structured_content
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate-suggestions', methods=['OPTIONS', 'POST'])
def generate_suggestions_endpoint():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    try:
        data = request.get_json()
        cv_json = data.get('cv_text', '')
        job_description = data.get('job_description', '')
        
        if not cv_json:
            return jsonify({"error": "No CV provided"}), 400
            
        suggestions = generate_suggestions(cv_json, job_description)
        return jsonify({"suggestions": suggestions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-cv', methods=['OPTIONS', 'POST'])
def analyze_cv():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    try:
        return {
  "overall_score": 78,
  "breakdown": [
  {
      "title": "Skills & Achievements",
      "score": 85,
      "description": "Good alignment with job description",
      "details": "Your CV highlights relevant skills and experiences such as React, TypeScript, and frontend development. Consider emphasizing more specific achievements related to team collaboration and leadership.",
    },
    {
      "title": "Language & Tone",
      "score": 75,
      "description": "Average",
      "details": "Your CV uses a professional tone and formatting. However, it can be improved by using shorter sentences, removing passive voice, and ensuring consistent formatting throughout.",
    },
    {
      "title": "Soft Skills",
      "score": 90,
      "description": "Very Good",
      "details": "Your CV effectively showcases soft skills such as teamwork, problem-solving, and leadership. Consider adding examples to further illustrate these skills in action.",
    },
    {
      "title": "Impact Score",
      "score": 80,
      "description": "Solid performance",
      "details": "Your CV provides a strong foundation. Further improvements in brevity, formatting, and emphasizing relevant achievements will help make it outstanding.",
    }],
  "suggestions": [
    { "title": "Impact", "content": ["Use more quantified achievements.", "Add action verbs."] },
    { "title": "Brevity", "content": ["Shorten long sentences.", "Avoid redundant information."] }
  ]
}

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
