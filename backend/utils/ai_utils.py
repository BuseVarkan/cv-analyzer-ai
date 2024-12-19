import openai
from config.api_keys import OPENAI_API_KEY

client = openai.OpenAI(api_key=OPENAI_API_KEY)

def generate_suggestions(cv_text: str) -> str:

    prompt = "Review this CV and provide suggestions for improvement."

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": cv_text}
        ]
    )

    suggestions = completion.choices[0].message.content
    return suggestions
