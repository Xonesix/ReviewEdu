from flask import Flask, request, jsonify
from flask_cors import CORS
from difficulty_rating import difficulty_rating
from clarity_rating import clarity_rating

app = Flask(__name__)
CORS(app)

@app.route('/')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    review_text = data.get('review', '')

    # clarity rating
    result = clarity_rating(review_text)

    # difficulty rating
    result = difficulty_rating(review_text)

    #tags


    print(review_text);

    response = jsonify({'result': result})

    # maybe return an array? figure this out
    return response



if __name__ == '__main__':
    app.run(debug=True)
