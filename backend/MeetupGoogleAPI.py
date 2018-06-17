import json
import requests
import sys
from collections import namedtuple
import geocoder
import math

class MeetupGoogleAPI:

    API_KEY = 'AIzaSyDiAF1HBzcTGFFfGHA5bopIEMyrsUmOSBs'

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


    def get_distance(self, lat1,lon1,lat2,lon2):
        R = 6371
        dLat = self.deg2rad(lat2-lat1)
        dLon = self.deg2rad(lon2-lon1)
        a = math.sin(dLat/2) * math.sin(dLat/2) + \
            math.cos(self.deg2rad(lat1)) * math.cos(self.deg2rad(lat2)) * \
            math.sin(dLon/2) * math.sin(dLon/2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        d = R * c
        return d
        

    def deg2rad(self, deg):
        return deg * (math.pi/180)
    

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
                               time=self.get_distance(self.my_location[0], self.my_location[1],
                                                 result['geometry']['location']['lat'], result['geometry']['location']['lng']))
                            #    time=int(self.get_time_from_distance(self.my_location, result['vicinity']).split(' ')[0]))
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
        print(type)
        payload = {
            'location': location,
            'radius': radius,
            'keyword': type,
            'type': 'restaurant',
            'key': self.API_KEY
        }
        data = self.make_request(self.nearby_search_burl, payload)
        if data is not None:
            places =  self.get_places_from_json(data)
            return places
        return None


    def search_nearby_places(self, address, type, radius=30000):
        if len(address.split('.')) > 1:
            return self.search_by_ip(address, radius, type)
        else:
            return self.search_by_address(address, radius, type)

    def search_by_ip(self, ip, radius, type):
        # check if the ip is correct
        # TODO

        # get location from the ip
        location = self.get_loc_from_ip(ip)
        return self.search_nearby_places_helper(location, radius, type)

    def search_by_address(self, address, radius, type):
        print('Working on getting location')
        payload = {
            'query': address,
            'key': self.API_KEY
        }
        data = self.make_request(self.text_search_burl, payload)
        self.my_location = [data['results'][0]['geometry']['location']['lat'],
                           data['results'][0]['geometry']['location']['lng']]
        location = '{}, {}'.format(self.my_location[0], self.my_location[1])

        # self.my_location = location
        print('Working on getting nearby places: {}'.format(location))
        return self.search_nearby_places_helper(location, radius, type)

# m = MeetupGoogleAPI()
# m.search_nearby_places('408 kerby street, arlington tx', type='restaurant')
