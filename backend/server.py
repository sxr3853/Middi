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
    if 'addresses' not in content:
        return '{"error": "Addresses not sent"}'
    else:
        if 'keywords' in content:
            addresses = content['addresses']
            keywords = content['keywords']
            print(addresses)
            meetup = MeetupAPI()
            return json.dumps(meetup.get_nearby_place(addresses, keywords=keywords)._asdict())
    return None


if __name__ == '__main__':
    app.run()