import paho.mqtt.client as mqtt
import subprocess, re, json, threading, psutil

def list_connected_clients():
    cmd = 'iw'
    temp = subprocess.Popen([cmd, 'dev', 'wlan0', 'station', 'dump'], stdout = subprocess.PIPE)
    output = temp.communicate()[0]
    return output.decode('ascii')

def get_hosts():
    temp = subprocess.Popen(['ubus', 'call', 'luci-rpc', 'getHostHints'], stdout = subprocess.PIPE)
    output = temp.communicate()[0]
    raw = json.loads(output.decode('ascii'))
    temp = {}
    for key in raw:
      try: 
        ip_addr = raw[key]['ipaddrs'][0]
      except IndexError as e: 
         ip_addr = "None"

      try: 
        ip6_addr = raw[key]['ip6addrs'][0]
      except IndexError as e:
        ip6_addr = "None"

      try: 
        hostname = raw[key]['name']      
      except KeyError as e:
        hostname = "Unknown"

      temp[key] = {
        "ip_address" : ip_addr,
        "ip6_address" : ip6_addr,
        "hostname_val" :hostname
      }

    return temp

def parse_connected_clients(listed, addresses):
    jsonList = {}

    macSearch = "([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}"
    split_stations = listed.split('Station ')
    del split_stations[0]
    for station in split_stations:
        temp_mac_address = re.search(macSearch, station).group().upper()
        jsonList[temp_mac_address] = addresses[temp_mac_address]
        
        split_lines = station.split('\n')
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
    # threading.Timer(60.0, getOSValues).start()
    
    total_CPUs = psutil.cpu_count(),
    avg_loads = [x / psutil.cpu_count() * 100 for x in psutil.getloadavg()]

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

    listed = list_connected_clients()
    addresses = get_hosts()
    connected_devices = parse_connected_clients(listed, addresses)

    logDict = {
      **vals,
      "devices": connected_devices
      }
    
    send_values_over_mqtt(logDict)
    return vals

def send_values_over_mqtt(vals):
    mqttc = mqtt.Client("router_node")
    mqttc.connect("192.168.1.143", 1883)  # Connect to (broker, port, keepalive-time)
    
    mqttc.publish("router/logs", json.dumps(vals))

def main():  # Create instance of client with client ID “digi_mqtt_test”

    osValues = getOSValues()
    
    # print(logDict)

    # send_values_over_mqtt(logDict)

if __name__ == '__main__':
    main()