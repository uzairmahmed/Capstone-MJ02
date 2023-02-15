import paho.mqtt.client as mqtt
import firebase_admin, json, os
from firebase_admin import db
from firebase_admin import credentials
import datetime 

env_vars = os.environ.get("GCP_CREDENTIAL")
if env_vars == None:
    creds = "key.json"
else:
    creds = json.loads(env_vars)
cred = credentials.Certificate(creds)



firebase_admin.initialize_app(cred,{
    'databaseURL': 'https://home-iot-network-default-rtdb.firebaseio.com/'
})


def on_connect(client, userdata, flags, rc):  # The callback for when 
    print("Connected with result code {0}".format(str(rc)))  

def on_message(client, userdata, msg):  # The callback for when a PUBLISH 
    print(userdata)
    print(client)
    print("Message received")  # Print a received msg

    split = msg.topic.split('/')
    device = split[0]
    mode = split[1]
    message = msg.payload.decode('ascii').replace("'", '"').replace('/','SLASH')

    # print(device, mode, message)

    #Get time data is received 
    now = datetime.datetime.now()
    month = now.strftime('%B')
    day =  now.strftime('%d')
    current_time =  now.strftime('%B:%d:%H:%M:%S')

    pathString = now.isoformat().replace('.',':')

    print(json.loads(message))
    #Send data to firebase
    db.reference('/' + device + '/' + mode + '/' + pathString).set({
        'month' : month,
        'day': day,
        'current time': current_time,
        'stats':json.loads(message)
    })


client = mqtt.Client("broker")  # Create instance of client with client ID “digi_mqtt_test”
client.on_connect = on_connect  # Define callback function for successful connection
client.on_message = on_message  # Define callback function for receipt of a message
# client.connect("m2m.eclipse.org", 1883, 60)  # Connect to (broker, port, keepalive-time)
client.connect('127.0.0.1', 1883)
client.subscribe([
    ("router/logs",     1),
    ("router/control",  1),
    ("iOT_1/logs",      1),
    ("iOT_1/control",   1),
    ("iOT_2/logs",      1),
    ("iOT_2/control",   1),
    ("iOT_3/logs",      1),
    ("iOT_3/control",   1)
])
client.loop_forever()  # Start networking daemon

