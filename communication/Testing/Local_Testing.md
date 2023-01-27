Steps to run local MQTT Testing
1. install mosquitto
2. install python dependencies (paho-mqtt, firebase_admin)
3. in mosquitto.conf add these to the top
   1. allow_anonymous true
   2. listener 1883 0.0.0.0
4. restart mosquittio
5. run python file
