void setup() {
  pinMode(9, OUTPUT);  //DEFINE O PINO COMO SAÍDA
}
 
void loop() {
  if (Serial.available()) {
    int rx = Serial.parseInt();

    switch(rx){
      case 0:
        digitalWrite(9, LOW);
      case 1:
        digitalWrite(9, HIGH);
    }
  }
}