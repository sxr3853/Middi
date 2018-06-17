from flask import Flask, request, render_template
from MeetupAPI import MeetupAPI
import json

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/search', methods=['POST'])
def search():
    content = request.get_json(silent=True)
    print(content)
    if 'locations' not in content:
        return '{"error": "Locations not sent"}'
    else:
        if 'keywords' in content:
            locations = content['locations']
            keywords = content['keywords']
            print(locations)
            meetup = MeetupAPI()
            res = meetup.get_nearby_place(addresses, keywords=keywords)
            if not res:
                return 'No common point, search with other keywords.'
            else:
                return json.dumps(res)
    return None


if __name__ == '__main__':
    app.run()
