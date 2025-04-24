from flask import Flask, request, jsonify
from utils.resume_parser import process_resume
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return "AI Resume Parser Flask API is running!"


@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    resume = request.files.get('resume')
    jd = request.form.get('jd')

    if not resume or not jd:
        return jsonify({'error': 'Missing required fields'}), 400

    result = process_resume(resume, jd)

    print("Gemini response:")
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)