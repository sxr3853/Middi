from flask import Flask, request
from MeetupAPI import MeetupAPI

app = Flask(__name__)

@app.route('/search', methods=['POST'])
def search():
    content = request.get_json(silent=True)
    print(content)
    if 'addresses' not in content:
        return '{"error": "Addresses not sent"}'
    else:
        if 'keywords' in content:
            addresses = content['addresses']
            # keywords = ', '.join(content['keywords'])
            print(addresses)
            meetup = MeetupAPI()
            return str(meetup.get_nearby_place(addresses))

if __name__ == '__main__':
    app.run()