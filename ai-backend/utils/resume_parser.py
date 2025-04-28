import os
import json
import google.generativeai as genai # type: ignore
import PyPDF2 as pdf # type: ignore
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-1.5-pro')

def extract_text_from_pdf(uploaded_file):
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def process_resume(resume_file, jd_text):
    resume_text = extract_text_from_pdf(resume_file)

    prompt = f"""
Act as an expert ATS (Applicant Tracking System) analyst with deep expertise in technical recruiting. Evaluate the following resume against the job description and respond with match %, missing keywords, and a profile summary.

Resume:
{resume_text}

Job Description:
{jd_text}

Respond in this exact JSON format:
{{
  "JD Match": "X%",
  "MissingKeywords": ["keyword1", "keyword2", ...],
  "Profile Summary": "Your summary here"
}}
"""

    response = model.generate_content(prompt)

    try:
        # Extract JSON block using regex
        json_match = re.search(r"\{.*\}", response.text, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON found")

        gemini_json = json.loads(json_match.group())

        return {
            "match_percentage": gemini_json.get("JD Match", "0%"),
            "missing_keywords": gemini_json.get("MissingKeywords", []),
            "summary": gemini_json.get("Profile Summary", "No summary available")
        }

    except Exception as e:
        print("⚠️ Error parsing Gemini response:", e)
        print("Raw Gemini response:", response.text)

        return {
            "match_percentage": "0%",
            "missing_keywords": [],
            "summary": "Error parsing AI response"
        }
