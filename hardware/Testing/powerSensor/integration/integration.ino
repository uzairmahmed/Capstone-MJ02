#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_INA219.h>
#include <stdlib.h>

//Current Sensor
Adafruit_INA219 ina219;

String redString = "255";
String greenString = "255";
String blueString = "255";
int count = 0; 


const int bluePin = 14;    // 14 corresponds to GPIO14
const int greenPin = 12;   // 12 corresponds to GPIO12
const int redPin = 13;     // 13 corresponds to GPIO13
const int relay = 15;



const int resolution = 256;
// WiFi
// const char *ssid = "NW Coextro WIFI"; // Enter your WiFi name
// const char *password = "wycik96now";  // Enter WiFi password
// const char *ssid = "iPhone"; // Enter your WiFi name
// const char *password = "12345678";  // Enter WiFi password
const char *ssid = "Capstone"; // Enter your WiFi name
const char *password = "capstoneMJ02";  // Enter WiFi password
// MQTT Broker

//const char *mqtt_broker = "172.20.10.4"; // Enter your WiFi or Ethernet IP
const char *mqtt_broker = "192.168.1.143"; // Enter your WiFi or Ethernet IP
const char *topic = "iOT_1/logs";
const char *topic2 = "iOT_1/control";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient client(espClient);


void setup() {
 // Set software serial baud to 115200;
 Serial.begin(115200);

  analogWriteRange(resolution);
  analogWrite(redPin, 0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);

 /////////////////////////////////
 //Power Sensor
 uint32_t currentFrequency;
    
  Serial.println("Hello!");
  
  // Initialize the INA219.
  // By default the initialization will use the largest range (32V, 2A).  However
  // you can call a setCalibration function to change this range (see comments).
  if (! ina219.begin()) {
    Serial.println("Failed to find INA219 chip");
    while (1) { delay(10); }
  }
  // To use a slightly lower 32V, 1A range (higher precision on amps):
  //ina219.setCalibration_32V_1A();
  // Or to use a lower 16V, 400mA range (higher precision on volts and amps):
  //ina219.setCalibration_16V_400mA();
 ///////////////////////////////////

 //////////////////////////////
 //Relay setup
 pinMode(relay, OUTPUT);
 digitalWrite(relay, LOW);
 //////////////////////////////




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
  String myString = "";// String((char *) payload);
  Serial.print(myString);
  for (int i = 0; i < length; i++) {
    //This is where the command is recieved 
    Serial.print((char) payload[i]);
    myString += ((char) payload[i]);
  }
  //Serial.print(myString);
  String power = "PowerOff";
  if(power.equals(myString)){
    Serial.print("\nPowering off");
    digitalWrite(relay, HIGH);
  }
  delay(5000);
  Serial.print("\nPowering on");
  digitalWrite(relay, LOW);



 
 
 Serial.println();
 Serial.println(" - - - - - - - - - - - -");
}
void loop() {
  //This is where the loop is 
  //Add sesnor reading here

  
  if (count == 0){
      redString = "255";
      greenString = "0";
      blueString = "0";
      count = count + 1; 
  }
  else if(count == 1){
      redString = "0";
      greenString = "255";
      blueString = "0";
      count = count + 1; 
  }
  else{
      redString = "0";
      greenString = "0";
      blueString = "255";
      count = 0; 
  }
 

  analogWrite(redPin, redString.toInt());
  analogWrite(greenPin, greenString.toInt());
  analogWrite(bluePin, blueString.toInt());
  client.loop();
  float shuntvoltage = 0;
  float busvoltage = 0;
  float current_mA = 0;
  float loadvoltage = 0;
  float power_mW = 0;
  char destination[8];
 
  shuntvoltage = ina219.getShuntVoltage_mV();
  busvoltage = ina219.getBusVoltage_V();
  current_mA = ina219.getCurrent_mA();
  power_mW = ina219.getPower_mW();
  loadvoltage = busvoltage + (shuntvoltage / 1000);
  

  // Serial.print("Bus Voltage:   "); Serial.print(busvoltage); Serial.println(" V");
  // Serial.print("Shunt Voltage: "); Serial.print(shuntvoltage); Serial.println(" mV");
  // Serial.print("Load Voltage:  "); Serial.print(loadvoltage); Serial.println(" V");
  // Serial.print("Current:       "); Serial.print(current_mA); Serial.println(" mA");
  // Serial.print("Power:         "); Serial.print(power_mW); Serial.println(" mW");
  // Serial.println("");

  //string power = "PowerStatus: " + String(power_mW) + " mW";
  //float parameter = 123.123; // floating number
  // string resultant;
  // resultant=to_string(power_mW);
  
  // dtostrf(power_mW, 5, 2, destination);

 //Replace the string here for sending the data
 char buffer[50];

 sprintf(buffer, "{\"current_mA\": %.2f, \"loadvoltage\": %.2f, \"power_mW\": %.2f}", current_mA, loadvoltage, power_mW);
 Serial.println(buffer);
 client.publish(topic, buffer);
 delay(10000);
}