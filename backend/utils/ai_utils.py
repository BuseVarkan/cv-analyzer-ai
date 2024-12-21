import openai
from config.api_keys import OPENAI_API_KEY
from prompts.extractor_prompt import system_prompt as extractor_system_prompt

client = openai.OpenAI(api_key=OPENAI_API_KEY)

def generate_suggestions(cv_text: str) -> str:

    prompt = "Review this CV and provide suggestions for improvement."

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": cv_text}
        ],
        temperature=0.0,
        max_tokens=1500
    )

    suggestions = completion.choices[0].message.content
    return suggestions

def pdf_extractor(resume_data):

    openai_client = openai.OpenAI(
        api_key = OPENAI_API_KEY
    )

    user_content = resume_data

    messages=[
        {"role": "system", "content": extractor_system_prompt()},
        {"role": "user", "content": user_content}
        ]

    response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.0,
                max_tokens=2500)
        
    data = response.choices[0].message.content

    return data