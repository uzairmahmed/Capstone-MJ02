# OrangePi Zero2 Ubuntu OS Setup Steps
OrangePi Zero2

---
sources:
http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/service-and-support/Orange-Pi-Zero-2.html

https://pimylifeup.com/raspberry-pi-mosquitto-mqtt-server/

---

## Initial Setup
1. Download the ubuntu firmware for OrangePi Zero 2
2. With Raspberry Pi Imager, flash the Pi's MicroSD Card with the custom tar.gz file
3. Pi was powered on, and connected to monitor
4. `nmcli radio wifi` to ensure wifi radio is enabled
5. `nmcli dev wifi list`
6. `nmcli --ask dev wifi connect <SSID>` and enter password
7. `sudo apt update`
8. `sudo apt upgrade`

## Install and Test MQTT Implementation
9.  `sudo apt install mosquitto mosquitto-clients`
10. `sudo systemctl status mosquitto`
11. `screen`
12. setup subscriber with `mosquitto_sub -h localhost -t "mqtt/hw"`
13. Ctrl A, c
14. `mosquitto_pub -h localhost -t "mqtt/hw" -m "hehllo"`
15. Ctrl A, 0
16. If "hehllo" shows up in terminal, your MQTT implementation works!

from here, setup mosquitto client on multiple Pi devices, all with their own tags for MQTT communication.

next steps:
    - create arch for different mqtt tags, with a service for every subscriber tag
    - get zabbix working on client and server
