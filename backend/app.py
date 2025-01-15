import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.ai_utils import generate_questions, generate_suggestions, pdf_extractor
from utils.pdf_utils import extract_text_from_pdf, extract_json

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
        if not job_description:
            return jsonify({"error": "No job description provided"}), 400
            
        suggestions = generate_suggestions(cv_json, job_description)

        suggestions = extract_json(suggestions)

        json_suggestions = json.loads(suggestions)
        return jsonify({"suggestions": json_suggestions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/generate-questions', methods=['OPTIONS', 'POST'])
def generate_questions_endpoint():
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
        if not job_description:
            return jsonify({"error": "No job description provided"}), 400
        
        questions = generate_questions(cv_json, job_description)
        
        questions = extract_json(questions)

        json_questions = json.loads(questions)

        return jsonify({"questions": json_questions})


        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
