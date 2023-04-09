#include <DHT.h>

#define DHTPIN 2          // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11     // DHT 11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(250);                  // Wait 2 seconds between measurements
  float humidity = dht.readHumidity();      // Read humidity value from DHT11 sensor
  float temperature = dht.readTemperature();  // Read temperature value from DHT11 sensor
  
  // Check if any reading failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print(humidity);
  //Serial.print("%;");
  Serial.print(";");
  Serial.print(temperature);
  Serial.println("");
  //Serial.println(" C");
}
