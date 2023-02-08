import paho.mqtt.client as mqtt
import subprocess, re, json

def list_connected_clients():
    cmd = 'iw'
    temp = subprocess.Popen([cmd, 'dev', 'wlan0', 'station', 'dump'], stdout = subprocess.PIPE)
    output = temp.communicate()[0]
    return output.decode('ascii')

def parse_connected_clients(listed):
    jsonList = {}

    macSearch = "([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}"
    split_stations = listed.split('Station ')
    del split_stations[0]
    for station in split_stations:
        temp_mac_address = re.search(macSearch, station).group()
        jsonList[temp_mac_address] = {}

        split_lines = station.split('\n')
        print('new station')
        del split_lines[-1]
        del split_lines[0]
        for line in split_lines:
            line = line.replace("\t", "")
            split_line = line.split(":")
            key = split_line[0]
            val = split_line[1]
            jsonList[temp_mac_address][key] = val
    
    return jsonList

def send_values_over_mqtt(connected_devices):
    mqttc = mqtt.Client("router_node")
    mqttc.connect("192.168.1.184", 1883)  # Connect to (broker, port, keepalive-time)
    mqttc.publish("router/logs", json.dumps(connected_devices))

if __name__ == '__main__':
    listed = list_connected_clients()
    parse_connected_clients(listed)
