from flask import Flask, request
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
    if 'addresses' not in content:
        return '{"error": "Addresses not sent"}'
    else:
        if 'keywords' in content:
            addresses = content['addresses']
            keywords = content['keywords']
            print(addresses)
            meetup = MeetupAPI()
            res, people_loc = meetup.get_nearby_place(addresses, keywords=keywords)
            if not res:
                return 'No common point, search with other keywords.'
            else:
                m = res._asdict()
                m['people_loc'] = people_loc
                return json.dumps(m)
    return None


if __name__ == '__main__':
    app.run()
