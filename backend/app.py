from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.ai_utils import generate_suggestions
from utils.pdf_utils import extract_text_from_pdf

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route('/process-cv', methods=['OPTIONS', 'POST'])
def process_cv():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    if 'cvFile' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['cvFile']

    try:
        cv_text = extract_text_from_pdf(file)

        if not cv_text.strip():
            return jsonify({"error": "No text found in the uploaded PDF"}), 400

        
        suggestions = generate_suggestions(cv_text)

        return jsonify({"suggestions": suggestions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
