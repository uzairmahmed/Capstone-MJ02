# Central Node Setup
- Raspberry Pi 4
- SSH via `root@192.168.1.184` password is `mj02`


## Setup: 
- Raspberry Pi Running PiOS Desktop
- Connected to Network Pi over Wireless with a static assigned IP
- Runs Mosquitto MQTT Broker as a Service
- Runs Python Firebase and MQTT Code as a Service
- Runs Node.js/React Web App on Boot

## Initial OS Setup
1. Using (Raspberry Pi Imager)[https://www.raspberrypi.com/software/], Flash a MicroSD Card with the default Raspberry Pi OS with the following extra settings:
   1. Set hostname to `raspberrypi.local`
   2. Enable SSH, with password authentication
   3. Set username and password
      1. username: `root`
      2. password: `mj02`
   4. Configure Wireless LAN
      1. SSID: `Capstone`
      2. Password: `capstoneMJ02`
      3. Wireless LAN country: CA
   5. Set Local Settings
      1. Timezone: `America/Toronto`
      2. Keyboard Layout: `us`
2. Plug the MicroSD into the Pi, along with a USB Mouse and Keyboard
<!-- 3. Follow the standard setup procedure, with these specific values:
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
   3. Click `OK` -->
6. On a PC connected to the Capstone Network, log into the OpenWRT dashboard:
   1. `192.168.1.1`
   2. Username: `root`
   3. Password: `mj02`
7. Scroll down to `Associated Stations` and look for a host called `raspberrypi.lan` 
8. Make note of the MAC and IP Address accociated with the host. (`DC:A6:32:CC:53:7C`, `192.168.1.143`)
9.  Go to `Network > DHCP and DNS > Static Leases`
10. Click `Add...` and configure the following:
   1.  Hostname: `raspberrypi.lan`
   2.  MAC address: `DC:A6:32:CC:53:7C (raspberrypi.lan)`
   3.  IPv4 Address: `192.168.1.143 (raspberrypi.lan)`
11. Click `Save` and `Save & Apply`

## MQTT Broker Setup
1. Open an SSH terminal (`pi@192.168.1.143`, password is `mj02`)
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

## React App Setup
1. Install NodeJS with the following commands
   ```
   sudo su -
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   sudo apt install -y gcc g++ make nodejs
   exit
   ```
3. Clone the Capstone-MJ02 repository with `git clone https://github.com/uzairmahmed/Capstone-MJ02` and login if needed
4. cd into `Capstone-MJ02/webapp/capstone-mj02`
5. Install NPM packages with `npm install`
6. Start the webapp with `npm start`

## Communication Setup
3. Install python dependencies with `pip3 install -r requirements.txt`
4. cd into `Capstone-MJ02/`
5. Copy `communication/services/firebase_collector.service` into `/etc/systemd/system` with `sudo cp Capstone-MJ02/communication/services/firebase_collector.service /etc/systemd/system`
6. `sudo systemctl daemon-reload`
7. `sudo systemctl enable firebase_collector.service`
8. `sudo systemctl start firebase_collector.service`
