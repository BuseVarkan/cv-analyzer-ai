from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from config.api_keys import OPENAI_API_KEY
import PyPDF2

app = Flask(__name__)
CORS(app, supports_credentials=True)

client = openai.OpenAI(api_key=OPENAI_API_KEY)

@app.route('/process-cv', methods=['OPTIONS', 'POST'])
def process_cv():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    if 'cvFile' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['cvFile']

    try:
        pdf_reader = PyPDF2.PdfReader(file)
        cv_text = ""
        for page in pdf_reader.pages:
            cv_text += page.extract_text()

        if not cv_text.strip():
            return jsonify({"error": "No text found in the uploaded PDF"}), 400

        # Call OpenAI API
        prompt="Review this CV and provide suggestions for improvement."

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {
                    "role": "user",
                    "content": cv_text
                }
            ]
        )

        suggestions = completion.choices[0].message.content

        return jsonify({"suggestions": suggestions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
