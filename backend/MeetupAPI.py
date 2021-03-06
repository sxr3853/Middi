from MeetupGoogleAPI import MeetupGoogleAPI
import statistics

class MeetupInfo:

    def __init__(self, time_list, place_info):
        self.avg = sum(time for time in time_list) / len(time_list)
        self.std_dev = statistics.stdev(time_list)
        self.place_info = place_info


class MeetupAPI:

    def __init__(self):
        self.meetup_google_api = MeetupGoogleAPI()
    
    def create_person_map(self, places):
        person_map = {}
        for place in places:
            person_map[place.id] = place
        return person_map

    def create_lookup_table(self, addresses, keywords):
        person_lookup_table = list()
        people_locations = []
        for address in addresses:
            places = self.meetup_google_api.search_nearby_places(address, keywords)
            person_map = self.create_person_map(places)
            person_lookup_table.append(person_map)

        return person_lookup_table, people_locations


    def create_meetup_info_table(self, person_lookup_table):
        meetup_list= list()
        first_person = person_lookup_table[0]
        for place_id, place in first_person.items():
            time_list = [place.time]
            common_place = True
            for i in range(1, len(person_lookup_table)):
                person = person_lookup_table[i]
                if place_id not in person:
                    common_place = False
                    break
                else:
                    time_list.append(person[place_id].time)
            if common_place:
                meetup_list.append(MeetupInfo(time_list, place))
        return meetup_list

    def get_nearby_place(self, addresses, keywords=['restaurant', 'coffee']):
        print('Working on creating a lookup table')
        person_lookup_table, people_locations = self.create_lookup_table(addresses, keywords)
        print('Working on finding common place to meet')
        meetup_list = self.create_meetup_info_table(person_lookup_table)
        mlist = sorted(meetup_list, key=lambda x: x.avg+x.std_dev)
        if not mlist:
            return None
        else:
            people_locations = self.meetup_google_api.my_locations
            res_map = mlist[0].place_info._asdict()
            res_map['people_loc'] = people_locations
            return res_map
        # for place_id, meetup_info in meetup_info_table.items():
        #     print('{} {}\n {}'.format(meetup_info.std_dev, meetup_info.avg, meetup_info.place_info))