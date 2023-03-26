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

def getOSValues():
    threading.Timer(60.0, getOSValues).start()
    
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
        "network_logging": True,
    }

    return vals

def send_values_over_mqtt(connected_devices):
    mqttc = mqtt.Client("router_node")
    mqttc.connect("192.168.1.143", 1883)  # Connect to (broker, port, keepalive-time)
    
    mqttc.publish("router/logs", json.dumps(connected_devices))

def main():  # Create instance of client with client ID “digi_mqtt_test”
    listed = list_connected_clients()
    connected_devices = parse_connected_clients(listed)
    osValues = getOSValues()
    logDict = {**osValues,connected_devices}
    print(logDict)

    send_values_over_mqtt(connected_devices)

if __name__ == '__main__':
    main()