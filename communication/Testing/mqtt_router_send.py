import paho.mqtt.client as mqtt

mqttc = mqtt.Client("digi_mqtt_test")  # Create instance of client with client ID “digitest”
mqttc.connect("192.168.1.116", 1883)  # Connect to (broker, port, keepalive-time)
mqttc.loop_start()  # Start networking daemon
for i in range(0,1):
    mqttc.publish("router/logs", "connected-device")  # Publish message to “digitest /test1” topic
mqttc.loop_stop()  # Kill networking daemon
