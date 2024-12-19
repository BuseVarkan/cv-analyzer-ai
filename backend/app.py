from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from config.api_keys import OPENAI_API_KEY

app = Flask(__name__)
CORS(app, supports_credentials=True)

client = openai.OpenAI(api_key=OPENAI_API_KEY)

@app.route('/process-cv', methods=['OPTIONS', 'POST'])
def process_cv():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight OK'}), 200

    data = request.json
    cv_text = data.get('cvText', '')

    if not cv_text:
        return jsonify({"error": "CV text is required"}), 400

    try:
        # Call OpenAI API
        prompt="Review this CV and provide suggestions for improvement."

        # completion = client.chat.completions.create(
        #     model="gpt-4o-mini",
        #     messages=[
        #         {"role": "system", "content": prompt},
        #         {
        #             "role": "user",
        #             "content": cv_text
        #         }
        #     ]
        # )

        # suggestions = completion.choices[0].message.content

        suggestions = """
Here are some suggestions for improving your CV, especially considering the prestigious background of studying at Harvard: 1. **Professional Formatting**: Ensure your CV is well-organized and visually appealing. Use consistent fonts, sizes, and spacing. Utilize headings and bullet points for ease of reading. 2. **Header Information**: Start with your name in a larger font and include your contact information (phone number, email, LinkedIn profile) right below your name. 3. **Education Section**: - Clearly list your degree(s) earned, the field of study, and the dates of attendance (e.g., "Bachelor of Arts in Psychology, Harvard University, 2020"). - If you graduated with honors (cum laude, summa cum laude, etc.), be sure to include that. 4. **Experience Section**: - Detail any relevant work experiences or internships. Include the company/organization name, your role, and the dates you worked there. - Use bullet points to describe your responsibilities and achievements in each position. Focus on quantifiable achievements, such as "Increased engagement by 30% through targeted marketing strategies." 5. **Skills Section**: - Include a skills section that highlights both hard and soft skills relevant to the jobs you're applying for. - Consider skills like project management, data analysis, communication, teamwork, and any technical skills specific to your field. 6. **Projects and Research**: - If applicable, add a section highlighting significant academic projects, research experience, or publications. Include a brief description of your role and the outcomes. 7. **Extracurricular Activities**: - List any clubs, organizations, or volunteer work you were involved in at Harvard or elsewhere. Highlight leadership roles or initiatives you led. 8. **Professional Development**: - Include any certifications, workshops, or additional training that demonstrate your commitment to your field and ongoing professional development. 9. **Tailor Your CV**: Always tailor your CV for the specific job or field you're applying for. Use keywords from the job description to help your CV stand out to recruiters. 10. **Proofread**: Carefully proofread for any spelling or grammatical errors, as attention to detail is crucial in a CV. By following these tips, your CV will better highlight your education and experiences, making it a more effective tool in your job search. Good luck!"""
        return jsonify({"suggestions": suggestions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
