# Central Node Setup
- Raspberry Pi 3B+
- SSH via `central@192.168.1.184` password is `mj02`


## Setup: 
- Raspberry Pi Running PiOS Desktop
- Connected to Network Pi over Wireless with a static assigned IP
- Runs Mosquitto MQTT Broker as a Service
- Runs Python Firebase and MQTT Code as a Service
- Runs Node.js/React Web App on Boot

## Initial OS Setup
1. Using (Raspberry Pi Imager)[https://www.raspberrypi.com/software/], Flash a MicroSD Card with the default Raspberry Pi OS
2. Plug the MicroSD into the Pi, along with a USB Mouse and Keyboard, and HDMI to a monitor and Power it on.
3. Follow the standard setup procedure, with these specific values:
   1. System:
      1. Username: `central`
      2. Password: `mj02`
   2. WiFi Connection
      1. SSID: `Capstone`
      2. Password: `capstoneMJ02`
4. Wait for the Pi to finish installing updates and restart.
5. Once rebooted, go to `Raspberry Pi Logo > Preferences > Raspberry Pi Configuration`
   1. Go to `System` and enable `Network at Boot`
   2. Go to `Interfaces` and enable `SSH`, `VNC`
   3. Click `OK`
6. On a PC connected to the Capstone Network, log into the OpenWRT dashboard:
   1. `192.168.1.1`
   2. Username: `root`
   3. Password: `mj02`
7. Scroll down to `Associated Stations` and look for a host called `raspberrypi.lan` 
8. Make note of the MAC and IP Address accociated with the host. (`B8:27:EB:71:CA:37`, `192.168.1.184`)
9.  Go to `Network > DHCP and DNS`
10. Click `Add...` and configure the following:
   1.  MAC address: `B8:27:EB:71:CA:37 (raspberrypi.lan)`
   2.  IPv4 Address: `192.168.1.184 (raspberrypi.lan)`
11. Click `Save` and `Save & Apply`

## MQTT Broker Setup
1. Open an SSH terminal (`central@192.168.1.184`, password is `mj02`)
2. Install Python and Mosquitto with the following commands:
   1. `sudo apt install -y python3-pip mosquitto mosquitto-clients`
   2. `sudo systemctl enable mosquitto.service`
3. Edit the mosquitto.conf file with the following command:
   1. `sudo nano /etc/mosquitto/conf.d/mosquitto.conf`
   2. ```sh
      allow_anonymous true
      listener 1883 0.0.0.0
      ```
   3. `sudo service mosquitto restart`
4. 