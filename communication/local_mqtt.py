import paho.mqtt.client as mqtt
import json

client = mqtt.Client("laptop")

def on_connect(client, userdata, flags, rc):  # The callback for when 
    print("Connected with result code {0}".format(str(rc)))  

# MQTT Listener
def on_message(client, userdata, msg):  # The callback for when a PUBLISH 
    print(userdata)
    print(client)
    print("Message received")  # Print a received msg

    split = msg.topic.split('/')
    device = split[0]
    mode = split[1]
    message = msg.payload.decode('ascii').replace("'", '"').replace('/','SLASH')

    print(json.loads(message))

def main():  # Create instance of client with client ID “digi_mqtt_test”
    client.on_connect = on_connect  # Define callback function for successful connection
    client.on_message = on_message  # Define callback function for receipt of a message
    client.connect("192.168.1.143", 1883)  # Connect to (broker, port, keepalive-time)
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

if __name__ == '__main__':
    main()
