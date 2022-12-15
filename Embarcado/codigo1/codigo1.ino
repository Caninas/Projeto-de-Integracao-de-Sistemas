#include <Stepper.h>  
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

#include <ArduinoJson.h>

const int stepsPerRevolution = 500;
int passos = 50;                     //Passos a cada acionamento do botao  

int luminosidade = 0;
int sensibilidade = 0;
Stepper myStepper(stepsPerRevolution, D1, D2, D3, D4);  

char ssid[25] = "DESKTOP-8I3FOFR 7262";
char password[9] = "00kV{171";

#define API_IP "150.162.150.124:8000"

int porta_server = 8070;
ESP8266WebServer server(porta_server); // server API

void setup() {
  Serial.begin(115200);
  pinMode(D8, OUTPUT);
  WiFi.begin(ssid, password);

  Serial.print("Conectando"); 
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.print("Conectado | Endereço IP: ");
  Serial.print(WiFi.localIP()); 
  Serial.print(":"); 
  Serial.println(porta_server); 

  myStepper.setSpeed(60);
}

void loop() {
  server.handleClient();

  luminosidade = analogRead(A0);

  Serial.println(luminosidade);
  Serial.println(sensibilidade);
  Serial.println("Configurando");
  Configuracoes();
  Serial.println("PUTinfo");
  PUTinfo();
  Serial.println("Tudo certo");

  if (luminosidade >= sensibilidade) {
    myStepper.step(passos); 
    digitalWrite(D8, HIGH);
  } else {
    myStepper.step(-passos); 
    digitalWrite(D8, LOW);
  }

  delay(700);
}

void Configuracoes() {
  WiFiClient client;
  HTTPClient http;

  http.begin(client, "http://" API_IP "/sensor/configuracao");
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.GET();

  if (httpCode > 0) {
    const int capacity = JSON_OBJECT_SIZE(4);
    StaticJsonDocument<capacity> doc;

    DeserializationError err = deserializeJson(doc, http.getString());
    if (err) {
      Serial.print(F("deserializeJson() failed with code "));
      Serial.println(err.f_str());

    } else {
      String str = String(doc["sensibilidade"]);
      sensibilidade = str.toInt();
    }
  }
}

void PUTinfo() {
  WiFiClient client;
  HTTPClient http;

  http.begin(client, "http://" API_IP "/sensor");
  http.addHeader("Content-Type", "application/json");


  char json[100];
  strcat(json, "{");                    // abre json


  strcat(json, "\"status\": \"Online\",");   // status
  

  strcat(json, "\"sensibilidade\": ");       // sensibilidade
  char sens[5];
  sprintf(sens, "%d", sensibilidade);
  strcat(json, sens);
  strcat(json, ",");
  

  strcat(json, "\"luminosidade\": ");       // luminosidade
  char lum[5];
  sprintf(lum, "%d", luminosidade);
  strcat(json, lum);
  

  strcat(json, "}");                    // fecha json


  int httpCode = http.PUT(json);

  if (httpCode = 0) {
    Serial.println("Server API Offline");
  }
  http.end();
}