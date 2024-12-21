import json
import PyPDF2

def extract_text_from_pdf(pdf_file) -> str:
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    cv_text = ""
    for page in pdf_reader.pages:
        cv_text += page.extract_text() or ""
    return cv_text

