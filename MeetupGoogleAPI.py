import json
import requests
import sys
from collections import namedtuple
import geocoder

class MeetupGoogleAPI:

    API_KEY = ''

    def __init__(self):
        self.nearby_search_burl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
        self.text_search_burl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
        self.distance_matrix_burl = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
        self.Place = namedtuple('Place', ['id',
                                          'name', 
                                          'location', 
                                          'address',
                                          'rating',
                                          'price_level',
                                          'time'
                                          ])
        self.my_location = None

    def make_request(self, base, payload):
        r = requests.get(base, params=payload)
        if r.status_code != 200:
            print('HTTP status code {}'.format(r.status_code))
        else:
            try:
                data = json.loads(r.text)
                return data
            except ValueError:
                print('Error in JSON response')
        return None

    def get_loc_from_ip(self, ip):
        g = geocoder.ip(str(ip))
        location = '{}, {}'.format(g.latlng[0], g.latlng[1])
        return location

    def get_places_from_json(self, data):
        places = list()
        for result in data['results']:
            place = self.Place(id=result['id'],
                               name=result['name'],
                               location='{}, {}'.format(result['geometry']['location']['lat'],
                                                        result['geometry']['location']['lng']),
                               address=result['vicinity'],
                               rating=result.get('rating', None),
                               price_level=result.get('price_level', None),
                               time=int(self.get_time_from_distance(self.my_location, result['vicinity']).split(' ')[0]))
            places.append(place)
        return places

    def get_time_from_distance(self, origin, dest):
        payload = {
            'origins' : origin,
            'destinations' : dest, 
            'mode' : 'driving',
            'api_key' : self.API_KEY
        }
        data = self.make_request(self.distance_matrix_burl, payload)
        return data['rows'][0]['elements'][0]['duration']['text']


    def search_nearby_places_helper(self, location, radius, type):
        payload = {
            'location': location,
            'radius': radius,
            'type': type,
            'key': self.API_KEY
        }
        data = self.make_request(self.nearby_search_burl, payload)
        if data is not None:
            places =  self.get_places_from_json(data)
            return places
        return None


    def search_nearby_places(self, address, radius=50000, type='restaurant'):
        if len(address.split('.')) > 1:
            return self.search_by_ip(address, radius, type)
        else:
            return self.search_by_address(address, radius, type)

    def search_by_ip(self, ip, radius=100, type='restaurant'):
        # check if the ip is correct
        # TODO

        # get location from the ip
        location = self.get_loc_from_ip(ip)
        return self.search_nearby_places_helper(location, radius, type)

    def search_by_address(self, address, radius, type='restaurant'):
        print('Working on getting location')
        payload = {
            'query': address,
            'key': self.API_KEY
        }
        data = self.make_request(self.text_search_burl, payload)
        location = '{}, {}'.format(data['results'][0]['geometry']['location']['lat'],
                                   data['results'][0]['geometry']['location']['lng'])
        self.my_location = location
        print('Working on getting nearby places: {}'.format(location))
        return self.search_nearby_places_helper(location, radius, type)

# m = MeetupGoogleAPI()
# m.search_nearby_places('1 AT&T Way, Arlington, TX 76011')