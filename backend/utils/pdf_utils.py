import PyPDF2

def extract_text_from_pdf(pdf_file) -> str:
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    cv_text = ""
    for page in pdf_reader.pages:
        cv_text += page.extract_text() or ""
    return cv_text

def clean_and_structure_cv_text(text: str) -> dict:
    section_patterns = {
        'personal_info': [
            'personal information', 'personal details', 'contact', 'profile',
            'about me', 'summary', 'personal profile'
        ],
        'work_experience': [
            'work experience', 'employment history', 'professional experience',
            'experience', 'work history', 'career history', 'professional background'
        ],
        'education': [
            'education', 'academic background', 'academic history',
            'educational background', 'qualifications', 'academic qualifications'
        ],
        'skills': [
            'skills', 'technical skills', 'key skills', 'core competencies',
            'competencies', 'expertise', 'professional skills'
        ],
        'certifications': [
            'certifications', 'certificates', 'professional certifications',
            'accreditations', 'professional development'
        ],
        'languages': [
            'languages', 'language skills', 'language proficiency'
        ],
        'projects': [
            'projects', 'key projects', 'project experience',
            'relevant projects'
        ],
        'volunteering': [
            'volunteer', 'volunteering', 'voluntary work',
            'community service', 'community involvement'
        ]
    }

    structured_content = {
        'unknown': []
    }
    
    lines = text.split('\n')
    current_section = 'unknown'
    current_content = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        line = line.replace('?', '').replace('�', '')
        
        lower_line = line.lower()
        found_section = False
        
        for section, patterns in section_patterns.items():
            if any(pattern in lower_line for pattern in patterns):
                if current_content:
                    if current_section not in structured_content:
                        structured_content[current_section] = []
                    structured_content[current_section].append('\n'.join(current_content))
                    current_content = []
                
                current_section = section
                found_section = True
                break
        
        if not found_section:
            current_content.append(line)
    
    if current_content:
        if current_section not in structured_content:
            structured_content[current_section] = []
        structured_content[current_section].append('\n'.join(current_content))

    return structured_content

def format_structured_content(structured_content: dict) -> str:
    formatted_text = []
    
    section_titles = {
        'personal_info': 'Personal Information',
        'work_experience': 'Work Experience',
        'education': 'Education',
        'skills': 'Skills',
        'certifications': 'Certifications',
        'languages': 'Languages',
        'projects': 'Projects',
        'volunteering': 'Volunteering',
        'unknown': 'Additional Information'
    }
    
    for section, content in structured_content.items():
        if content:
            formatted_text.append(f"\n### {section_titles.get(section, section)}\n")
            for block in content:
                formatted_text.append(block.strip())
                formatted_text.append("\n")
    
    return '\n'.join(formatted_text)