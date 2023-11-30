from flask import Flask, request, jsonify
from flask_cors import CORS
from difficulty_rating import difficulty_rating
from clarity_rating import clarity_rating
from tags_model import tags_model

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    review_text = data.get('review', '')

    # clarity rating
    clarity = clarity_rating(review_text)

    # difficulty rating
    difficulty = difficulty_rating(review_text)

    # tags

    tags = tags_model(review_text)

    # Create a dictionary to hold your results
    result = {'clarity': clarity, 'difficulty': difficulty, 'tags': tags}

    # Return the JSON response using jsonify
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
