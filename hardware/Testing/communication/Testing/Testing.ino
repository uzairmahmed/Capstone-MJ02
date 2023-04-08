#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <stdlib.h>
#include <ArduinoJson.h>

String redString = "255";
String greenString = "255";
String blueString = "255";
int count = 0;

// WiFi
// const char *ssid = "NW Coextro WIFI"; // Enter your WiFi name
// const char *password = "wycik96now";  // Enter WiFi password
// const char *ssid = "iPhone";       // Enter your WiFi name
// const char *password = "12345678"; // Enter WiFi password
const char *ssid = "Capstone";         // Enter your WiFi name
const char *password = "capstoneMJ02"; // Enter WiFi password
// MQTT Broker

const char *mqtt_broker = "192.168.1.143"; // Enter your WiFi or Ethernet IP
// const char *mqtt_broker = "192.168.1.143"; // Enter your WiFi or Ethernet IP
const char *topic = "iOT_1/logs";
const char *topic2 = "iOT_1/control";
const char *topic3 = "iOT_1/debug";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient client(espClient);

void setup()
{
  // Set software serial baud to 115200;
  Serial.begin(115200);
  Serial.println("Hello!");

  // connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");

  // connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected())
  {
    String client_id = "esp8266-client-";
    client_id += String(WiFi.macAddress());

    Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());

    if (client.connect(client_id.c_str()))
    {
      Serial.println("Public emqx mqtt broker connected");
    }
    else
    {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }

  // publish and subscribe
  client.publish(topic3, "Hello From ESP8266!");
  client.subscribe(topic2);
}
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  const char *myString = ""; // String((char *) payload);
  Serial.print(myString);
  for (int i = 0; i < length; i++)
  {
    // This is where the command is recieved
    Serial.print((char)payload[i]);
    myString += ((char)payload[i]);
  }

  const char *json = myString;
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, json);

  bool onOff = doc["/on_off"];
  Serial.println("The value of /on_off is:");
  Serial.println(onOff);

  if (onOff)
  {
    Serial.print("\nPowering on");
  }
  else
  {
    Serial.print("\nPowering off");
  }

  Serial.println();
  Serial.println(" - - - - - - - - - - - -");
}
void loop()
{

  if (count == 0)
  {
    redString = "255";
    greenString = "0";
    blueString = "0";
    count = count + 1;
  }
  else if (count == 1)
  {
    redString = "0";
    greenString = "255";
    blueString = "0";
    count = count + 1;
  }
  else
  {
    redString = "0";
    greenString = "0";
    blueString = "255";
    count = 0;
  }

  client.loop();
  float shuntvoltage = 0;
  float busvoltage = 0;
  float current_mA = 0;
  float loadvoltage = 0;
  float power_mW = 0;
  char destination[8];

  shuntvoltage = 0.69;
  busvoltage = 0.69;
  current_mA = 0.69;
  power_mW = 0.69;
  loadvoltage = busvoltage + (shuntvoltage / 1000);

  // Replace the string here for sending the data
  char buffer[50];

  sprintf(buffer, "{\"current_mA\": %.2f, \"loadvoltage\": %.2f, \"power_mW\": %.2f}", current_mA, loadvoltage, power_mW);
  Serial.println(buffer);
  client.publish(topic, buffer);
  delay(10000);
}