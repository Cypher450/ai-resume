from flask import Flask, request, jsonify, render_template # type: ignore
from utils.resume_parser import process_resume
from flask_cors import CORS # type: ignore


app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)



@app.route('/')
def home():
    return render_template('index.html')


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