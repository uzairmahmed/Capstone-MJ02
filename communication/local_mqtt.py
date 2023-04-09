import paho.mqtt.client as mqtt
import firebase_admin, json, os, threading, psutil, subprocess
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

client = mqtt.Client("laptop")

def on_connect(client, userdata, flags, rc):  # The callback for when 
    print("Connected with result code {0}".format(str(rc)))

# MQTT Listener
def on_message(client, userdata, msg):  # The callback for when a PUBLISH 
    print(userdata)
    print(client)

    split = msg.topic.split('/')
    device = split[0]
    mode = split[1]

    message = msg.payload.decode('ascii').replace("'", '"').replace('/','SLASH')
    print(device + "(" + mode + ") said: " + message)

    if mode != "debug":
        now = datetime.datetime.now()
        pathString = now.isoformat().replace('.',':')

        logDict = {"date":now.isoformat(),**json.loads(message)}
        print(logDict)


def getOSValues():
    threading.Timer(300.0, getOSValues).start()
    
    total_CPUs = psutil.cpu_count(),
    avg_loads = [x / psutil.cpu_count() * 100 for x in psutil.getloadavg()]

    collector_command = ['service', 'firebase_collector', 'status']
    server_command = ['service', 'react_server', 'status']
    kiosk_command = ['service', 'kiosk', 'status']

    vals = {
        "total_memory": psutil.virtual_memory().total,
        "used_memory": psutil.virtual_memory().used,
        "total_swap": psutil.swap_memory().total,
        "used_swap": psutil.swap_memory().used,
        "total_disk": psutil.disk_usage('/').total,
        "used_disk": psutil.disk_usage('/').used,
        "avg_load_1_min": avg_loads[0],
        "firebase_collector": not bool (subprocess.call(collector_command, stdout = subprocess.PIPE)),
        "react_server": not bool (subprocess.call(server_command, stdout = subprocess.PIPE)),
        "kiosk_display": not bool (subprocess.call(kiosk_command, stdout = subprocess.PIPE)),
    }

def main():  # Create instance of client with client ID “digi_mqtt_test”
    client.on_connect = on_connect  # Define callback function for successful connection
    client.on_message = on_message  # Define callback function for receipt of a message
    client.connect('localhost', 1883)
    client.subscribe([
        ("router/logs",     1),
        ("central/logs",     1),
        ("iOT_1/logs",      1),
        ("iOT_2/logs",      1),
        ("iOT_1/control",      1),
        ("iOT_2/control",      1),
        ("iOT_1/debug",      1),
        ("iOT_2/debug",      1),
    ])
    getOSValues()

    client.loop_forever()  # Start networking daemon

if __name__ == '__main__':
    main()
