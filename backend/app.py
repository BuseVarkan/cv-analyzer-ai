from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = "your_openai_api_key"

@app.route('/process-cv', methods=['POST'])
def process_cv():
    data = request.json
    cv_text = data.get('cvText', '')

    if not cv_text:
        return jsonify({"error": "CV text is required"}), 400

    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Review this CV and suggest improvements:\n\n{cv_text}",
            max_tokens=500
        )
        suggestions = response.choices[0].text.strip()
        return jsonify({"suggestions": suggestions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
