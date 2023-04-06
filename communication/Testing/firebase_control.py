import paho.mqtt.client as mqtt
import firebase_admin, json
from firebase_admin import db
from firebase_admin import credentials
import datetime 

cred = credentials.Certificate('key.json')
firebase_admin.initialize_app(cred,{
    'databaseURL': 'https://home-iot-network-default-rtdb.firebaseio.com/'
})

def routerListener(event):
    print(event.event_type)  # can be 'put' or 'patch'
    print(event.path)  # relative to the reference, it seems
    print(event.data)  # new data at /reference/event.path. None if deleted
    print('yerrr')

    #send message to device1 as control



