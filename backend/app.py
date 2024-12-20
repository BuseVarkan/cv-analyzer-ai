from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.ai_utils import generate_suggestions
from utils.pdf_utils import extract_text_from_pdf, clean_and_structure_cv_text, format_structured_content

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
        
        structured_content = clean_and_structure_cv_text(raw_text)
        formatted_text = format_structured_content(structured_content)
            
        return jsonify({
            "cv_text": formatted_text,
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
        cv_text = data.get('cv_text', '')
        
        if not cv_text.strip():
            return jsonify({"error": "No text provided"}), 400
            
        suggestions = generate_suggestions(cv_text)
        return jsonify({"suggestions": suggestions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
