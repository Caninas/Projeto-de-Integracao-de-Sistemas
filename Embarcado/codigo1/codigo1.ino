#include <Stepper.h>  
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

#include <ArduinoHttpClient.h>

const int stepsPerRevolution = 500;
int passos = 50;                     //Passos a cada acionamento do botao  

int luminosidade;
int sensibilidade;

Stepper myStepper(stepsPerRevolution, D1, D3, D2, D4);  

char ssid[13] = "PEDRO_2.4GHz";
char password[9] = "51037465";

int porta_server = 8070;

//char ipAPI[14] = "192.168.0.25";
//int portaAPI = ":8000";
#define API_IP "192.168.0.25:8000"

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

  //server.on("/info", HTTP_PUT, PUTinfo);
  //server.on("/configurar", HTTP_POST, Configurar);
  //server.begin();

  myStepper.setSpeed(60);
}

void loop() {
  server.handleClient();
  luminosidade = analogRead(A0);

  PUTinfo();
  Configuracoes();

  //Serial.println(luminosidade);
  if (luminosidade >= sensibilidade) {
    myStepper.step(passos); 
    digitalWrite(D8, HIGH);
  } else {
    myStepper.step(-passos); 
    digitalWrite(D8, LOW);
  }

  
  delay(300);
}

void Configuracoes() {
  WiFiClient client;
  HTTPClient http;

  http.begin(client, "http://" API_IP "/sensor/configuracao");
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.GET();

  if (httpCode > 0) {
    Serial.println(http.getString().toInt());
    sensibilidade = http.getString().toInt();
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