#include <ESP8266WiFi.h>
#include <PubSubClient.h>
// WiFi
// const char *ssid = "NW Coextro WIFI"; // Enter your WiFi name
// const char *password = "wycik96now";  // Enter WiFi password
const char *ssid = "iPhone"; // Enter your WiFi name
const char *password = "12345678";  // Enter WiFi password
// MQTT Broker
const char *mqtt_broker = "172.20.10.4"; // Enter your WiFi or Ethernet IP
const char *topic = "iOT_1/logs";
const char *topic2 = "iOT_1/control";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient client(espClient);
void setup() {
 // Set software serial baud to 115200;
 Serial.begin(115200);
 
 // connecting to a WiFi network
 WiFi.begin(ssid, password);
 while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.println("Connecting to WiFi..");
 }
 
 Serial.println("Connected to the WiFi network");
 
 //connecting to a mqtt broker
 client.setServer(mqtt_broker, mqtt_port);
 client.setCallback(callback);
 
 while (!client.connected()) {
 String client_id = "esp8266-client-";
 client_id += String(WiFi.macAddress());
 
 Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());
 
 if (client.connect(client_id.c_str())) {
  Serial.println("Public emqx mqtt broker connected");
 } else {
  Serial.print("failed with state ");
  Serial.print(client.state());
  delay(2000);
 }
}
 
 // publish and subscribe
 client.publish(topic, "Hello From ESP8266!");
 client.subscribe(topic2);
}
void callback(char *topic, byte *payload, unsigned int length) {
 Serial.print("Message arrived in topic: ");
 Serial.println(topic);
 Serial.print("Message:");
 
 for (int i = 0; i < length; i++) {
   //This is where the command is recieved 
  Serial.print((char) payload[i]);
 }
 
 Serial.println();
 Serial.println(" - - - - - - - - - - - -");
}
void loop() {
  //This is where the loop is 
  //Add sesnor reading here
 client.loop();
 //Replace the string here for sending the data
 client.publish(topic, "{PowerStatus: Power: Voltage: Current: }");
 delay (2000);
}