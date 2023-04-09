#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_INA219.h>
#include <stdlib.h>
#include <ArduinoJson.h>

// Current Sensor
Adafruit_INA219 ina219;

// Pin Declarations
const int bluePin = 14;  // 14 corresponds to GPIO14
const int greenPin = 12; // 12 corresponds to GPIO12
const int redPin = 13;   // 13 corresponds to GPIO13
const int relay = 15;

const int resolution = 256;

unsigned long previousMillis = 0;
unsigned long measurementinterval = 1000;

// WiFi
// const char *ssid = "NW Coextro WIFI"; // Enter your WiFi name
// const char *password = "wycik96now";  // Enter WiFi password
const char *ssid = "iPhone";       // Enter your WiFi name
const char *password = "12345678"; // Enter WiFi password
// const char *ssid = "Capstone";         // Enter your WiFi name
// const char *password = "capstoneMJ02"; // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "172.20.10.4"; // Enter your WiFi or Ethernet IP
const int mqtt_port = 1883;

const char *topic = "iOT_1/logs";
const char *topic2 = "iOT_1/control";
const char *topic3 = "iOT_1/debug";

WiFiClient espClient;
PubSubClient client(espClient);

void setup()
{
    // Serial Init -----------------------------------------------

    Serial.begin(115200);
    Serial.println("Hello!");

    // INA219 Init -----------------------------------------------

    if (!ina219.begin())
    {
        Serial.println("Failed to find INA219 chip");
        while (1)
        {
            delay(10);
        }
    }

    // Relay Init ------------------------------------------------

    pinMode(relay, OUTPUT);
    digitalWrite(relay, LOW);

    // WiFi Init -------------------------------------------------

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }

    Serial.println("Connected to the WiFi network");

    // MQTT Init -------------------------------------------------

    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);

    while (!client.connected())
    {
        String client_id = "esp8266-client-";
        client_id += String(WiFi.macAddress());

        Serial.printf("The client: %s is connecting to Mosquitto Broker\n", client_id.c_str());

        if (client.connect(client_id.c_str()))
        {
            Serial.println("MQTT Broker connected");
        }
        else
        {
            Serial.print("failed with state ");
            Serial.println(client.state());
            delay(2000);
        }
    }

    client.publish(topic3, "Hello From ESP8266!");
    client.subscribe(topic2);
}

void callback(char *topic, byte *message, unsigned int length)
{
    Serial.println("-------------------------------------------------");
    // Retrieve Message
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");

    String messageTemp;

    for (int i = 0; i < length; i++)
    {
        Serial.print((char)message[i]);
        messageTemp += (char)message[i];
    }
    Serial.println();

    // Parse Message JSON
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, messageTemp);
    JsonObject obj = doc.as<JsonObject>();
    JsonObject internalobj = obj["/control"];

    // If control is power
    String on_off_val = internalobj["on_off"];
    if (on_off_val != "null")
    {
        if (on_off_val == "true")
        {
            Serial.println("\nPowering on");
            digitalWrite(relay, LOW);
        }
        else if (on_off_val == "false")
        {
            Serial.println("\nPowering off");
            digitalWrite(relay, HIGH);
        }
    }

    // If control is color
    String color_val = internalobj["color"];
    if (color_val != "null")
    {
        int rCol = color_val.substring(0, 3).toInt();
        int gCol = color_val.substring(4, 7).toInt();
        int bCol = color_val.substring(8, 11).toInt();

        analogWrite(redPin, rCol);
        analogWrite(greenPin, gCol);
        analogWrite(bluePin, bCol);
    }

    Serial.println("-------------------------------------------------");
}

void measureAndPublish()
{
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

    char buffer[50];
    sprintf(buffer, "{\"current_mA\": %.2f, \"loadvoltage\": %.2f, \"power_mW\": %.2f}", current_mA, loadvoltage, power_mW);
    Serial.println(buffer);
    client.publish(topic, buffer);
}

void loop()
{

  client.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis > measurementinterval)
  {
    previousMillis = currentMillis;
    measureAndPublish();
  }
}