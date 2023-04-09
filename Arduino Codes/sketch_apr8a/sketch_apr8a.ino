const int trigPin = 10;  // Trigger pin of ultrasonic sensor connected to digital pin 10
const int echoPin = 11;  // Echo pin of ultrasonic sensor connected to digital pin 11

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;  // Calculate distance in centimeters
  

  if(distance <= 70)
  {
        Serial.print(distance);
        Serial.print(" cm");
        Serial.println("");
  }
  else
  {
    Serial.print(70);
        Serial.print(" cm");
    Serial.println("");
  }

  delay(250);  // Wait for 1 second before taking next measurement
}