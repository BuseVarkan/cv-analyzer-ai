import json
import PyPDF2

def extract_text_from_pdf(pdf_file) -> str:
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    cv_text = ""
    for page in pdf_reader.pages:
        cv_text += page.extract_text() or ""
    return cv_text


def extract_json(chatgpt_output):
    start_delimiter = "```json"
    end_delimiter = "```"

    start_index = chatgpt_output.find(start_delimiter)
    if start_index == -1:
        raise ValueError(f"Start delimiter '{start_delimiter}' not found.")

    start_index += len(start_delimiter)

    end_index = chatgpt_output.find(end_delimiter, start_index)
    if end_index == -1:
        json_str = chatgpt_output[start_index:].strip()
    else:
        json_str = chatgpt_output[start_index:end_index].strip()

    return json_str