from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/process-cv', methods=['OPTIONS', 'POST'])
def process_cv():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    data = request.json
    cv_text = data.get('cvText', '')

    if not cv_text:
        return jsonify({"error": "CV text is required"}), 400

    suggestions = "This is a suggestion"
    return jsonify({"suggestions": suggestions})

if __name__ == '__main__':
    app.run(debug=True)
