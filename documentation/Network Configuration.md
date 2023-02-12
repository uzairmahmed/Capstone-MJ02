# Wireless Network Setup
- Raspberry Pi 3B+
- TP-Link UE306 - USB 3.0 to RJ45 Gigabit Ethernet Dongle (`asix-ax88179`)
- SSH via `root@192.168.1.1`, password is `mj02`

## Setup: 
- Raspberry Pi Running OpenWRT as Router
- Wired WAN Interface over USB Ethernet Dongle
- Wired WAN Interface over iPhone connected via USB
- Wired LAN Interface over Built-in Ethernet
- Wireless LAN Interface over Wireless Radio
- Ryerson Wireless Configuration Certificates
- VPN Connection over OpenVPN Protocol, using ExpressVPN **planned*

## Initial OS Setup
1. Go to [OpenWRT/Raspberry Pi/Installation](https://openwrt.org/toh/raspberry_pi_foundation/raspberry_pi#installation)
2. Download the following:
   1. Firmware for Raspberry Pi 3B+ (`openwrt-22.03.3-bcm27xx-bcm2710-rpi-3-ext4-factory.img.gz`)
   2. Raspberry Pi 3B+ Firmware Update (`openwrt-22.03.3-bcm27xx-bcm2710-rpi-3-ext4-sysupgrade.img.gz`)
3. Using (Raspberry Pi Imager)[https://www.raspberrypi.com/software/], Flash a MicroSD Card with the Firmware file
4. Plug the MicroSD into the Pi, Connect the Pi to your PC over Ethernet, and Power it on.
5. In a browser, go to `192.168.1.1` and login with no password
6. Go to `System > Backup/Flash Firmware > Flash new Firmware Image`, and upload the Firmware Update file

## WLAN and WAN Setup
1. Refresh, reconnect if needed, and log in again
2. In `Network > Wireless`, enable the Wifi Radio
3. Connect to the Pi over WiFi, (Network is called `OpenWRT`)
4. Connect the Pi to your Router over Ethernet, and Reboot
5. Go to `Network > Interfaces > Devices > br-lan > Configure...` and remove `eth0` from `Bridge ports`
6. Click `Save`, and then `Save and Apply`
7. Go to `Interfaces > Add new interface...` and set the following:
   1. Name: `wan`
   1. Protocol: `DHCP client`
   2. Device: `eth0`
   3. Firewall Settings: Add `wan` to `Create/Assign firewall-zone`
8. Click `Save`, and then `Save and Apply`   
   
## USB WAN and Wired LAN Setup
1. Go to `System > Software`
2. Click `Update lists...`
3. Under Filter, type `asix` and install the following:
   1. `kmod-usb-net-asix`
   2. `kmod-usb-net-asix-ax88179`
4. Unplug Ethernet from Pi, Connect to USB Ethernet Dongle, and Plug into Pi over USB
5. Go to `Network > Interfaces > WAN > Edit`, and set device to `eth1` (USB Ethernet)
6. Go to `Devices > br-lan > Configure...` and add `eth0` from `Bridge ports`
7. Disconnect Computer from Pi's WiFi network, and connect it to the Pi over its built-in ethernet port

## Security
1. Go to `Network > Wireless > Edit > Interface Configuration` and set the following:
   1. ESSID: `Capstone`
   2. Wireless Security
      1. Encryption: `WPA2-PSK`
      2. Key: `capstoneMJ02`
2. Click `Save`, and then `Save and Apply`   
3. Go to `System > Administration > Router Password` and set the following:
   1. Password: `mj02`

## Configuration Backup
1.  go to `System > Flash > Backup > Generate Archive` and save it to downloads.

## iOS Tethering Setup
1. Go to `System > Software`
2. Click `Update lists...`
3. Using Filter, install the following:
   1. `kmod-usb-net-rndis`
   2. `kmod-usb-net-ipheth`
   3. `usbmuxd`
   4. `usbutils`
4. In an ssh terminal, enter the following:
   1. `usbmuxd -v`
   2. `sed -i -e "\$i usbmuxd" /etc/rc.local`
5. Plug an iPhone into the Pi over USB
6. `eth2` should now be visible under Devices
7. Click `Network > Interfaces > Devices > Add device configuration...` and set the following:
   1. Device type: `Bridge device`
   2. Device name: `br-wan`
   3. Bridge ports: `eth1` and `eth2`
8. Go to `Interfaces > WAN > Edit` and change device to `br-wan`
9. Unlock your iPhone, and after the notification appears, click `Trust this Computer` to start the tether.
10. A green bubble will appear in the top right of your phone screen.

## Logging Setup
1. Open an SSH terminal (`root@192.168.1.1`, password is `mj02`)
2. Install dependencies with `opkg install git-http python3-pip`
3. Install paho with `pip install -r paho-mqtt`
4. Git clone https://github.com/uzairmahmed/Capstone-MJ02
5. Copy `communication/services/firebase_collector.service` into `/etc/systemd/system` with `sudo cp Capstone-MJ02/communication/services/firebase_collector.service /etc/systemd/system`
6. `sudo systemctl daemon-reload`
7. `sudo systemctl enable firebase_collector.service`
8. `sudo systemctl start firebase_collector.service`

---
---

## To Do
- Setup VPN with OpenVPN and ExpressVPN
- ~~Setup iPhone Ethernet Tethering for WAN~~
- ~~Setup Ryerson WiFi Security Certs~~ *not possible*
- ~~Setup Network Logging~~
- ~~Setup MQTT Client Functionality~~
---
## Sources
- https://openwrt.org/docs/guide-quick-start/basic_wifi
- https://openwrt.org/toh/raspberry_pi_foundation/raspberry_pi
